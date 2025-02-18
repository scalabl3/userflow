/**
 * LoginCredential mock data for testing authentication credentials.
 * 
 * Core Features:
 * - Mock credential instances (password and OAuth)
 * - Credential creation method
 * - DTOs for API operations
 * 
 * Structure:
 * - instances: Credential instances by type
 * - lists: Collections for testing
 * - DTOs: Create, Response
 * 
 * Relationships:
 * - Belongs to LoginProvider (M:1)
 * - Belongs to BaseUser (M:1)
 */

import { LoginCredential } from '@my-app/backend/src/models/LoginCredential';
import { CredentialType } from '@my-app/shared';
import { core } from './core.mock';
import { loginProvider } from './loginProvider.mock';
import { baseUser } from './baseUser.mock';
import { 
  CreatePasswordCredentialDto,
  CreateOAuthCredentialDto,
  ResponseLoginCredentialDto
} from '@my-app/shared';

/**
 * Create a LoginCredential instance.
 * 
 * @param id - Credential identifier
 * @param identifier - User identifier (email/OAuth ID)
 * @param providerId - Associated provider ID
 * @param type - Credential type (PASSWORD/OAUTH)
 * @param baseUserId - Associated base user ID
 * @param overrides - Optional property overrides
 * @returns Configured LoginCredential instance
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
  credential.baseUserId = baseUserId;
  credential.isEnabled = true;
  credential.createdAt = core.timestamps.past;
  credential.modifiedAt = core.timestamps.now;
  credential.deleted = false;

  // Set type-specific fields
  if (type === CredentialType.PASSWORD) {
    credential.passwordHash = 'hashed_' + core.constants.password;
  } else if (type === CredentialType.OAUTH) {
    credential.accessToken = core.constants.oauthToken;
    credential.refreshToken = core.constants.oauthRefresh;
    credential.accessTokenExpiresAt = core.timestamps.future;
    credential.refreshTokenExpiresAt = core.timestamps.future;
  }

  return Object.assign(credential, overrides);
};

/**
 * Mock credential instances by type
 */
const instances = {
  // Password credentials
  password: {
    standard: createLoginCredential(
      core.ids.passwordCred,
      core.constants.email,
      core.ids.emailProvider,
      CredentialType.PASSWORD,
      core.ids.baseUser
    ),
    disabled: createLoginCredential(
      'cred-pass-disabled',
      'disabled@example.com',
      core.ids.emailProvider,
      CredentialType.PASSWORD,
      'base-user-disabled',
      { isEnabled: false }
    )
  },

  // OAuth credentials
  oauth: {
    google: createLoginCredential(
      core.ids.googleCred,
      'google-user-id',
      core.ids.googleProvider,
      CredentialType.OAUTH,
      core.ids.baseUser2,
      { 
        accessToken: core.constants.oauthToken,
        refreshToken: core.constants.oauthRefresh,
        accessTokenExpiresAt: core.timestamps.future,
        refreshTokenExpiresAt: core.timestamps.future
      }
    ),
    apple: createLoginCredential(
      core.ids.appleCred,
      'apple-user-id',
      core.ids.appleProvider,
      CredentialType.APPLE,
      core.ids.baseUser3,
      {
        accessToken: core.constants.oauthToken,
        refreshToken: core.constants.oauthRefresh,
        accessTokenExpiresAt: core.timestamps.future,
        refreshTokenExpiresAt: core.timestamps.future
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
      password: core.constants.password,
      loginProviderId: core.ids.emailProvider,
      credentialType: CredentialType.PASSWORD,
      baseUserId: core.ids.baseUser
    } as CreatePasswordCredentialDto,
    google: {
      identifier: 'google-user-id',
      loginProviderId: core.ids.googleProvider,
      credentialType: CredentialType.OAUTH,
      accessToken: core.constants.oauthToken,
      accessTokenExpiresAt: core.timestamps.future,
      refreshToken: core.constants.oauthRefresh,
      refreshTokenExpiresAt: core.timestamps.future,
      baseUserId: core.ids.baseUser2
    } as CreateOAuthCredentialDto
  },
  response: {
    password: {
      id: core.ids.passwordCred,
      identifier: core.constants.email,
      loginProviderId: core.ids.emailProvider,
      credentialType: CredentialType.PASSWORD,
      isEnabled: true,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginCredentialDto,
    google: {
      id: core.ids.googleCred,
      identifier: 'google-user-id',
      loginProviderId: core.ids.googleProvider,
      credentialType: CredentialType.OAUTH,
      isEnabled: true,
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
    instances.oauth.google
  ],
  byType: {
    password: [instances.password.standard],
    oauth: [instances.oauth.google, instances.oauth.apple]
  },
  byProvider: {
    [core.ids.emailProvider]: [instances.password.standard],
    [core.ids.googleProvider]: [instances.oauth.google],
    [core.ids.appleProvider]: [instances.oauth.apple]
  },
  byState: {
    enabled: [instances.password.standard, instances.oauth.google],
    disabled: [instances.password.disabled]
  }
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