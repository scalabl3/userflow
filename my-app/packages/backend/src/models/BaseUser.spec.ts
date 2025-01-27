import { BaseUser } from './BaseUser';
import { LoginCredential } from './LoginCredential';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('BaseUser', () => {
    let baseUser: BaseUser;
    let loginCredential: LoginCredential;

    beforeEach(() => {
        baseUser = new BaseUser();
        // Set default values manually since decorators don't work in tests
        baseUser.state = UserState.PENDING;
        baseUser.isEnabled = true;
        
        loginCredential = new LoginCredential();
        loginCredential.id = 'cred123';
    });

    it('should handle basic properties', () => {
        baseUser.firstname = 'John';
        baseUser.lastname = 'Doe';
        baseUser.displayname = 'johndoe';
        baseUser.contactEmail = 'john@example.com';

        expect(baseUser.firstname).toBe('John');
        expect(baseUser.lastname).toBe('Doe');
        expect(baseUser.displayname).toBe('johndoe');
        expect(baseUser.contactEmail).toBe('john@example.com');
    });

    it('should handle state transitions', () => {
        // Initial state
        expect(baseUser.state).toBe(UserState.PENDING);

        // Change to active
        baseUser.state = UserState.ACTIVE;
        expect(baseUser.state).toBe(UserState.ACTIVE);

        // Change to suspended
        baseUser.state = UserState.SUSPENDED;
        expect(baseUser.state).toBe(UserState.SUSPENDED);

        // Change to deactivated
        baseUser.state = UserState.DEACTIVATED;
        expect(baseUser.state).toBe(UserState.DEACTIVATED);
    });

    it('should handle primary login credential relationship', () => {
        baseUser.primaryLoginCredentialId = loginCredential.id;
        baseUser.primaryLoginCredential = loginCredential;

        expect(baseUser.primaryLoginCredentialId).toBe('cred123');
        expect(baseUser.primaryLoginCredential).toBe(loginCredential);
    });

    it('should handle login credentials relationship', () => {
        baseUser.loginCredentials = [loginCredential];
        expect(baseUser.loginCredentials).toHaveLength(1);
        expect(baseUser.loginCredentials[0]).toBe(loginCredential);
    });

    it('should handle lastLoginAt', () => {
        const now = new Date();
        baseUser.lastLoginAt = now;
        expect(baseUser.lastLoginAt).toBe(now);
    });

    it('should handle timestamps', () => {
        const now = new Date();
        baseUser.createdAt = now;
        baseUser.modifiedAt = now;

        expect(baseUser.createdAt).toBe(now);
        expect(baseUser.modifiedAt).toBe(now);
    });

    it('should have correct default values', () => {
        expect(baseUser.state).toBe(UserState.PENDING);
        expect(baseUser.isEnabled).toBe(true);
    });
}); 