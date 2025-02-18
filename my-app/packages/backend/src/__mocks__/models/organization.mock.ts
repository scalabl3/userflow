/**
 * Organization mock data for testing organization functionality.
 * 
 * Core Features:
 * - Mock organization instances
 * - Mock organization DTOs
 * - Standard test data setup
 * 
 * Structure:
 * - Instances: Individual organizations
 * - Lists: Collections for testing
 * - DTOs: Create, Update, Response
 * 
 * Relationships:
 * - Has-many Users (1:M)
 * - Has-one AdminUser (1:1)
 * - Has-one StripeCustomer (1:1)
 */

import { Organization } from '@my-app/backend/src/models/Organization';
import { User } from '@my-app/backend/src/models/User';
import { SubscriptionStatus, UserState } from '@my-app/shared';
import { core } from './core.mock';
import { 
  CreateOrganizationDto,
  UpdateOrganizationDto,
  ResponseOrganizationDto,
  ResponseUserDto
} from '@my-app/shared';

/**
 * Create a mock Organization instance.
 * @param overrides - Optional property overrides
 */
const createOrganization = (
  id: string,
  name: string,
  adminUserId: string,
  subscriptionStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE,
  overrides: Partial<Organization> = {}
): Organization => {
  const organization = new Organization();
  organization.id = id;
  organization.name = name;
  // Create a minimal admin user
  const adminUser = new User();
  adminUser.id = adminUserId;
  organization.adminUser = adminUser;
  organization.visible = false;
  organization.stripeCustomerId = `cus_${id}`;
  organization.subscriptionStatus = subscriptionStatus;
  organization.createdAt = core.timestamps.past;
  organization.modifiedAt = core.timestamps.now;
  organization.deleted = false;
  // Create a minimal user list
  const defaultUser = new User();
  defaultUser.id = core.ids.user;
  organization.users = [defaultUser];
  return Object.assign(organization, overrides);
};

/**
 * Mock organization instances for different test scenarios
 */
const instances = {
  // Standard organization
  standard: createOrganization(
    core.ids.organization,
    'Test Organization',
    core.ids.user
  ),

  // Organization with multiple users
  withUsers: createOrganization(
    core.ids.organization2,
    'Multi-User Org',
    core.ids.user,
    SubscriptionStatus.ACTIVE,
    {
      users: [
        Object.assign(new User(), { id: core.ids.user }),
        Object.assign(new User(), { id: core.ids.user2 }),
        Object.assign(new User(), { id: core.ids.user3 })
      ]
    }
  ),

  // Organization with different subscription states
  pastDue: createOrganization(
    core.ids.organization3,
    'Past Due Org',
    core.ids.user,
    SubscriptionStatus.PAST_DUE
  ),

  suspended: createOrganization(
    core.ids.organization4,
    'Suspended Org',
    core.ids.user2,
    SubscriptionStatus.SUSPENDED,
    {
      users: [Object.assign(new User(), { id: core.ids.user2 })]
    }
  ),

  trial: createOrganization(
    core.ids.organization5,
    'Trial Org',
    core.ids.user,
    SubscriptionStatus.TRIAL
  ),

  // Special cases
  noUsers: createOrganization(
    'org-no-users',
    'Empty Org',
    core.ids.user,
    SubscriptionStatus.ACTIVE,
    { users: [] }
  ),

  noStripe: createOrganization(
    'org-no-stripe',
    'No Stripe Org',
    core.ids.user,
    SubscriptionStatus.FREE,
    { stripeCustomerId: undefined }
  )
};

/**
 * Mock organization DTOs for testing API operations
 */
const dtos = {
  create: {
    standard: {
      name: 'Test Organization',
      visible: true,
      adminUser: core.ids.user,
      stripeCustomerId: `cus_${core.ids.organization}`,
      subscriptionStatus: SubscriptionStatus.ACTIVE
    } as CreateOrganizationDto,
    minimal: {
      name: 'Test Organization',
      adminUser: core.ids.user
    } as CreateOrganizationDto
  },
  update: {
    standard: {
      name: 'Updated Organization',
      visible: true,
      stripeCustomerId: `cus_${core.ids.organization}_updated`,
      subscriptionStatus: SubscriptionStatus.ACTIVE
    } as UpdateOrganizationDto,
    subscription: {
      subscriptionStatus: SubscriptionStatus.PAST_DUE
    } as UpdateOrganizationDto
  },
  response: {
    standard: {
      id: core.ids.organization,
      name: 'Test Organization',
      visible: false,
      adminUser: core.ids.user,
      users: [{
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
      } as ResponseUserDto],
      stripeCustomerId: `cus_${core.ids.organization}`,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseOrganizationDto,
    withUsers: {
      id: core.ids.organization2,
      name: 'Multi-User Org',
      visible: false,
      adminUser: core.ids.user,
      users: [
        {
          id: core.ids.user,
          firstname: 'John',
          lastname: 'Doe',
          username: 'johndoe',
          displayname: 'John Doe',
          contactEmail: 'john@example.com',
          state: UserState.ACTIVE,
          isEnabled: true,
          organizationId: core.ids.organization2,
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
        } as ResponseUserDto,
        {
          id: core.ids.user3,
          firstname: 'Bob',
          lastname: 'Johnson',
          username: 'bobjohnson',
          displayname: 'Bob Johnson',
          contactEmail: 'bob@example.com',
          state: UserState.ACTIVE,
          isEnabled: true,
          organizationId: core.ids.organization2,
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
      ],
      stripeCustomerId: `cus_${core.ids.organization2}`,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      createdAt: core.timestamps.past,
      modifiedAt: core.timestamps.now
    } as ResponseOrganizationDto
  }
};

/**
 * Mock organization lists for testing collection operations
 */
const lists = {
  empty: [],
  single: [instances.standard],
  multiple: [
    instances.standard,
    instances.withUsers,
    instances.pastDue
  ],
  bySubscriptionStatus: {
    active: [instances.standard, instances.withUsers],
    pastDue: [instances.pastDue],
    suspended: [instances.suspended],
    trial: [instances.trial]
  },
  byUserCount: {
    none: [instances.noUsers],
    single: [instances.standard],
    multiple: [instances.withUsers]
  }
};

/**
 * Organization mock data export
 */
export const organization = {
  instances,
  lists,
  dtos,
  createOrganization
}; 