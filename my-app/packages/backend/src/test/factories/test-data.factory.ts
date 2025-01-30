import { auth, user, organization } from '../__mocks__';
import { LoginProvider } from '../../models/LoginProvider';
import { LoginCredential } from '../../models/LoginCredential';
import { BaseUser } from '../../models/BaseUser';
import { User } from '../../models/User';
import { 
  CreatePasswordCredentialDto,
  CreateOAuthCredentialDto,
  ResponseLoginCredentialDto,
  CreateBaseUserDto,
  UpdateBaseUserDto,
  ResponseBaseUserDto,
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  ResponseOrganizationDto
} from '@my-app/shared';
import { Organization } from '../../models/Organization';

export class TestDataFactory {
  // Provider factories
  static createLoginProvider(type: 'email' | 'google', overrides = {}) {
    const base = auth.providers[type];
    return { ...base, ...overrides } as LoginProvider;
  }

  // User factories
  static createUser(overrides = {}) {
    return { ...user.standard, ...overrides } as User;
  }

  static createBaseUser(withCredentials = true, overrides = {}) {
    const baseUser = { ...user.base, ...overrides };
    if (withCredentials) {
      baseUser.loginCredentials = [auth.credentials.password];
    }
    return baseUser as BaseUser;
  }

  // Auth factories
  static createCredential(type: 'password' | 'google', overrides = {}) {
    const base = type === 'password' 
      ? auth.credentials.password 
      : auth.credentials.google;
    return { ...base, ...overrides } as LoginCredential;
  }

  static createCredentialDto<T extends CreatePasswordCredentialDto | CreateOAuthCredentialDto | ResponseLoginCredentialDto>(
    type: 'password' | 'google',
    dtoType: 'create' | 'response',
    overrides = {}
  ): T {
    const base = auth.credentialDtos[dtoType][type];
    return { ...base, ...overrides } as T;
  }

  // User DTO factories
  static createBaseUserDto<T extends CreateBaseUserDto | UpdateBaseUserDto | ResponseBaseUserDto>(
    dtoType: 'create' | 'update' | 'response',
    overrides = {}
  ): T {
    const base = user.baseUserDtos[dtoType];
    return { ...base, ...overrides } as T;
  }

  static createUserDto<T extends CreateUserDto | UpdateUserDto | ResponseUserDto>(
    dtoType: 'create' | 'update' | 'response',
    overrides = {}
  ): T {
    const base = user.dtos[dtoType];
    return { ...base, ...overrides } as T;
  }

  // Complex scenarios
  static async createFullUserSetup() {
    const baseUser = await this.createBaseUser();
    const user = await this.createUser({ baseUserId: baseUser.id });
    return { baseUser, user };
  }

  static createBaseUserWithLoginCredentials(type: 'password' | 'google' = 'password', overrides = {}) {
    // Create provider first
    const provider = this.createLoginProvider(type === 'password' ? 'email' : 'google');
    
    // Create credential with reference to provider
    const credential = this.createCredential(type, {
      loginProvider: provider,
      loginProviderId: provider.id
    });

    // Create base user with reference to credential
    const baseUser = this.createBaseUser(false, {
      ...overrides,
      loginCredentials: [credential]
    });

    // Update credential with reference to base user
    credential.baseUser = baseUser;
    credential.baseUserId = baseUser.id;

    // Update provider's credentials array
    provider.credentials = [credential];

    return { baseUser, credential, provider };
  }

  static createUserWithLoginCredentials(type: 'password' | 'google' = 'password', overrides = {}) {
    // Create base user with credentials first
    const { baseUser, credential, provider } = this.createBaseUserWithLoginCredentials(type);
    
    // Create user extending the base user
    const user = this.createUser({
      ...overrides,
      ...baseUser,
      loginCredentials: [credential]
    });

    return { user, credential, provider };
  }

  // Organization factories
  static createOrganization(overrides = {}) {
    return { ...organization.standard, ...overrides } as Organization;
  }

  static createOrganizationDto<T extends CreateOrganizationDto | UpdateOrganizationDto | ResponseOrganizationDto>(
    dtoType: 'create' | 'update' | 'response',
    overrides = {}
  ): T {
    const base = organization.dtos[dtoType];
    return { ...base, ...overrides } as T;
  }
} 