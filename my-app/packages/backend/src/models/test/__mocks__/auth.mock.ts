/**
 * Authentication mock data for testing authentication and authorization features.
 * 
 * Core Features:
 * - Mock login providers (email, OAuth)
 * - Mock credentials (password, OAuth tokens)
 * - Mock DTOs for all auth entities
 * - Mock tokens and requests
 * 
 * Test Categories:
 * - Provider Management: Email and OAuth provider testing
 * - Credential Validation: Password and token verification
 * - OAuth Integration: Google OAuth flow testing
 * - State Management: Enable/disable functionality
 * 
 * Structure:
 * - Providers: Email and Google OAuth providers
 * - Credentials: Password and Google OAuth credentials
 * - DTOs: Create, Update, and Response DTOs
 * - Tokens: Valid and expired token pairs
 * - Requests: Mock login requests
 * 
 * Usage:
 * - Service Tests: Testing auth service operations
 * - Controller Tests: Testing auth endpoints
 * - Integration Tests: Testing auth flows
 * - E2E Tests: Testing complete auth scenarios
 */

import { CredentialType, OAuthProvider } from '@my-app/shared';
import { core } from './core.mock';
import { LoginProvider } from '../../../models/LoginProvider';
import { LoginCredential } from '../../../models/LoginCredential';
import { 
  CreateLoginProviderDto, 
  UpdateLoginProviderDto, 
  ResponseLoginProviderDto,
  CreatePasswordCredentialDto,
  CreateOAuthCredentialDto,
  ResponseLoginCredentialDto
} from '@my-app/shared';

/**
 * Create a mock LoginProvider instance.
 * Used for testing provider management and validation.
 * 
 * Features:
 * - Unique identifier and code
 * - Enable/disable support
 * - Credential relationship
 * - Soft delete capability
 * - Standard timestamps
 * 
 * @param id - Provider UUID for consistent testing
 * @param code - Provider unique code (e.g., 'email', 'google')
 * @param name - Provider display name
 * @returns Configured LoginProvider instance
 */
const createLoginProvider = (
  id: string,
  code: string,
  name: string
): LoginProvider => {
  const provider = new LoginProvider();
  provider.id = id;
  provider.code = code;
  provider.name = name;
  provider.isEnabled = true;
  provider.createdAt = core.timestamps.past;
  provider.modifiedAt = core.timestamps.now;
  provider.deleted = false;
  provider.credentials = [];
  return provider;
};

/**
 * Create a mock LoginCredential instance.
 * Used for testing credential management and auth flows.
 * 
 * Features:
 * - Provider relationship
 * - User relationship
 * - Credential type support
 * - Enable/disable support
 * - Soft delete capability
 * - Standard timestamps
 * 
 * Test Cases:
 * - Password credentials
 * - OAuth credentials
 * - Disabled credentials
 * - Expired credentials
 * 
 * @param id - Credential UUID for consistent testing
 * @param identifier - User identifier (email/OAuth ID)
 * @param provider - Associated LoginProvider instance
 * @param type - Credential type (password/OAuth)
 * @param baseUserId - Associated user UUID
 * @returns Configured LoginCredential instance
 */
const createLoginCredential = (
  id: string,
  identifier: string,
  provider: LoginProvider,
  type: CredentialType,
  baseUserId: string
): LoginCredential => {
  const credential = new LoginCredential();
  credential.id = id;
  credential.identifier = identifier;
  credential.loginProviderId = provider.id;
  credential.loginProvider = provider;
  credential.credentialType = type;
  credential.isEnabled = true;
  credential.baseUserId = baseUserId;
  credential.createdAt = core.timestamps.past;
  credential.modifiedAt = core.timestamps.now;
  credential.deleted = false;
  return credential;
};

// Mock provider instances
/** Mock login providers without credentials */
const providers = {
  email: createLoginProvider(core.ids.emailProvider, 'email', 'Email Provider'),
  google: createLoginProvider(core.ids.googleProvider, 'google', 'Google OAuth')
};

// Mock credentials with provider references
const credentials = {
  password: (() => {
    const cred = createLoginCredential(
      core.ids.passwordCred,
      'john@example.com',
      providers.email,
      CredentialType.PASSWORD,
      core.ids.baseUser
    );
    cred.passwordHash = 'hashed_password';
    return cred;
  })(),
  google: (() => {
    const cred = createLoginCredential(
      core.ids.googleCred,
      'google-user-id',
      providers.google,
      CredentialType.OAUTH,
      core.ids.baseUser
    );
    cred.provider = OAuthProvider.GOOGLE;
    cred.accessToken = 'google-access-token';
    cred.accessTokenExpiresAt = core.timestamps.future;
    cred.refreshToken = 'google-refresh-token';
    cred.refreshTokenExpiresAt = core.timestamps.future;
    cred.profile = {
      scope: 'email profile',
      rawData: { email: 'john@example.com', name: 'John Doe' }
    };
    return cred;
  })()
};

// Now populate the credentials arrays in providers
providers.email.credentials = [credentials.password];
providers.google.credentials = [credentials.google];

/** Mock provider DTOs for testing */
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

/** Mock credential DTOs for testing */
const credentialDtos = {
  create: {
    password: {
      identifier: 'john@example.com',
      loginProviderId: core.ids.emailProvider,
      credentialType: CredentialType.PASSWORD,
      password: 'password123',
      isEnabled: true,
      baseUserId: core.ids.baseUser
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
      isEnabled: true,
      baseUserId: core.ids.baseUser
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

/**
 * Comprehensive authentication mock data export.
 * Provides all necessary mock data for auth testing.
 * 
 * Components:
 * @property providers - Mock LoginProvider instances for email and OAuth
 * @property providerDtos - Mock provider DTOs for CRUD operations
 * @property credentials - Mock LoginCredential instances for different auth types
 * @property credentialDtos - Mock credential DTOs for creation and responses
 * @property tokens - Mock JWT and refresh tokens (valid and expired)
 * @property requests - Mock authentication requests for different providers
 * 
 * Test Scenarios:
 * - Provider CRUD operations
 * - Credential management
 * - Authentication flows
 * - Token handling
 * - Error cases
 */
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
