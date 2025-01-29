import { CredentialType, OAuthProvider } from '@my-app/shared';
import { core } from './core.mock';
import { LoginProvider } from '../../models/LoginProvider';
import { LoginCredential } from '../../models/LoginCredential';
import { 
  CreateLoginProviderDto, 
  UpdateLoginProviderDto, 
  ResponseLoginProviderDto,
  CreatePasswordCredentialDto,
  CreateOAuthCredentialDto,
  ResponseLoginCredentialDto
} from '@my-app/shared';

// First declare providers without credentials to avoid circular dependency
const providers = {
  email: {
    id: core.ids.emailProvider,
    code: 'email',
    name: 'Email Provider',
    isEnabled: true,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now,
    credentials: [] // Will be populated after credentials are defined
  } as LoginProvider,
  google: {
    id: core.ids.googleProvider,
    code: 'google',
    name: 'Google OAuth',
    isEnabled: true,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now,
    credentials: [] // Will be populated after credentials are defined
  } as LoginProvider
};

// Define credentials with references to providers
const credentials = {
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
};

// Now populate the credentials arrays in providers
providers.email.credentials = [credentials.password];
providers.google.credentials = [credentials.google];

// Add DTO representations
const providerDtos = {
  create: {
    email: {
      code: 'email',
      name: 'Email Provider',
      isEnabled: true
    } as CreateLoginProviderDto,
    google: {
      code: 'google',
      name: 'Google OAuth',
      isEnabled: true
    } as CreateLoginProviderDto
  },
  update: {
    email: {
      name: 'Updated Email Provider',
      isEnabled: false
    } as UpdateLoginProviderDto,
    google: {
      name: 'Updated Google OAuth',
      isEnabled: false
    } as UpdateLoginProviderDto
  },
  response: {
    email: {
      id: core.ids.emailProvider,
      code: 'email',
      name: 'Email Provider',
      isEnabled: true,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginProviderDto,
    google: {
      id: core.ids.googleProvider,
      code: 'google',
      name: 'Google OAuth',
      isEnabled: true,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginProviderDto
  }
};

// Add DTO representations for credentials
const credentialDtos = {
  create: {
    password: {
      identifier: 'john@example.com',
      loginProviderId: core.ids.emailProvider,
      credentialType: CredentialType.PASSWORD,
      password: 'password123',
      isEnabled: true
    } as CreatePasswordCredentialDto,
    google: {
      identifier: 'google-user-id',
      loginProviderId: core.ids.googleProvider,
      credentialType: CredentialType.OAUTH,
      provider: OAuthProvider.GOOGLE,
      accessToken: 'google-access-token',
      accessTokenExpiresAt: core.timestamps.future,
      refreshToken: 'google-refresh-token',
      refreshTokenExpiresAt: core.timestamps.future,
      scope: 'email profile',
      rawProfile: { email: 'john@example.com', name: 'John Doe' },
      isEnabled: true
    } as CreateOAuthCredentialDto
  },
  response: {
    password: {
      id: core.ids.passwordCred,
      identifier: 'john@example.com',
      loginProviderId: core.ids.emailProvider,
      loginProvider: providerDtos.response.email,
      credentialType: CredentialType.PASSWORD,
      isEnabled: true,
      hasPassword: true,
      baseUserId: core.ids.baseUser,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginCredentialDto,
    google: {
      id: core.ids.googleCred,
      identifier: 'google-user-id',
      loginProviderId: core.ids.googleProvider,
      loginProvider: providerDtos.response.google,
      credentialType: CredentialType.OAUTH,
      isEnabled: true,
      provider: OAuthProvider.GOOGLE,
      accessTokenExpiresAt: core.timestamps.future,
      hasRefreshToken: true,
      refreshTokenExpiresAt: core.timestamps.future,
      scope: 'email profile',
      rawProfile: { email: 'john@example.com', name: 'John Doe' },
      baseUserId: core.ids.baseUser,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginCredentialDto
  }
};

export const auth = {
  providers,
  providerDtos,
  credentials,
  credentialDtos,
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
