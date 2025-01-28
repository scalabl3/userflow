import { Organization } from '../../models/Organization';
import { DatabaseHelper } from '../helpers/database.helper';

export class OrganizationFactory {
  static defaultData = {
    name: 'Test Organization',
    visible: true
  };

  static async create(overrides: Partial<Organization> = {}): Promise<Organization> {
    const dataSource = DatabaseHelper.getDataSource();
    const orgRepo = dataSource.getRepository(Organization);

    const orgData = {
      ...this.defaultData,
      ...overrides
    };

    const org = orgRepo.create(orgData);
    return await orgRepo.save(org);
  }

  static async createMany(count: number, overrides: Partial<Organization> = {}): Promise<Organization[]> {
    const organizations: Organization[] = [];
    
    for (let i = 0; i < count; i++) {
      const nameWithIndex = `${this.defaultData.name} ${i + 1}`;
      const org = await this.create({ 
        ...overrides,
        name: overrides.name || nameWithIndex 
      });
      organizations.push(org);
    }

    return organizations;
  }
} 