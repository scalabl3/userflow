/**
 * Organization mock data for testing.
 * 
 * Core Features:
 * - Mock organization instances
 * - Mock organization DTOs
 * - Standard test data setup
 * 
 * Structure:
 * - Standard organization with users
 * - DTOs for CRUD operations
 * - Stripe integration data
 */

import { core } from './core.mock';
import { user } from './user.mock';
import { Organization } from '../../../models/Organization';
import { 
  CreateOrganizationDto,
  UpdateOrganizationDto,
  ResponseOrganizationDto
} from '@my-app/shared';

/**
 * Mock organization DTOs for testing.
 * Includes create, update, and response DTOs.
 */
const organizationDtos = {
  create: {
    name: 'Test Organization',
    visible: true,
    adminUser: user.standard.id,
    stripeCustomerId: 'cus_123456789',
    subscriptionStatus: 'active'
  } as CreateOrganizationDto,
  update: {
    name: 'Updated Organization',
    visible: false,
    stripeCustomerId: 'cus_987654321',
    subscriptionStatus: 'past_due'
  } as UpdateOrganizationDto,
  response: {
    id: core.ids.organization,
    name: 'Test Organization',
    visible: true,
    adminUser: user.standard.id,
    users: [user.dtos.response],
    stripeCustomerId: 'cus_123456789',
    subscriptionStatus: 'active',
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as ResponseOrganizationDto
};

/**
 * Create a mock Organization instance.
 * Includes standard fields, relationships, and timestamps.
 * 
 * Features:
 * - Standard test organization
 * - Admin user relationship
 * - User membership
 * - Stripe integration
 * - Timestamps
 * 
 * @returns Configured Organization instance
 */
const createOrganization = (): Organization => {
  const organization = new Organization();
  organization.id = core.ids.organization;
  organization.name = 'Test Organization';
  organization.visible = true;
  organization.adminUserId = user.standard.id;
  organization.users = [user.standard];
  organization.stripeCustomerId = 'cus_123456789';
  organization.subscriptionStatus = 'active';
  organization.createdAt = core.timestamps.past;
  organization.modifiedAt = core.timestamps.now;
  organization.deleted = false;
  return organization;
};

/**
 * Organization mock data export.
 * 
 * @property standard - Standard organization instance
 * @property dtos - Organization DTOs for testing
 */
export const organization = {
  standard: createOrganization(),
  dtos: organizationDtos
}; 