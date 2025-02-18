/**
 * BaseUser mock data for testing core user functionality.
 * 
 * Core Features:
 * - Mock user instances
 * - Mock user DTOs
 * - Standard test data setup
 * 
 * Structure:
 * - Instances: Individual users with credentials
 * - Lists: Collections for testing
 * - DTOs: Create, Update, Response
 * 
 * Relationships:
 * - Has LoginCredentials (1:M)
 */

import { BaseUser } from '@my-app/backend/src/models/BaseUser';
import { UserState } from '@my-app/shared';
import { core } from './core.mock';
import { loginCredential } from './loginCredential.mock';
import { 
  CreateBaseUserDto,
  UpdateBaseUserDto,
  ResponseBaseUserDto
} from '@my-app/shared';

/**
 * Create a mock BaseUser instance.
 * @param overrides - Optional property overrides
 */
const createBaseUser = (
  id: string,
  firstname: string,
  lastname: string,
  contactEmail: string,
  overrides: Partial<BaseUser> = {}
): BaseUser => {
  const user = new BaseUser();
  user.id = id;
  user.firstname = firstname;
  user.lastname = lastname;
  user.contactEmail = contactEmail;
  user.state = UserState.ACTIVE;
  user.isEnabled = true;
  user.createdAt = core.timestamps.past;
  user.modifiedAt = core.timestamps.now;
  user.lastLoginAt = core.timestamps.past;
  user.deleted = false;
  // Default to having a standard password credential
  user.loginCredentials = [loginCredential.instances.password.standard];
  return Object.assign(user, overrides);
};

/**
 * Mock user instances for different test scenarios
 */
const instances = {
  // Standard user with password auth
  standard: createBaseUser(
    core.ids.baseUser,
    'John',
    'Doe',
    core.constants.email
  ),

  // User with multiple credentials
  withMultipleCredentials: createBaseUser(
    core.ids.baseUser2,
    'Jane',
    'Smith',
    'jane@example.com',
    {
      loginCredentials: [
        loginCredential.instances.password.standard,
        loginCredential.instances.oauth.google
      ]
    }
  ),

  // User with only OAuth
  withOAuth: createBaseUser(
    core.ids.baseUser3,
    'Bob',
    'Johnson',
    'bob@example.com',
    {
      loginCredentials: [loginCredential.instances.oauth.google]
    }
  ),

  // Special cases
  disabled: createBaseUser(
    'base-user-disabled',
    'Disabled',
    'User',
    'disabled@example.com',
    { 
      isEnabled: false,
      state: UserState.SUSPENDED
    }
  ),

  noCredentials: createBaseUser(
    'base-user-no-creds',
    'New',
    'User',
    'new@example.com',
    { loginCredentials: [] }
  )
};

/**
 * Mock user DTOs for testing API operations
 */
const dtos = {
  create: {
    standard: {
      firstname: 'John',
      lastname: 'Doe',
      contactEmail: core.constants.email,
      state: UserState.ACTIVE,
      isEnabled: true
    } as CreateBaseUserDto,
    minimal: {
      firstname: 'John',
      lastname: 'Doe',
      contactEmail: core.constants.email
    } as CreateBaseUserDto
  },
  update: {
    standard: {
      firstname: 'Johnny',
      lastname: 'Doe Updated',
      state: UserState.ACTIVE
    } as UpdateBaseUserDto,
    disable: {
      isEnabled: false,
      state: UserState.SUSPENDED
    } as UpdateBaseUserDto
  },
  response: {
    standard: {
      id: core.ids.baseUser,
      firstname: 'John',
      lastname: 'Doe',
      contactEmail: core.constants.email,
      state: UserState.ACTIVE,
      isEnabled: true,
      lastLoginAt: core.timestamps.past,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now,
      loginCredentials: [loginCredential.dtos.response.password]
    } as ResponseBaseUserDto,
    withOAuth: {
      id: core.ids.baseUser3,
      firstname: 'Bob',
      lastname: 'Johnson',
      contactEmail: 'bob@example.com',
      state: UserState.ACTIVE,
      isEnabled: true,
      lastLoginAt: core.timestamps.past,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now,
      loginCredentials: [loginCredential.dtos.response.google]
    } as ResponseBaseUserDto
  }
};

/**
 * Mock user lists for testing collection operations
 */
const lists = {
  empty: [],
  single: [instances.standard],
  multiple: [
    instances.standard,
    instances.withMultipleCredentials,
    instances.withOAuth
  ],
  byState: {
    active: [instances.standard, instances.withOAuth],
    suspended: [instances.disabled]
  },
  byCredentials: {
    withPassword: [instances.standard],
    withOAuth: [instances.withOAuth],
    withMultiple: [instances.withMultipleCredentials],
    none: [instances.noCredentials]
  }
};

/**
 * BaseUser mock data export
 */
export const baseUser = {
  instances,
  lists,
  dtos,
  createBaseUser
}; 