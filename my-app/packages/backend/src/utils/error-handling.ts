import { Logger, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

// Base error context interface
export interface ErrorContext {
    operation: string;
    entityName: string;
    entityId?: string;
    details?: Record<string, unknown>;
}

// Custom error types
export class DatabaseError extends Error {
    constructor(
        message: string,
        public readonly cause: Error,
        public readonly context: ErrorContext
    ) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class ValidationError extends Error {
    constructor(
        message: string,
        public readonly context: ErrorContext
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class ApplicationError extends Error {
    constructor(
        message: string,
        public readonly context: ErrorContext
    ) {
        super(message);
        this.name = 'ApplicationError';
    }
}

// Error handling configuration
export interface ErrorHandlingConfig {
    throwErrors?: boolean;  // If true, throws errors. If false, returns null/undefined
    logErrors?: boolean;    // If true, logs errors
}

const defaultConfig: ErrorHandlingConfig = {
    throwErrors: false,
    logErrors: true
};

/**
 * Handles errors in a consistent way across the application
 * @param logger Logger instance to use for logging
 * @param error Error to handle
 * @param context Context information about where the error occurred
 * @returns null for not found cases, undefined for other errors
 */
export function handleError<T>(
    logger: Logger, 
    error: unknown, 
    context: ErrorContext
): T | null | undefined {
    // Handle "not found" cases consistently
    if (error instanceof NotFoundException) {
        logger.warn(`${context.entityName} not found`, {
            context,
            error: error.message
        });
        return null;
    }

    // Handle TypeORM specific errors
    if (error instanceof QueryFailedError) {
        logger.error(`Database error in ${context.operation}`, {
            context,
            error: error.message,
            query: error.query,
            parameters: error.parameters
        });
        return undefined;
    }

    // Handle known error types
    if (error instanceof Error) {
        logger.error(`Error in ${context.operation}: ${error.message}`, {
            context,
            stack: error.stack
        });
        return undefined;
    }

    // Handle unknown errors
    logger.error('Unknown error occurred', {
        context,
        error
    });
    return undefined;
}

/**
 * Type guard to check if an error is a specific type
 */
export function isErrorType<T extends Error>(
    error: Error,
    errorType: new (...args: any[]) => T
): error is T {
    return error instanceof errorType;
}

/**
 * Helper to create error context
 */
export function createErrorContext(
    operation: string,
    entityName: string,
    entityId?: string,
    details?: Record<string, unknown>
): ErrorContext {
    return {
        operation,
        entityName,
        ...(entityId && { entityId }),
        ...(details && { details })
    };
} 