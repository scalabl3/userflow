/**
 * Authentication mock data for testing auth flows.
 * 
 * Core Features:
 * - Mock tokens
 * - Mock auth requests
 * - Standard test data setup
 * 
 * Structure:
 * - Tokens: Access and refresh tokens
 * - Requests: Login and refresh requests
 */

import { OAuthProvider } from '@my-app/shared/dist/enums/CredentialType';
import { core } from './core.mock';

/**
 * Authentication mock data export
 */
export const auth = {
  // Auth flow test data
  tokens: {
    valid: {
      accessToken: {
        token: 'valid.jwt.token',
        expiresAt: core.timestamps.future
      },
      refreshToken: {
        token: 'valid.refresh.token',
        expiresAt: core.timestamps.future
      }
    },
    expired: {
      accessToken: {
        token: 'expired.jwt.token',
        expiresAt: core.timestamps.past
      },
      refreshToken: {
        token: 'expired.refresh.token',
        expiresAt: core.timestamps.past
      }
    },
    invalid: {
      accessToken: {
        token: 'invalid.jwt.format',
        expiresAt: core.timestamps.future
      },
      refreshToken: {
        token: 'invalid.refresh.format',
        expiresAt: core.timestamps.future
      }
    }
  },

  // Test request data
  requests: {
    login: {
      email: {
        identifier: core.constants.email,
        password: core.constants.password
      },
      google: {
        code: 'google-auth-code',
        provider: OAuthProvider.GOOGLE
      },
      apple: {
        code: 'apple-auth-code',
        provider: OAuthProvider.APPLE,
        identityToken: 'apple-identity-token'
      }
    },
    refresh: {
      valid: {
        refreshToken: 'valid.refresh.token'
      },
      expired: {
        refreshToken: 'expired.refresh.token'
      },
      invalid: {
        refreshToken: 'invalid.refresh.format'
      }
    }
  },

  // Credential instances
  credentials: {
    password: {
      id: core.ids.passwordCred,
      identifier: core.constants.email,
      credentialType: 'PASSWORD',
      isEnabled: true,
      passwordHash: 'hashed_password'
    },
    google: {
      id: core.ids.googleCred,
      identifier: 'google-user-id',
      credentialType: 'OAUTH_GOOGLE',
      isEnabled: true,
      provider: OAuthProvider.GOOGLE
    }
  },

  // DTO instances
  credentialDtos: {
    create: {
      password: {
        identifier: core.constants.email,
        password: core.constants.password
      },
      google: {
        identifier: 'google-user-id',
        provider: OAuthProvider.GOOGLE
      }
    },
    response: {
      password: {
        id: core.ids.passwordCred,
        identifier: core.constants.email,
        credentialType: 'PASSWORD',
        isEnabled: true
      },
      google: {
        id: core.ids.googleCred,
        identifier: 'google-user-id',
        credentialType: 'OAUTH_GOOGLE',
        isEnabled: true,
        provider: OAuthProvider.GOOGLE
      }
    }
  }
}; 
