/**
 * User and BaseUser mock data for testing.
 * 
 * Core Features:
 * - Mock user instances (base and standard)
 * - Mock user DTOs for all types
 * - Standard test data setup
 * 
 * Structure:
 * - BaseUser: Core user functionality
 * - User: Organization-specific user
 * - DTOs: Create, Update, and Response
 * - Preferences: Theme and notifications
 */

import { UserState } from '@my-app/shared';
import { BaseUser } from '../../../models/BaseUser';
import { User } from '../../../models/User';
import { core } from './core.mock';
import { auth } from './auth.mock';
import { 
  CreateBaseUserDto,
  UpdateBaseUserDto,
  ResponseBaseUserDto,
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto
} from '@my-app/shared';

/**
 * Mock BaseUser DTOs for testing.
 * Includes core user data without organization context.
 */
const baseUserDtos = {
  create: {
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true
  } as CreateBaseUserDto,
  update: {
    firstname: 'Johnny',
    state: UserState.ACTIVE
  } as UpdateBaseUserDto,
  response: {
    id: core.ids.baseUser,
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true,
    lastLoginAt: core.timestamps.past,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as ResponseBaseUserDto
};

/**
 * Mock User DTOs for testing.
 * Includes organization-specific user data.
 */
const userDtos = {
  create: {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    displayname: 'John Doe',
    contactEmail: 'john@example.com',
    organizationId: core.ids.organization
  } as CreateUserDto,
  update: {
    displayname: 'Johnny Doe',
    preferences: { theme: 'dark' as const }
  } as UpdateUserDto,
  response: {
    id: core.ids.user,
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    displayname: 'John Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true,
    organizationId: core.ids.organization,
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true
      }
    },
    lastLoginAt: core.timestamps.past,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as ResponseUserDto
};

/**
 * Create a mock BaseUser instance.
 * Includes core user fields and relationships.
 * 
 * Features:
 * - Standard user information
 * - Authentication credentials
 * - State management
 * - Timestamps
 * 
 * @returns Configured BaseUser instance
 */
const createBaseUser = (): BaseUser => {
  const baseUser = new BaseUser();
  baseUser.id = core.ids.baseUser;
  baseUser.firstname = 'John';
  baseUser.lastname = 'Doe';
  baseUser.contactEmail = 'john@example.com';
  baseUser.state = UserState.ACTIVE;
  baseUser.isEnabled = true;
  baseUser.createdAt = core.timestamps.past;
  baseUser.modifiedAt = core.timestamps.now;
  baseUser.loginCredentials = [auth.credentials.password];
  baseUser.lastLoginAt = core.timestamps.past;
  baseUser.deleted = false;
  return baseUser;
};

/**
 * Create a mock User instance.
 * Extends BaseUser with organization-specific fields.
 * 
 * Features:
 * - Organization membership
 * - Display customization
 * - User preferences
 * - Theme settings
 * - Notification preferences
 * 
 * @returns Configured User instance
 */
const createUser = (): User => {
  const user = new User();
  user.id = core.ids.user;
  user.firstname = 'John';
  user.lastname = 'Doe';
  user.contactEmail = 'john@example.com';
  user.state = UserState.ACTIVE;
  user.isEnabled = true;
  user.createdAt = core.timestamps.past;
  user.modifiedAt = core.timestamps.now;
  user.loginCredentials = [auth.credentials.password];
  user.lastLoginAt = core.timestamps.past;
  user.deleted = false;
  // User-specific fields
  user.username = 'johndoe';
  user.displayname = 'John Doe';
  user.organizationId = core.ids.organization;
  user.preferences = {
    theme: 'light',
    notifications: {
      email: true,
      push: true
    }
  };
  return user;
};

/**
 * User mock data export.
 * 
 * @property base - BaseUser instance for core testing
 * @property standard - User instance for organization testing
 * @property baseUserDtos - DTOs for BaseUser operations
 * @property dtos - DTOs for User operations
 */
export const user = {
  base: createBaseUser(),
  standard: createUser(),
  baseUserDtos,
  dtos: userDtos
}; 