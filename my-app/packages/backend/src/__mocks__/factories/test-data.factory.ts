/**
 * Factory class for generating test data with consistent structure and relationships.
 * Provides utility methods for creating test entities and DTOs with proper relationships.
 * 
 * Core Features:
 * - Entity creation (User, BaseUser, Organization, LoginProvider, LoginCredential)
 * - DTO generation for all entity types
 * - Complex scenario generation with proper relationships
 * - Customizable through overrides
 * 
 * Factory Categories:
 * - Basic Entities: Single entity creation
 * - DTOs: Request/Response DTO generation
 * - Complex Scenarios: Multi-entity setups with relationships
 * 
 * Usage:
 * - Unit Tests: Creating isolated test entities
 * - Integration Tests: Setting up related entities
 * - E2E Tests: Generating complete test scenarios
 * - Service Tests: Creating entities with proper relationships
 */

import { auth } from '../models/auth.mock';
import { user } from '../models/user.mock';
import { organization } from '../models/organization.mock';
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
  /**
   * Create a login provider instance for testing.
   * Supports email and Google OAuth providers.
   * 
   * @param type - Provider type ('email' or 'google')
   * @param overrides - Optional property overrides
   * @returns Configured LoginProvider instance
   */
  static createLoginProvider(type: 'email' | 'google', overrides = {}) {
    const base = auth.providers[type];
    return { ...base, ...overrides } as LoginProvider;
  }

  /**
   * Create a standard user instance for testing.
   * Includes organization membership and preferences.
   * 
   * @param overrides - Optional property overrides
   * @returns Configured User instance
   */
  static createUser(overrides = {}) {
    return { ...user.standard, ...overrides } as User;
  }

  /**
   * Create a base user instance for testing.
   * Optionally includes login credentials.
   * 
   * @param withCredentials - Whether to include default credentials
   * @param overrides - Optional property overrides
   * @returns Configured BaseUser instance
   */
  static createBaseUser(withCredentials = true, overrides = {}) {
    const baseUser = { ...user.base, ...overrides };
    if (withCredentials) {
      const credential = this.createCredential('password', {});
      baseUser.loginCredentials = [credential];
    }
    return baseUser as BaseUser;
  }

  /**
   * Create a login credential instance for testing.
   * Supports password and Google OAuth credentials.
   * 
   * @param type - Credential type ('password' or 'google')
   * @param overrides - Optional property overrides
   * @returns Configured LoginCredential instance
   */
  static createCredential(type: 'password' | 'google', overrides = {}) {
    const base = type === 'password' 
      ? auth.credentials.password 
      : auth.credentials.google;
    return { ...base, ...overrides } as LoginCredential;
  }

  /**
   * Create a credential DTO for testing.
   * Supports creation and response DTOs for both auth types.
   * 
   * @template T - DTO type (Create/Response)
   * @param type - Credential type ('password' or 'google')
   * @param dtoType - DTO category ('create' or 'response')
   * @param overrides - Optional property overrides
   * @returns Configured credential DTO
   */
  static createCredentialDto<T extends CreatePasswordCredentialDto | CreateOAuthCredentialDto | ResponseLoginCredentialDto>(
    type: 'password' | 'google',
    dtoType: 'create' | 'response',
    overrides = {}
  ): T {
    const base = auth.credentialDtos[dtoType][type];
    return { ...base, ...overrides } as T;
  }

  /**
   * Create a base user DTO for testing.
   * Supports creation, update, and response DTOs.
   * 
   * @template T - DTO type (Create/Update/Response)
   * @param dtoType - DTO category ('create', 'update', or 'response')
   * @param overrides - Optional property overrides
   * @returns Configured base user DTO
   */
  static createBaseUserDto<T extends CreateBaseUserDto | UpdateBaseUserDto | ResponseBaseUserDto>(
    dtoType: 'create' | 'update' | 'response',
    overrides = {}
  ): T {
    const base = user.baseUserDtos[dtoType];
    return { ...base.standard, ...overrides } as unknown as T;
  }

  /**
   * Create a user DTO for testing.
   * Supports creation, update, and response DTOs.
   * 
   * @template T - DTO type (Create/Update/Response)
   * @param dtoType - DTO category ('create', 'update', or 'response')
   * @param overrides - Optional property overrides
   * @returns Configured user DTO
   */
  static createUserDto<T extends CreateUserDto | UpdateUserDto | ResponseUserDto>(
    dtoType: 'create' | 'update' | 'response',
    overrides = {}
  ): T {
    const base = user.dtos[dtoType];
    return { ...base.standard, ...overrides } as unknown as T;
  }

  /**
   * Create a complete user setup with base user and standard user.
   * Establishes proper relationship between entities.
   * 
   * @returns Object containing related base user and user instances
   */
  static async createFullUserSetup() {
    const baseUser = await this.createBaseUser();
    const user = await this.createUser({ baseUserId: baseUser.id });
    return { baseUser, user };
  }

  /**
   * Create a base user with login credentials and provider.
   * Sets up complete authentication structure with proper relationships.
   * 
   * @param type - Credential type ('password' or 'google')
   * @param overrides - Optional property overrides for base user
   * @returns Object containing related entities (baseUser, credential, provider)
   */
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

  /**
   * Create a user with login credentials and provider.
   * Sets up complete user structure with authentication.
   * 
   * @param type - Credential type ('password' or 'google')
   * @param overrides - Optional property overrides for user
   * @returns Object containing related entities (user, credential, provider)
   */
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

  /**
   * Create an organization instance for testing.
   * Includes admin user and member relationships.
   * 
   * @param overrides - Optional property overrides
   * @returns Configured Organization instance
   */
  static createOrganization(overrides = {}) {
    return { ...organization.instances.standard, ...overrides } as Organization;
  }

  /**
   * Create an organization DTO for testing.
   * Supports creation, update, and response DTOs.
   * 
   * @template T - DTO type (Create/Update/Response)
   * @param dtoType - DTO category ('create', 'update', or 'response')
   * @param overrides - Optional property overrides
   * @returns Configured organization DTO
   */
  static createOrganizationDto<T extends CreateOrganizationDto | UpdateOrganizationDto | ResponseOrganizationDto>(
    dtoType: 'create' | 'update' | 'response',
    overrides = {}
  ): T {
    const base = organization.dtos[dtoType];
    return { ...base.standard, ...overrides } as unknown as T;
  }
} 