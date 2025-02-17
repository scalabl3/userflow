/**
 * Mock error responses used across test files for consistent error handling testing.
 * 
 * Core Features:
 * - Validation errors for missing fields and invalid formats
 * - Authentication errors including unauthorized access and token issues
 * - Resource not found errors for users and organizations
 * - Conflict errors for unique constraint violations
 * 
 * Each error object follows a standard structure:
 * - statusCode: HTTP status code
 * - message: Human-readable error message
 * - errors?: Array of field-specific validation errors (for validation errors only)
 */

/**
 * Collection of standardized error responses for testing error handling.
 * @type {Object} Structured error responses by category
 */
export const errors = {
  /** 
   * Validation error responses (400 Bad Request)
   * Used for testing input validation failures
   */
  validation: {
    missingField: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [{
        field: 'username',
        message: 'username is required'
      }]
    },
    invalidFormat: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [{
        field: 'email',
        message: 'email must be a valid email'
      }]
    }
  },
  /** 
   * Authentication error responses (401 Unauthorized)
   * Used for testing authentication and authorization failures
   */
  auth: {
    unauthorized: {
      statusCode: 401,
      message: 'Unauthorized'
    },
    invalidCredentials: {
      statusCode: 401,
      message: 'Invalid credentials'
    },
    tokenExpired: {
      statusCode: 401,
      message: 'Token has expired'
    }
  },
  /** 
   * Resource not found error responses (404 Not Found)
   * Used for testing resource lookup failures
   */
  notFound: {
    user: {
      statusCode: 404,
      message: 'User not found'
    },
    organization: {
      statusCode: 404,
      message: 'Organization not found'
    }
  },
  /** 
   * Resource conflict error responses (409 Conflict)
   * Used for testing unique constraint violations
   */
  conflict: {
    username: {
      statusCode: 409,
      message: 'Username already exists'
    },
    email: {
      statusCode: 409,
      message: 'Email already registered'
    }
  }
}; 