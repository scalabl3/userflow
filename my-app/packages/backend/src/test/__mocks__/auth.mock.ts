import { CredentialType, OAuthProvider } from '@my-app/shared';
import { core } from './core.mock';
import { LoginProvider } from '../../models/LoginProvider';
import { LoginCredential } from '../../models/LoginCredential';

const providers = {
  email: {
    id: core.ids.emailProvider,
    code: 'email',
    name: 'Email Provider',
    isEnabled: true,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as LoginProvider,
  google: {
    id: core.ids.googleProvider,
    code: 'google',
    name: 'Google OAuth',
    isEnabled: true,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as LoginProvider
};

export const auth = {
  providers,
  credentials: {
    password: {
      id: core.ids.passwordCred,
      identifier: 'john@example.com',
      loginProviderId: core.ids.emailProvider,
      loginProvider: providers.email,
      credentialType: CredentialType.PASSWORD,
      isEnabled: true,
      passwordHash: 'hashed_password',
      baseUserId: core.ids.baseUser,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as LoginCredential,
    google: {
      id: core.ids.googleCred,
      identifier: 'google-user-id',
      loginProviderId: core.ids.googleProvider,
      loginProvider: providers.google,
      credentialType: CredentialType.OAUTH,
      isEnabled: true,
      provider: OAuthProvider.GOOGLE,
      baseUserId: core.ids.baseUser,
      accessToken: 'google-access-token',
      accessTokenExpiresAt: core.timestamps.future,
      refreshToken: 'google-refresh-token',
      refreshTokenExpiresAt: core.timestamps.future,
      scope: 'email profile',
      rawProfile: { email: 'john@example.com', name: 'John Doe' },
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as LoginCredential
  },
  tokens: {
    valid: {
      accessToken: 'valid-jwt-token',
      refreshToken: 'valid-refresh-token'
    },
    expired: {
      accessToken: 'expired-jwt-token',
      refreshToken: 'expired-refresh-token'
    }
  },
  requests: {
    login: {
      email: {
        identifier: 'john@example.com',
        password: 'password123'
      },
      google: {
        code: 'google-auth-code',
        provider: OAuthProvider.GOOGLE
      }
    }
  }
}; 
