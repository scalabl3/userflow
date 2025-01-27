import { Repository, DataSource } from 'typeorm';
import { Organization } from '../models/Organization';

export class OrganizationRepository extends Repository<Organization> {
    constructor(dataSource: DataSource) {
        super(Organization, dataSource.manager);
    }

    // Add custom methods for Organization repository here
}
