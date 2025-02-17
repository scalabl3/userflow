/**
 * Operation type constants for service layer access control
 */
export const OperationType = {
    USER: 'USER_OP',      // Regular user operations
    ADMIN: 'ADMIN_OP',    // Organization admin operations
    SYSTEM: 'SYSTEM_OP'   // System owner operations
} as const;

export type OperationType = typeof OperationType[keyof typeof OperationType];

/**
 * Operation result constants for service layer logging
 */
export const OperationResult = {
    SUCCESS: 'SUCCESS',   // Operation completed successfully
    FAILURE: 'FAILURE',   // Operation failed with error
    DENIED: 'DENIED'      // Operation denied due to access control
} as const;

export type OperationResult = typeof OperationResult[keyof typeof OperationResult];

/**
 * Error codes for standardized error handling across services
 */
export const ServiceErrorCode = {
    // User-safe errors (can be shown to end users)
    NOT_FOUND: 'NOT_FOUND',           // Entity not found
    ALREADY_EXISTS: 'ALREADY_EXISTS',  // Unique constraint violation
    INVALID_INPUT: 'INVALID_INPUT',    // Validation failed
    INVALID_STATE: 'INVALID_STATE',    // Invalid state transition
    
    // Security-related errors (should be logged but not exposed)
    ACCESS_DENIED: 'ACCESS_DENIED',        // Operation not allowed
    SECURITY_VIOLATION: 'SECURITY_VIOLATION', // Security rule violated
    INVALID_TOKEN: 'INVALID_TOKEN',        // Authentication failed
    
    // System errors (for debugging and monitoring)
    SYSTEM_ERROR: 'SYSTEM_ERROR',          // Unexpected system error
    DATABASE_ERROR: 'DATABASE_ERROR',      // Database operation failed
    INTEGRATION_ERROR: 'INTEGRATION_ERROR', // External service error
    DATA_CORRUPTION: 'DATA_CORRUPTION'     // Data integrity issue
} as const;

export type ServiceErrorCode = typeof ServiceErrorCode[keyof typeof ServiceErrorCode];

/**
 * Context for operation logging
 */
export interface OperationLogContext {
    userId?: string;           // Who performed the action
    targetId?: string;         // What was affected
    organizationId?: string;   // Context of the operation
    error?: Error;            // If something went wrong
    changes?: string[];       // What was changed
    reason?: string;          // Why it failed/was denied
    metadata?: Record<string, any>;  // Additional context data
    securityEvent?: string;   // Security-related event type
    result?: string;          // Result of security check
    previousState?: string;   // Previous state in state changes
    newState?: string;       // New state in state changes
}

/**
 * Standard error response format
 */
export interface ServiceError {
    code: ServiceErrorCode;
    message: string;
    details?: Record<string, any>;
}

export default {
    OperationType,
    OperationResult,
    ServiceErrorCode
}; 