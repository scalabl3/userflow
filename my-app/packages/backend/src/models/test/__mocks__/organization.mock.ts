import { core } from './core.mock';
import { user } from './user.mock';
import { Organization } from '../../../models/Organization';
import { 
  CreateOrganizationDto,
  UpdateOrganizationDto,
  ResponseOrganizationDto
} from '@my-app/shared';

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

export const organization = {
  // Entity mock
  standard: {
    id: core.ids.organization,
    name: 'Test Organization',
    visible: true,
    adminUserId: user.standard.id,
    users: [user.standard],
    stripeCustomerId: 'cus_123456789',
    subscriptionStatus: 'active',
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as Organization,
  // DTO mocks
  dtos: organizationDtos
}; 