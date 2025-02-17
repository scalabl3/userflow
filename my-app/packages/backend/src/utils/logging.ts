import { Logger } from '@nestjs/common';
import { 
    OperationType, 
    OperationResult, 
    OperationLogContext 
} from '../constants/service-operations';

/**
 * Creates a service logger with standardized logging methods.
 * Provides consistent logging format and context across services.
 * 
 * Features:
 * - Operation logging with context
 * - Error logging with stack traces
 * - Security event logging
 * - State change tracking
 * 
 * @param service - Name of the service for logging context
 * @returns Object containing logging utility methods
 */
export const createServiceLogger = (service: string) => {
    const logger = new Logger(service);
    
    return {
        /**
         * Log a service operation with full context.
         * Handles different operation results with appropriate log levels.
         * 
         * @param operationType - Type of operation being logged
         * @param operation - Name of the operation
         * @param result - Result of the operation
         * @param context - Additional context for the log
         */
        logOperation: (
            operationType: OperationType,
            operation: string,
            result: OperationResult,
            context: OperationLogContext
        ) => {
            const logContext = {
                type: operationType,
                operation,
                result,
                ...context
            };

            switch (result) {
                case OperationResult.SUCCESS:
                    logger.log(`${operation} succeeded`, logContext);
                    break;
                case OperationResult.FAILURE:
                    logger.error(`${operation} failed`, {
                        ...logContext,
                        error: context.error?.message,
                        stack: context.error?.stack
                    });
                    break;
                case OperationResult.DENIED:
                    logger.warn(`${operation} denied`, {
                        ...logContext,
                        reason: context.reason
                    });
                    break;
            }
        },

        /**
         * Log detailed error information.
         * Includes error message, stack trace, and operation context.
         * 
         * @param operationType - Type of operation that failed
         * @param operation - Name of the operation
         * @param error - Error object with details
         * @param context - Additional context excluding error info
         */
        logError: (
            operationType: OperationType,
            operation: string,
            error: Error,
            context: Omit<OperationLogContext, 'error'>
        ) => {
            logger.error(`${operation} error`, {
                type: operationType,
                operation,
                error: error.message,
                stack: error.stack,
                ...context
            });
        },

        /**
         * Log security-related events.
         * Used for access control, authentication, and other security concerns.
         * 
         * @param operationType - Type of operation being secured
         * @param operation - Name of the operation
         * @param context - Context including security event details
         */
        logSecurity: (
            operationType: OperationType,
            operation: string,
            context: OperationLogContext & {
                securityEvent: string;
            }
        ) => {
            logger.warn(`Security event: ${context.securityEvent}`, {
                type: operationType,
                operation,
                ...context
            });
        },

        /**
         * Log state changes.
         * Tracks entity state transitions with before/after values.
         * 
         * @param operationType - Type of operation causing state change
         * @param operation - Name of the operation
         * @param context - Context including previous and new states
         */
        logStateChange: (
            operationType: OperationType,
            operation: string,
            context: OperationLogContext & {
                previousState: string;
                newState: string;
            }
        ) => {
            logger.log(`State change: ${operation}`, {
                type: operationType,
                operation,
                ...context,
                transition: `${context.previousState} -> ${context.newState}`
            });
        }
    };
}; 