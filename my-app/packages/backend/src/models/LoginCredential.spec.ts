import { LoginCredential } from './LoginCredential';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';
import { UserState, CredentialType, OAuthProvider } from '@my-app/shared';

describe('LoginCredential', () => {
    let loginCredential: LoginCredential;
    let baseUser: BaseUser;
    let loginProvider: LoginProvider;

    beforeEach(() => {
        // Setup LoginProvider mock
        loginProvider = {
            id: 'provider123',
            code: 'email',
            name: 'Email Provider',
            isEnabled: true,
            createdAt: new Date(),
            modifiedAt: new Date()
        } as LoginProvider;

        // Setup BaseUser mock
        baseUser = {
            id: 'user123',
            firstname: 'John',
            lastname: 'Doe',
            displayname: 'John Doe',
            contactEmail: 'john@example.com',
            state: UserState.ACTIVE,
            isEnabled: true,
            createdAt: new Date(),
            modifiedAt: new Date(),
            loginCredentials: []
        } as BaseUser;

        // Setup base LoginCredential
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

    describe('basic properties', () => {
        it('should create a valid login credential with required fields', () => {
            expect(loginCredential).toBeDefined();
            expect(loginCredential.id).toBe('cred123');
            expect(loginCredential.identifier).toBe('john@example.com');
            expect(loginCredential.loginProviderId).toBe(loginProvider.id);
            expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);
            expect(loginCredential.isEnabled).toBe(true);
            expect(loginCredential.createdAt).toBeInstanceOf(Date);
            expect(loginCredential.modifiedAt).toBeInstanceOf(Date);
        });

        it('should handle id field', () => {
            const credentialId = '123e4567-e89b-12d3-a456-426614174000';
            loginCredential.id = credentialId;
            expect(loginCredential.id).toBe(credentialId);
        });

        it('should handle identifier and loginProviderId as a unique pair', () => {
            const credential = new LoginCredential();
            const identifier = 'test@example.com';
            const providerId = '123';
            
            credential.identifier = identifier;
            credential.loginProviderId = providerId;
            
            expect(credential.identifier).toBe(identifier);
            expect(credential.loginProviderId).toBe(providerId);
        });

        it('should handle SQLite compatible datetime fields', () => {
            const now = new Date();
            loginCredential.createdAt = now;
            loginCredential.modifiedAt = now;
            loginCredential.accessTokenExpiresAt = now;
            loginCredential.refreshTokenExpiresAt = now;

            expect(loginCredential.createdAt).toBeInstanceOf(Date);
            expect(loginCredential.modifiedAt).toBeInstanceOf(Date);
            expect(loginCredential.accessTokenExpiresAt).toBeInstanceOf(Date);
            expect(loginCredential.refreshTokenExpiresAt).toBeInstanceOf(Date);
        });
    });

    describe('credential types', () => {
        describe('PASSWORD type', () => {
            beforeEach(() => {
                loginCredential.credentialType = CredentialType.PASSWORD;
                loginCredential.passwordHash = 'hashedpassword123';
            });

            it('should store password hash', () => {
                expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);
                expect(loginCredential.passwordHash).toBe('hashedpassword123');
                expect(loginCredential.provider).toBeUndefined();
                expect(loginCredential.accessToken).toBeUndefined();
            });
        });

        describe('OAUTH type', () => {
            beforeEach(() => {
                loginCredential.credentialType = CredentialType.OAUTH;
                loginCredential.provider = OAuthProvider.GOOGLE;
                loginCredential.accessToken = 'google_access_token';
                loginCredential.accessTokenExpiresAt = new Date();
                loginCredential.refreshToken = 'google_refresh_token';
                loginCredential.refreshTokenExpiresAt = new Date();
                loginCredential.scope = 'email profile';
                loginCredential.rawProfile = { email: 'john@gmail.com', name: 'John Doe' };
            });

            it('should store OAuth fields', () => {
                expect(loginCredential.credentialType).toBe(CredentialType.OAUTH);
                expect(loginCredential.provider).toBe(OAuthProvider.GOOGLE);
                expect(loginCredential.accessToken).toBeDefined();
                expect(loginCredential.accessTokenExpiresAt).toBeInstanceOf(Date);
                expect(loginCredential.refreshToken).toBeDefined();
                expect(loginCredential.refreshTokenExpiresAt).toBeInstanceOf(Date);
                expect(loginCredential.scope).toBe('email profile');
                expect(loginCredential.rawProfile).toEqual({ email: 'john@gmail.com', name: 'John Doe' });
            });

            it('should handle Apple-specific OAuth fields', () => {
                loginCredential.provider = OAuthProvider.APPLE;
                loginCredential.identityToken = 'apple_identity_token';
                loginCredential.authorizationCode = 'apple_auth_code';
                loginCredential.realUserStatus = 'REAL';
                loginCredential.nonce = 'random_nonce';

                expect(loginCredential.provider).toBe(OAuthProvider.APPLE);
                expect(loginCredential.identityToken).toBe('apple_identity_token');
                expect(loginCredential.authorizationCode).toBe('apple_auth_code');
                expect(loginCredential.realUserStatus).toBe('REAL');
                expect(loginCredential.nonce).toBe('random_nonce');
            });
        });
    });

    describe('relationships', () => {
        it('should maintain bidirectional relationship with BaseUser', () => {
            loginCredential.baseUser = baseUser;
            loginCredential.baseUserId = baseUser.id;
            baseUser.loginCredentials = [loginCredential];

            expect(loginCredential.baseUser).toBe(baseUser);
            expect(loginCredential.baseUserId).toBe(baseUser.id);
            expect(baseUser.loginCredentials).toContain(loginCredential);
        });

        it('should maintain relationship with LoginProvider', () => {
            expect(loginCredential.loginProvider).toBe(loginProvider);
            expect(loginCredential.loginProviderId).toBe(loginProvider.id);
        });

        it('should handle null BaseUser relationship', () => {
            loginCredential.baseUser = undefined;
            loginCredential.baseUserId = undefined;

            expect(loginCredential.baseUser).toBeUndefined();
            expect(loginCredential.baseUserId).toBeUndefined();
        });

        it('should handle login provider relationship', () => {
            const credential = new LoginCredential();
            const provider = new LoginProvider();
            provider.id = '123';
            
            credential.loginProviderId = provider.id;
            credential.loginProvider = provider;
            
            expect(credential.loginProviderId).toBe('123');
            expect(credential.loginProvider).toBe(provider);
        });

        it('should handle base user relationship', () => {
            const credential = new LoginCredential();
            const user = new BaseUser();
            user.id = '456';
            
            credential.baseUserId = user.id;
            credential.baseUser = user;
            
            expect(credential.baseUserId).toBe('456');
            expect(credential.baseUser).toBe(user);
        });
    });
}); 