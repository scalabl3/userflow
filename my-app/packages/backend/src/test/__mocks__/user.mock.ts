import { UserState } from '@my-app/shared';
import { BaseUser } from '../../models/BaseUser';
import { User } from '../../models/User';
import { core } from './core.mock';
import { auth } from './auth.mock';
import { 
  CreateBaseUserDto,
  UpdateBaseUserDto,
  ResponseBaseUserDto,
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto
} from '@my-app/shared';

const baseUserDtos = {
  create: {
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true
  } as CreateBaseUserDto,
  update: {
    firstname: 'Johnny',
    state: UserState.ACTIVE
  } as UpdateBaseUserDto,
  response: {
    id: core.ids.baseUser,
    firstname: 'John',
    lastname: 'Doe',
    displayname: 'John Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true,
    lastLoginAt: core.timestamps.past,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as ResponseBaseUserDto
};

const userDtos = {
  create: {
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    displayname: 'John Doe',
    contactEmail: 'john@example.com',
    organizationId: core.ids.organization
  } as CreateUserDto,
  update: {
    displayname: 'Johnny Doe',
    preferences: { theme: 'dark' as const }
  } as UpdateUserDto,
  response: {
    id: core.ids.user,
    firstname: 'John',
    lastname: 'Doe',
    username: 'johndoe',
    displayname: 'John Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true,
    organizationId: core.ids.organization,
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true
      }
    },
    lastLoginAt: core.timestamps.past,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now
  } as ResponseUserDto
};

export const user = {
  base: {
    id: core.ids.baseUser,
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now,
    loginCredentials: [auth.credentials.password],
    lastLoginAt: core.timestamps.past
  } as BaseUser,
  standard: {
    id: core.ids.user,
    firstname: 'John',
    lastname: 'Doe',
    contactEmail: 'john@example.com',
    state: UserState.ACTIVE,
    isEnabled: true,
    createdAt: core.timestamps.past,
    modifiedAt: core.timestamps.now,
    loginCredentials: [auth.credentials.password],
    lastLoginAt: core.timestamps.past,
    username: 'johndoe',
    displayname: 'John Doe',
    organizationId: core.ids.organization,
    preferences: { 
      theme: 'light',
      notifications: {
        email: true,
        push: true
      }
    },
    setDefaultPreferences() {
      if (!this.preferences) {
        this.preferences = {
          theme: 'light',
          notifications: {
            email: true,
            push: true
          }
        };
      }
    }
  } as User,
  baseUserDtos,
  dtos: userDtos
}; 