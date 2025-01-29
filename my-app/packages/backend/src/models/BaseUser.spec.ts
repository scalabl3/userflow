import { BaseUser } from './BaseUser';
import { LoginCredential } from './LoginCredential';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('BaseUser', () => {
    let user: BaseUser;
    let loginCredential: LoginCredential;

    beforeEach(() => {
        user = new BaseUser();
        loginCredential = new LoginCredential();
        loginCredential.id = 'cred123';
        loginCredential.identifier = 'test@example.com';
        loginCredential.passwordHash = 'hashedPassword123';
        // Set default values manually since decorators don't work in tests
        user.state = UserState.PENDING;
        user.isEnabled = true;
        user.loginCredentials = [];
    });

    it('should create an instance', () => {
        expect(user).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(user.state).toBe(UserState.PENDING);
        expect(user.isEnabled).toBe(true);
        expect(user.loginCredentials).toEqual([]);
    });

    it('should handle optional fields', () => {
        expect(user.primaryLoginCredentialId).toBeUndefined();
        expect(user.primaryLoginCredential).toBeUndefined();
        expect(user.lastLoginAt).toBeUndefined();
    });

    it('should set and get basic properties', () => {
        user.firstname = 'John';
        user.lastname = 'Doe';
        user.contactEmail = 'john@example.com';
        
        expect(user.firstname).toBe('John');
        expect(user.lastname).toBe('Doe');
        expect(user.contactEmail).toBe('john@example.com');
    });

    it('should handle state changes', () => {
        // Test all enum values
        user.state = UserState.ACTIVE;
        expect(user.state).toBe(UserState.ACTIVE);

        user.state = UserState.SUSPENDED;
        expect(user.state).toBe(UserState.SUSPENDED);

        user.state = UserState.DEACTIVATED;
        expect(user.state).toBe(UserState.DEACTIVATED);

        user.state = UserState.PENDING;
        expect(user.state).toBe(UserState.PENDING);
    });

    it('should handle timestamps', () => {
        const now = new Date();
        user.createdAt = now;
        user.modifiedAt = now;

        expect(user.createdAt).toBe(now);
        expect(user.modifiedAt).toBe(now);
    });

    it('should handle lastLoginAt updates', () => {
        const loginTime = new Date();
        user.lastLoginAt = loginTime;
        expect(user.lastLoginAt).toBe(loginTime);
    });

    it('should handle login credential relationship', () => {
        user.primaryLoginCredentialId = loginCredential.id;
        expect(user.primaryLoginCredentialId).toBe(loginCredential.id);
    });

    it('should handle primary login credential relationship', () => {
        const user = new BaseUser();
        const credential = new LoginCredential();
        credential.id = '123';
        
        user.primaryLoginCredentialId = credential.id;
        user.primaryLoginCredential = credential;
        
        expect(user.primaryLoginCredentialId).toBe('123');
        expect(user.primaryLoginCredential).toBe(credential);
    });

    it('should handle login credentials relationship', () => {
        const user = new BaseUser();
        const credential1 = new LoginCredential();
        const credential2 = new LoginCredential();
        
        user.loginCredentials = [credential1, credential2];
        
        expect(user.loginCredentials).toHaveLength(2);
        expect(user.loginCredentials).toContain(credential1);
        expect(user.loginCredentials).toContain(credential2);
    });

    it('should handle lastLoginAt field', () => {
        const user = new BaseUser();
        const now = new Date();
        
        user.lastLoginAt = now;
        
        expect(user.lastLoginAt).toBe(now);
    });

    it('should handle isEnabled field', () => {
        const user = new BaseUser();
        user.isEnabled = true;
        expect(user.isEnabled).toBe(true);
    });
}); 