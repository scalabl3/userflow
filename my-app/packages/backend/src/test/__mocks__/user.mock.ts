import { UserState } from '@my-app/shared';
import { BaseUser } from '../../models/BaseUser';
import { User } from '../../models/User';
import { core } from './core.mock';
import { auth } from './auth.mock';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';

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
    primaryLoginCredentialId: core.ids.passwordCred,
    primaryLoginCredential: auth.credentials.password,
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
    primaryLoginCredentialId: core.ids.passwordCred,
    primaryLoginCredential: auth.credentials.password,
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
  dtos: {
    create: {
      firstname: 'John',
      lastname: 'Doe',
      username: 'johndoe',
      displayname: 'John Doe',
      contactEmail: 'john@example.com',
      organizationId: core.ids.organization
    },
    update: {
      displayname: 'Johnny Doe',
      preferences: { theme: 'dark' as const }
    } as UpdateUserDto
  },
  responses: {
    created: {
      id: core.ids.user,
      username: 'johndoe',
      displayname: 'John Doe'
    }
  }
}; 