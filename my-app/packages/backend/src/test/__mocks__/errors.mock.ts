export const errors = {
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