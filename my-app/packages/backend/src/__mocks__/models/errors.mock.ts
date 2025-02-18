/**
 * Mock error responses used across test files for consistent error handling testing.
 * 
 * Structure:
 * - validation: Input validation errors (400)
 * - auth: Authentication errors (401)
 * - forbidden: Permission errors (403)
 * - notFound: Resource not found errors (404)
 * - conflict: Resource conflict errors (409)
 * - subscription: Subscription-related errors (402, 403)
 * - businessLogic: Business rule violations (400)
 * - rateLimit: Rate limiting errors (429)
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
    },
    invalidEnum: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [{
        field: 'subscriptionStatus',
        message: 'subscriptionStatus must be a valid enum value'
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
    },
    invalidToken: {
      statusCode: 401,
      message: 'Invalid token format'
    }
  },
  /** 
   * Forbidden error responses (403 Forbidden)
   * Used for testing permission failures
   */
  forbidden: {
    notAdmin: {
      statusCode: 403,
      message: 'User is not an organization admin'
    },
    organizationAccess: {
      statusCode: 403,
      message: 'User does not have access to this organization'
    },
    resourceAccess: {
      statusCode: 403,
      message: 'Insufficient permissions to access this resource'
    },
    accountDisabled: {
      statusCode: 403,
      message: 'Account has been disabled'
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
    },
    credential: {
      statusCode: 404,
      message: 'Login credential not found'
    },
    provider: {
      statusCode: 404,
      message: 'Login provider not found'
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
    },
    organizationName: {
      statusCode: 409,
      message: 'Organization name already exists'
    }
  },
  /** 
   * Subscription error responses (402, 403)
   * Used for testing subscription-related failures
   */
  subscription: {
    pastDue: {
      statusCode: 402,
      message: 'Subscription payment is past due'
    },
    suspended: {
      statusCode: 403,
      message: 'Subscription has been suspended'
    },
    cancelled: {
      statusCode: 403,
      message: 'Subscription has been cancelled'
    },
    invalidPlan: {
      statusCode: 400,
      message: 'Invalid subscription plan'
    }
  },
  /** 
   * Business logic error responses (400)
   * Used for testing business rule violations
   */
  businessLogic: {
    organizationHasUsers: {
      statusCode: 400,
      message: 'Cannot delete organization with active users'
    },
    primaryCredential: {
      statusCode: 400,
      message: 'Cannot delete primary login credential'
    },
    invalidTransition: {
      statusCode: 400,
      message: 'Invalid state transition'
    },
    maxUsersReached: {
      statusCode: 400,
      message: 'Organization has reached maximum user limit'
    }
  },
  /** 
   * Rate limiting error responses (429 Too Many Requests)
   * Used for testing rate limiting failures
   */
  rateLimit: {
    tooManyRequests: {
      statusCode: 429,
      message: 'Too many requests, please try again later',
      retryAfter: 60 // seconds
    },
    tooManyFailedLogins: {
      statusCode: 429,
      message: 'Too many failed login attempts, please try again later',
      retryAfter: 300 // seconds
    }
  }
}; 