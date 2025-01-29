import { core } from './core.mock';
import { user } from './user.mock';
import { Organization } from '../../models/Organization';
import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/UpdateOrganizationDto';

export const organization = {
    standard: {
        id: core.ids.organization,
        name: 'Test Organization',
        visible: true,
        adminUser: user.standard.id,
        users: [user.standard],
        createdAt: core.timestamps.past,
        modifiedAt: core.timestamps.now
    } as Organization,
    dtos: {
        create: {
            name: 'Test Organization',
            visible: true,
            adminUser: user.standard.id
        } as CreateOrganizationDto,
        update: {
            name: 'Updated Organization',
            visible: false
        } as UpdateOrganizationDto
    }
}; 