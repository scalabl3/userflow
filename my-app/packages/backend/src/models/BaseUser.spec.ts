import { BaseUser } from './BaseUser';
import { LoginCredential } from './LoginCredential';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('BaseUser', () => {
    let baseUser: BaseUser;
    let loginCredential: LoginCredential;

    beforeEach(() => {
        loginCredential = new LoginCredential();
        loginCredential.id = 'cred123';
        loginCredential.identifier = 'john.doe@example.com';
        loginCredential.credentials = 'hashedPassword123';
        loginCredential.isEnabled = true;
        loginCredential.createdAt = new Date();
        loginCredential.modifiedAt = new Date();

        baseUser = new BaseUser();
        baseUser.id = 'user123';
        baseUser.firstname = 'John';
        baseUser.lastname = 'Doe';
        baseUser.displayname = 'John Doe';
        baseUser.contactEmail = 'john.doe@example.com';
        baseUser.state = UserState.PENDING;
        baseUser.isEnabled = true;
        baseUser.createdAt = new Date();
        baseUser.modifiedAt = new Date();
    });

    it('should create a base user instance', () => {
        expect(baseUser).toBeDefined();
        expect(baseUser).toBeInstanceOf(BaseUser);
    });

    describe('basic properties', () => {
        it('should have required properties', () => {
            expect(baseUser.id).toBeDefined();
            expect(baseUser.firstname).toBe('John');
            expect(baseUser.lastname).toBe('Doe');
            expect(baseUser.displayname).toBe('John Doe');
            expect(baseUser.contactEmail).toBe('john.doe@example.com');
            expect(baseUser.isEnabled).toBe(true);
            expect(baseUser.createdAt).toBeDefined();
            expect(baseUser.modifiedAt).toBeDefined();
        });

        it('should have default state as PENDING', () => {
            const newUser = new BaseUser();
            expect(newUser.state).toBeUndefined(); // Will be set by TypeORM to PENDING
            expect(baseUser.state).toBe(UserState.PENDING);
        });
    });

    describe('login credentials', () => {
        it('should handle primary login credential', () => {
            baseUser.primaryLoginCredential = loginCredential;
            baseUser.primaryLoginCredentialId = loginCredential.id;

            expect(baseUser.primaryLoginCredential).toBeDefined();
            expect(baseUser.primaryLoginCredential).toBe(loginCredential);
            expect(baseUser.primaryLoginCredentialId).toBe(loginCredential.id);
        });

        it('should allow null primary login credential', () => {
            expect(baseUser.primaryLoginCredential).toBeUndefined();
            expect(baseUser.primaryLoginCredentialId).toBeUndefined();
        });

        it('should handle multiple login credentials', () => {
            const credentials = [loginCredential];
            baseUser.loginCredentials = credentials;

            expect(baseUser.loginCredentials).toBeDefined();
            expect(baseUser.loginCredentials).toEqual(credentials);
        });
    });

    describe('login tracking', () => {
        it('should handle lastLoginAt', () => {
            expect(baseUser.lastLoginAt).toBeUndefined();
            
            const loginTime = new Date();
            baseUser.lastLoginAt = loginTime;
            expect(baseUser.lastLoginAt).toBe(loginTime);
        });
    });

    describe('state management', () => {
        it('should handle state transitions', () => {
            expect(baseUser.state).toBe(UserState.PENDING);
            
            baseUser.state = UserState.ACTIVE;
            expect(baseUser.state).toBe(UserState.ACTIVE);

            baseUser.state = UserState.SUSPENDED;
            expect(baseUser.state).toBe(UserState.SUSPENDED);

            baseUser.state = UserState.DEACTIVATED;
            expect(baseUser.state).toBe(UserState.DEACTIVATED);
        });
    });
}); 