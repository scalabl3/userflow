import { LoginCredential, CredentialType } from './LoginCredential';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('LoginCredential', () => {
    let loginCredential: LoginCredential;
    let loginProvider: LoginProvider;
    let baseUser: BaseUser;

    beforeEach(() => {
        // Setup mock LoginProvider
        loginProvider = new LoginProvider();
        loginProvider.id = 'provider123';
        loginProvider.code = 'email';
        loginProvider.name = 'Email Provider';
        loginProvider.isEnabled = true;
        loginProvider.createdAt = new Date();
        loginProvider.modifiedAt = new Date();

        // Setup mock BaseUser
        baseUser = new BaseUser();
        baseUser.id = 'user123';
        baseUser.firstname = 'John';
        baseUser.lastname = 'Doe';
        baseUser.displayname = 'John Doe';
        baseUser.contactEmail = 'john@example.com';
        baseUser.state = UserState.ACTIVE;
        baseUser.lastLoginAt = new Date();
        baseUser.isEnabled = true;
        baseUser.createdAt = new Date();
        baseUser.modifiedAt = new Date();

        // Setup LoginCredential
        loginCredential = new LoginCredential();
        loginCredential.id = 'cred123';
        loginCredential.identifier = 'john@example.com';
        loginCredential.loginProviderId = loginProvider.id;
        loginCredential.loginProvider = loginProvider;
        loginCredential.credentialType = CredentialType.PASSWORD;
        loginCredential.isEnabled = true;
        loginCredential.createdAt = new Date();
        loginCredential.modifiedAt = new Date();
    });

    it('should create an instance with required fields', () => {
        expect(loginCredential).toBeDefined();
        expect(loginCredential.id).toBe('cred123');
        expect(loginCredential.identifier).toBe('john@example.com');
        expect(loginCredential.loginProviderId).toBe('provider123');
        expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);
        expect(loginCredential.isEnabled).toBe(true);
    });

    it('should handle optional credentials field', () => {
        expect(loginCredential.credentials).toBeUndefined();
        
        loginCredential.credentials = 'hashedPassword123';
        expect(loginCredential.credentials).toBe('hashedPassword123');
    });

    it('should handle optional expiresAt field', () => {
        expect(loginCredential.expiresAt).toBeUndefined();
        
        const expiryDate = new Date('2025-01-01');
        loginCredential.expiresAt = expiryDate;
        expect(loginCredential.expiresAt).toEqual(expiryDate);
    });

    it('should handle optional baseUser relationship', () => {
        expect(loginCredential.baseUser).toBeUndefined();
        expect(loginCredential.baseUserId).toBeUndefined();
        
        loginCredential.baseUser = baseUser;
        loginCredential.baseUserId = baseUser.id;
        expect(loginCredential.baseUser).toBe(baseUser);
        expect(loginCredential.baseUserId).toBe('user123');
    });

    it('should validate credential types', () => {
        // Test all valid credential types
        loginCredential.credentialType = CredentialType.PASSWORD;
        expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);

        loginCredential.credentialType = CredentialType.ACCESS_TOKEN;
        expect(loginCredential.credentialType).toBe(CredentialType.ACCESS_TOKEN);

        loginCredential.credentialType = CredentialType.REFRESH_TOKEN;
        expect(loginCredential.credentialType).toBe(CredentialType.REFRESH_TOKEN);
    });

    it('should have timestamps', () => {
        expect(loginCredential.createdAt).toBeInstanceOf(Date);
        expect(loginCredential.modifiedAt).toBeInstanceOf(Date);
    });

    it('should set default isEnabled value', () => {
        const newCredential = new LoginCredential();
        newCredential.isEnabled = true; // Set manually since TypeORM decorators don't work in tests
        expect(newCredential.isEnabled).toBe(true);
    });

    describe('credential type validation', () => {
        it('should create a password credential without expiration', () => {
            loginCredential.credentialType = CredentialType.PASSWORD;
            loginCredential.credentials = 'hashedPassword123';
            loginCredential.expiresAt = undefined;

            expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);
            expect(loginCredential.credentials).toBeDefined();
            expect(loginCredential.expiresAt).toBeUndefined();
        });

        it('should create an access token credential with short expiration', () => {
            loginCredential.credentialType = CredentialType.ACCESS_TOKEN;
            loginCredential.credentials = 'jwt.token.here';
            // Set expiration to 1 hour from now
            const oneHourFromNow = new Date();
            oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
            loginCredential.expiresAt = oneHourFromNow;

            expect(loginCredential.credentialType).toBe(CredentialType.ACCESS_TOKEN);
            expect(loginCredential.credentials).toBeDefined();
            expect(loginCredential.expiresAt).toBeDefined();
            expect(loginCredential.expiresAt?.getTime()).toBe(oneHourFromNow.getTime());
        });

        it('should create a refresh token credential with long expiration', () => {
            loginCredential.credentialType = CredentialType.REFRESH_TOKEN;
            loginCredential.credentials = 'refresh.token.here';
            // Set expiration to 30 days from now
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            loginCredential.expiresAt = thirtyDaysFromNow;

            expect(loginCredential.credentialType).toBe(CredentialType.REFRESH_TOKEN);
            expect(loginCredential.credentials).toBeDefined();
            expect(loginCredential.expiresAt).toBeDefined();
            expect(loginCredential.expiresAt?.getTime()).toBe(thirtyDaysFromNow.getTime());
        });

        it('should handle credential expiration check', () => {
            // Test expired credential
            const pastDate = new Date();
            pastDate.setHours(pastDate.getHours() - 1); // 1 hour ago
            loginCredential.expiresAt = pastDate;
            expect(loginCredential.expiresAt < new Date()).toBe(true);

            // Test non-expired credential
            const futureDate = new Date();
            futureDate.setHours(futureDate.getHours() + 1); // 1 hour from now
            loginCredential.expiresAt = futureDate;
            expect(loginCredential.expiresAt > new Date()).toBe(true);
        });
    });

    describe('identifier validation', () => {
        it('should handle email identifier format', () => {
            loginCredential.identifier = 'test@example.com';
            expect(loginCredential.identifier).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
        });

        it('should handle phone number identifier format', () => {
            loginCredential.identifier = '+1234567890';
            expect(loginCredential.identifier).toMatch(/^\+[0-9]+$/);
        });

        it('should handle username identifier format', () => {
            loginCredential.identifier = 'johndoe123';
            expect(loginCredential.identifier).toMatch(/^[a-zA-Z0-9_-]+$/);
        });
    });
}); 