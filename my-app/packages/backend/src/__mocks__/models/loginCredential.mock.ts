/**
 * LoginCredential mock data for testing authentication credentials.
 * 
 * Core Features:
 * - Mock credential instances
 * - Mock credential DTOs
 * - Standard test data setup
 * 
 * Structure:
 * - Instances: Individual credentials (password, OAuth)
 * - Lists: Collections for testing
 * - DTOs: Create, Response
 */

import { LoginCredential } from '@my-app/backend/src/models/LoginCredential';
import { CredentialType, OAuthProvider } from '@my-app/shared';
import { core } from './core.mock';
import { loginProvider } from './loginProvider.mock';
import { 
  CreatePasswordCredentialDto,
  CreateOAuthCredentialDto,
  ResponseLoginCredentialDto
} from '@my-app/shared';

/**
 * Create a mock LoginCredential instance.
 * @param overrides - Optional property overrides
 */
const createLoginCredential = (
  id: string,
  identifier: string,
  providerId: string,
  type: CredentialType,
  baseUserId: string,
  overrides: Partial<LoginCredential> = {}
): LoginCredential => {
  const credential = new LoginCredential();
  credential.id = id;
  credential.identifier = identifier;
  credential.loginProviderId = providerId;
  credential.credentialType = type;
  credential.isEnabled = true;
  credential.baseUserId = baseUserId;
  credential.createdAt = core.timestamps.past;
  credential.modifiedAt = core.timestamps.now;
  credential.deleted = false;
  return Object.assign(credential, overrides);
};

/**
 * Mock credential instances for different test scenarios
 */
const instances = {
  // Password credentials
  password: {
    standard: createLoginCredential(
      core.ids.passwordCred,
      core.constants.email,
      core.ids.emailProvider,
      CredentialType.PASSWORD,
      core.ids.baseUser,
      { passwordHash: 'hashed_password' }
    ),
    disabled: createLoginCredential(
      'password-disabled',
      core.constants.email,
      core.ids.emailProvider,
      CredentialType.PASSWORD,
      core.ids.baseUser,
      { 
        isEnabled: false,
        passwordHash: 'hashed_password'
      }
    )
  },

  // OAuth credentials
  oauth: {
    google: createLoginCredential(
      core.ids.googleCred,
      'google-user-id',
      core.ids.googleProvider,
      CredentialType.OAUTH,
      core.ids.baseUser,
      {
        provider: OAuthProvider.GOOGLE,
        accessToken: core.constants.oauthToken,
        accessTokenExpiresAt: core.timestamps.future,
        refreshToken: core.constants.oauthRefresh,
        refreshTokenExpiresAt: core.timestamps.future,
        profile: {
          scope: 'email profile',
          rawData: { 
            email: core.constants.email,
            name: 'John Doe'
          }
        }
      }
    ),
    apple: createLoginCredential(
      core.ids.appleCred,
      'apple-user-id',
      core.ids.appleProvider,
      CredentialType.OAUTH,
      core.ids.baseUser,
      {
        provider: OAuthProvider.APPLE,
        accessToken: core.constants.oauthToken,
        accessTokenExpiresAt: core.timestamps.future,
        refreshToken: core.constants.oauthRefresh,
        refreshTokenExpiresAt: core.timestamps.future,
        identityToken: 'apple-identity-token',
        authorizationCode: 'apple-auth-code',
        profile: {
          scope: 'email name',
          rawData: { 
            email: core.constants.email,
            name: 'John Doe'
          }
        }
      }
    )
  }
};

/**
 * Mock credential DTOs for testing API operations
 */
const dtos = {
  create: {
    password: {
      identifier: core.constants.email,
      loginProviderId: core.ids.emailProvider,
      credentialType: CredentialType.PASSWORD,
      password: core.constants.password,
      isEnabled: true,
      baseUserId: core.ids.baseUser
    } as CreatePasswordCredentialDto,
    google: {
      identifier: 'google-user-id',
      loginProviderId: core.ids.googleProvider,
      credentialType: CredentialType.OAUTH,
      provider: OAuthProvider.GOOGLE,
      accessToken: core.constants.oauthToken,
      accessTokenExpiresAt: core.timestamps.future,
      refreshToken: core.constants.oauthRefresh,
      refreshTokenExpiresAt: core.timestamps.future,
      scope: 'email profile',
      rawProfile: { 
        email: core.constants.email,
        name: 'John Doe'
      },
      isEnabled: true,
      baseUserId: core.ids.baseUser
    } as CreateOAuthCredentialDto,
    apple: {
      identifier: 'apple-user-id',
      loginProviderId: core.ids.appleProvider,
      credentialType: CredentialType.OAUTH,
      provider: OAuthProvider.APPLE,
      accessToken: core.constants.oauthToken,
      accessTokenExpiresAt: core.timestamps.future,
      refreshToken: core.constants.oauthRefresh,
      refreshTokenExpiresAt: core.timestamps.future,
      identityToken: 'apple-identity-token',
      authorizationCode: 'apple-auth-code',
      scope: 'email name',
      rawProfile: { 
        email: core.constants.email,
        name: 'John Doe'
      },
      isEnabled: true,
      baseUserId: core.ids.baseUser
    } as CreateOAuthCredentialDto
  },
  response: {
    password: {
      id: core.ids.passwordCred,
      identifier: core.constants.email,
      loginProviderId: core.ids.emailProvider,
      loginProvider: loginProvider.dtos.response.email,
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
      loginProvider: loginProvider.dtos.response.google,
      credentialType: CredentialType.OAUTH,
      isEnabled: true,
      provider: OAuthProvider.GOOGLE,
      accessTokenExpiresAt: core.timestamps.future,
      hasRefreshToken: true,
      refreshTokenExpiresAt: core.timestamps.future,
      scope: 'email profile',
      rawProfile: { 
        email: core.constants.email,
        name: 'John Doe'
      },
      baseUserId: core.ids.baseUser,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginCredentialDto,
    apple: {
      id: core.ids.appleCred,
      identifier: 'apple-user-id',
      loginProviderId: core.ids.appleProvider,
      loginProvider: loginProvider.dtos.response.apple,
      credentialType: CredentialType.OAUTH,
      isEnabled: true,
      provider: OAuthProvider.APPLE,
      accessTokenExpiresAt: core.timestamps.future,
      hasRefreshToken: true,
      refreshTokenExpiresAt: core.timestamps.future,
      hasIdentityToken: true,
      hasAuthorizationCode: true,
      scope: 'email name',
      rawProfile: { 
        email: core.constants.email,
        name: 'John Doe'
      },
      baseUserId: core.ids.baseUser,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginCredentialDto
  }
};

/**
 * Mock credential lists for testing collection operations
 */
const lists = {
  empty: [],
  single: [instances.password.standard],
  multiple: [
    instances.password.standard,
    instances.oauth.google,
    instances.oauth.apple
  ],
  byType: {
    password: [instances.password.standard],
    oauth: [
      instances.oauth.google,
      instances.oauth.apple
    ]
  },
  byProvider: {
    email: [instances.password.standard],
    google: [instances.oauth.google],
    apple: [instances.oauth.apple]
  },
  enabled: [
    instances.password.standard,
    instances.oauth.google
  ],
  disabled: [
    instances.password.disabled
  ]
};

/**
 * LoginCredential mock data export
 */
export const loginCredential = {
  instances,
  lists,
  dtos,
  createLoginCredential
}; 