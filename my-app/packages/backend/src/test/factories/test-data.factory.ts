import { auth, user } from '../__mocks__';

export class TestDataFactory {
  // User factories
  static createUser(overrides = {}) {
    return { ...user.standard, ...overrides };
  }

  static createBaseUser(withCredentials = true, overrides = {}) {
    const baseUser = { ...user.base, ...overrides };
    if (withCredentials) {
      baseUser.loginCredentials = [auth.credentials.password];
    }
    return baseUser;
  }

  // Auth factories
  static createCredential(type: 'password' | 'google', overrides = {}) {
    const base = type === 'password' 
      ? auth.credentials.password 
      : auth.credentials.google;
    return { ...base, ...overrides };
  }

  // Complex scenarios
  static async createFullUserSetup() {
    const baseUser = await this.createBaseUser();
    const user = await this.createUser({ baseUserId: baseUser.id });
    return { baseUser, user };
  }
} 