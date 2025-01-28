import { LoginCredential } from '../../models/LoginCredential';
import { LoginProvider } from '../../models/LoginProvider';
import { BaseUser } from '../../models/BaseUser';
import { DatabaseHelper } from '../helpers/database.helper';

export class LoginCredentialFactory {
  static defaultData = {
    identifier: 'test@example.com',
    password: 'password123', // Only for password-based credentials
    isEnabled: true
  };

  static async create(
    baseUser: BaseUser,
    loginProvider: LoginProvider,
    overrides: Partial<LoginCredential> = {}
  ): Promise<LoginCredential> {
    const dataSource = DatabaseHelper.getDataSource();
    const credentialRepo = dataSource.getRepository(LoginCredential);

    const credentialData = {
      ...this.defaultData,
      baseUser,
      loginProvider,
      ...overrides
    };

    const credential = credentialRepo.create(credentialData);
    return await credentialRepo.save(credential);
  }

  static async createPasswordCredential(
    baseUser: BaseUser,
    overrides: Partial<LoginCredential> = {}
  ): Promise<LoginCredential> {
    const dataSource = DatabaseHelper.getDataSource();
    const providerRepo = dataSource.getRepository(LoginProvider);
    
    // Get or create password provider
    const passwordProvider = await providerRepo.findOne({ 
      where: { name: 'password' } 
    }) || await providerRepo.save(
      providerRepo.create({ name: 'password', isEnabled: true })
    );

    return this.create(baseUser, passwordProvider, overrides);
  }

  static async createOAuthCredential(
    baseUser: BaseUser,
    providerName: string,
    overrides: Partial<LoginCredential> = {}
  ): Promise<LoginCredential> {
    const dataSource = DatabaseHelper.getDataSource();
    const providerRepo = dataSource.getRepository(LoginProvider);
    
    // Get or create OAuth provider
    const oauthProvider = await providerRepo.findOne({ 
      where: { name: providerName } 
    }) || await providerRepo.save(
      providerRepo.create({ name: providerName, isEnabled: true })
    );

    return this.create(baseUser, oauthProvider, {
      password: null, // OAuth credentials don't have passwords
      ...overrides
    });
  }
} 