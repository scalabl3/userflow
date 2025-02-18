/**
 * LoginProvider mock data for testing authentication providers.
 * 
 * Core Features:
 * - Mock provider instances
 * - Mock provider DTOs
 * - Standard test data setup
 * 
 * Structure:
 * - Instances: Individual providers (email, OAuth)
 * - Lists: Collections for testing
 * - DTOs: Create, Update, Response
 */

import { LoginProvider } from '@my-app/backend/src/models/LoginProvider';
import { core } from './core.mock';
import { 
  CreateLoginProviderDto,
  UpdateLoginProviderDto,
  ResponseLoginProviderDto
} from '@my-app/shared';

/**
 * Create a mock LoginProvider instance.
 * @param overrides - Optional property overrides
 */
const createLoginProvider = (
  id: string,
  code: string,
  name: string,
  overrides: Partial<LoginProvider> = {}
): LoginProvider => {
  const provider = new LoginProvider();
  provider.id = id;
  provider.code = code;
  provider.name = name;
  provider.isEnabled = true;
  provider.createdAt = core.timestamps.past;
  provider.modifiedAt = core.timestamps.now;
  provider.deleted = false;
  return Object.assign(provider, overrides);
};

/**
 * Mock provider instances for different test scenarios
 */
const instances = {
  // Standard email provider
  standard: createLoginProvider(
    core.ids.emailProvider,
    'email',
    'Email Provider'
  ),

  // OAuth providers
  oauth: {
    google: createLoginProvider(
      core.ids.googleProvider,
      'google',
      'Google OAuth'
    ),
    apple: createLoginProvider(
      core.ids.appleProvider,
      'apple',
      'Apple OAuth'
    )
  },

  // Special cases
  disabled: createLoginProvider(
    'provider-disabled',
    'disabled',
    'Disabled Provider',
    { isEnabled: false }
  ),
  withCredentials: createLoginProvider(
    'provider-with-creds',
    'with-creds',
    'Provider With Credentials'
  )
};

/**
 * Mock provider DTOs for testing API operations
 */
const dtos = {
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
    } as CreateLoginProviderDto,
    apple: {
      code: 'apple',
      name: 'Apple OAuth',
      isEnabled: true
    } as CreateLoginProviderDto
  },
  update: {
    standard: {
      name: 'Updated Provider',
      isEnabled: true
    } as UpdateLoginProviderDto,
    disable: {
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
    } as ResponseLoginProviderDto,
    apple: {
      id: core.ids.appleProvider,
      code: 'apple',
      name: 'Apple OAuth',
      isEnabled: true,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseLoginProviderDto
  }
};

/**
 * Mock provider lists for testing collection operations
 */
const lists = {
  empty: [],
  single: [instances.standard],
  multiple: [
    instances.standard,
    instances.oauth.google,
    instances.oauth.apple
  ],
  enabled: [
    instances.standard,
    instances.oauth.google
  ],
  disabled: [
    instances.disabled
  ],
  withCredentials: [
    instances.withCredentials
  ]
};

/**
 * LoginProvider mock data export
 */
export const loginProvider = {
  instances,
  lists,
  dtos
}; 