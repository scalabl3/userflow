import { core } from './core.mock';
import { user } from './user.mock';
import { Organization } from '../../models/Organization';
import { 
  CreateOrganizationDto,
  UpdateOrganizationDto,
  ResponseOrganizationDto
} from '@my-app/shared';

const organizationDtos = {
  create: {
    name: 'Test Organization',
    visible: true,
    adminUser: user.standard.id
  } as CreateOrganizationDto,
  update: {
    name: 'Updated Organization',
    visible: false
  } as UpdateOrganizationDto,
  response: {
    id: core.ids.organization,
    name: 'Test Organization',
    visible: true,
    adminUser: user.standard.id,
    users: [user.dtos.response],
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
    adminUser: user.standard.id,
    users: [user.standard],
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as Organization,
  // DTO mocks
  dtos: organizationDtos
}; 