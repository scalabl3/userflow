import { BaseUser } from '../../models/BaseUser';
import { User } from '../../models/User';
import { UserState } from '../../models/enums/UserState';
import { DatabaseHelper } from '../helpers/database.helper';
import { Organization } from '../../models/Organization';

export class UserFactory {
  static defaultData = {
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john.doe@example.com',
    state: UserState.ACTIVE,
    isEnabled: true
  };

  static async createBase(overrides: Partial<BaseUser> = {}): Promise<BaseUser> {
    const dataSource = DatabaseHelper.getDataSource();
    const baseUserRepo = dataSource.getRepository(BaseUser);

    const userData = {
      ...this.defaultData,
      ...overrides
    };

    const baseUser = baseUserRepo.create(userData);
    return await baseUserRepo.save(baseUser);
  }

  static async create(
    organization: Organization,
    overrides: Partial<User> = {}
  ): Promise<User> {
    const dataSource = DatabaseHelper.getDataSource();
    const userRepo = dataSource.getRepository(User);

    // Create base user first
    const baseUser = await this.createBase(overrides);

    const userData = {
      baseUser,
      organization,
      ...overrides
    };

    const user = userRepo.create(userData);
    return await userRepo.save(user);
  }

  static async createMany(
    organization: Organization,
    count: number,
    overrides: Partial<User> = {}
  ): Promise<User[]> {
    const users: User[] = [];
    
    for (let i = 0; i < count; i++) {
      const emailWithIndex = `john.doe${i + 1}@example.com`;
      const user = await this.create(organization, {
        ...overrides,
        contactEmail: overrides.contactEmail || emailWithIndex
      });
      users.push(user);
    }

    return users;
  }
} 