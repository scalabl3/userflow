import { Logger, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

/**
 * Error handling utilities for standardized error management.
 * 
 * Core Features:
 * - Consistent error handling across application
 * - Standardized error context tracking
 * - Custom error types for specific scenarios
 * - Error logging with context
 * - Type-safe error handling
 */

/**
 * Base error context interface.
 * Provides standardized structure for error context information.
 */
export interface ErrorContext {
    /** Name of the operation where error occurred */
    operation: string;
    /** Name of the entity involved in the error */
    entityName: string;
    /** Optional ID of the entity involved */
    entityId?: string;
    /** Optional additional error details */
    details?: Record<string, unknown>;
}

/**
 * Custom error for database-related failures.
 * Includes original error cause and context.
 */
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

/**
 * Custom error for validation failures.
 * Includes context about the validation that failed.
 */
export class ValidationError extends Error {
    constructor(
        message: string,
        public readonly context: ErrorContext
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Custom error for application-specific failures.
 * Includes context about where in the application the error occurred.
 */
export class ApplicationError extends Error {
    constructor(
        message: string,
        public readonly context: ErrorContext
    ) {
        super(message);
        this.name = 'ApplicationError';
    }
}

/**
 * Configuration options for error handling behavior.
 */
export interface ErrorHandlingConfig {
    /** If true, throws errors. If false, returns null/undefined */
    throwErrors?: boolean;
    /** If true, logs errors using provided logger */
    logErrors?: boolean;
}

const defaultConfig: ErrorHandlingConfig = {
    throwErrors: false,
    logErrors: true
};

/**
 * Handle errors in a consistent way across the application.
 * Provides standardized error logging and response handling.
 * 
 * Features:
 * - Consistent handling of not found cases
 * - Database error handling with query details
 * - Stack trace preservation
 * - Structured error logging
 * 
 * @template T - Type of successful response
 * @param logger - Logger instance to use for logging
 * @param error - Error to handle
 * @param context - Context information about where the error occurred
 * @returns null for not found cases, undefined for other errors
 * @throws Original error if configured to throw
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
 * Type guard to check if an error is a specific type.
 * Provides type-safe error handling in catch blocks.
 * 
 * @template T - Type of error to check for
 * @param error - Error to check
 * @param errorType - Constructor of error type to check against
 * @returns Type predicate indicating if error is of specified type
 */
export function isErrorType<T extends Error>(
    error: Error,
    errorType: new (...args: any[]) => T
): error is T {
    return error instanceof errorType;
}

/**
 * Create standardized error context object.
 * Helper function to ensure consistent error context structure.
 * 
 * @param operation - Name of the operation where error occurred
 * @param entityName - Name of the entity involved
 * @param entityId - Optional ID of the entity involved
 * @param details - Optional additional error details
 * @returns Structured error context object
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