import { core } from './core.mock';
import { user } from './user.mock';
import { Organization } from '../../models/Organization';

export const organization = {
    standard: {
        id: core.ids.organization,
        name: 'Test Organization',
        visible: true,
        adminUser: user.standard.id,
        users: [user.standard],
        createdAt: core.timestamps.past,
        modifiedAt: core.timestamps.now
    } as Organization
}; 