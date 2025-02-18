/**
 * User mock data for testing organization-specific user functionality.
 * 
 * Core Features:
 * - Mock user instances extending BaseUser
 * - Mock user DTOs
 * - Organization-specific test data
 * 
 * Structure:
 * - Instances: Individual users with organization context
 * - Lists: Collections for testing
 * - DTOs: Create, Update, Response
 * 
 * Relationships:
 * - Extends BaseUser (1:1)
 * - Belongs-to Organization (M:1)
 */

import { User } from '@my-app/backend/src/models/User';
import { core } from './core.mock';
import { baseUser } from './baseUser.mock';
import { 
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto
} from '@my-app/shared';

/**
 * Create a mock User instance.
 * Extends BaseUser with organization-specific fields.
 * 
 * Features:
 * - Organization membership
 * - Display customization
 * 
 * @returns Configured User instance
 */
const createUser = (
  baseUserInstance: typeof baseUser.instances[keyof typeof baseUser.instances],
  username: string,
  displayname: string,
  organizationId: string,
  overrides: Partial<User> = {}
): User => {
    const user = new User();
    // Copy all BaseUser properties
    Object.assign(user, baseUserInstance);
    // Add User-specific properties
    user.username = username;
    user.displayname = displayname;
    user.organizationId = organizationId;
  
  return Object.assign(user, overrides);
};

/**
 * Mock user instances for different test scenarios
 */
const instances = {
  // Standard user with organization
  standard: createUser(
    baseUser.instances.standard,
    'johndoe',
    'John Doe',
    core.ids.organization
  ),

  // User with multiple credentials
  withMultipleCredentials: createUser(
    baseUser.instances.withMultipleCredentials,
    'janesmith',
    'Jane Smith',
    core.ids.organization2
  ),

  // User with only OAuth
  withOAuth: createUser(
    baseUser.instances.withOAuth,
    'bobjohnson',
    'Bob Johnson',
    core.ids.organization3
  ),

  // Special cases
  disabled: createUser(
    baseUser.instances.disabled,
    'disableduser',
    'Disabled User',
    core.ids.organization4
  ),

  noOrganization: createUser(
    baseUser.instances.standard,
    'newuser',
    'New User',
    '',
    { organizationId: '' }
  )
};

/**
 * Mock user DTOs for testing API operations
 */
const dtos = {
  create: {
    standard: {
      ...baseUser.dtos.create.standard,
      username: 'johndoe',
      displayname: 'John Doe',
      organizationId: core.ids.organization
    } as CreateUserDto,
    minimal: {
      ...baseUser.dtos.create.minimal,
      username: 'johndoe',
      organizationId: core.ids.organization
    } as CreateUserDto
  },
  update: {
    standard: {
      ...baseUser.dtos.update.standard,
      displayname: 'Johnny Doe'
    } as UpdateUserDto
  },
  response: {
    standard: {
      ...baseUser.dtos.response.standard,
      username: 'johndoe',
      displayname: 'John Doe',
      organizationId: core.ids.organization      
    } as ResponseUserDto,
    withOAuth: {
      ...baseUser.dtos.response.withOAuth,
      username: 'bobjohnson',
      displayname: 'Bob Johnson',
      organizationId: core.ids.organization3
    } as ResponseUserDto
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
  byOrganization: {
    [core.ids.organization]: [instances.standard],
    [core.ids.organization2]: [instances.withMultipleCredentials],
    [core.ids.organization3]: [instances.withOAuth],
    none: [instances.noOrganization]
  },
  byState: {
    active: [instances.standard, instances.withOAuth],
    suspended: [instances.disabled]
  }
};

/**
 * User mock data export
 */
export const user = {
  instances,
  lists,
  dtos,
  createUser,
  // Add standard and base references
  standard: instances.standard,
  base: baseUser.instances.standard,
  // Add baseUserDtos reference
  baseUserDtos: baseUser.dtos
}; 