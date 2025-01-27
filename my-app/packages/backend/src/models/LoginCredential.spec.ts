import { LoginCredential } from './LoginCredential';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';
import { UserState } from '@my-app/shared/dist/enums/UserState';
import { CredentialType, OAuthProvider } from '@my-app/shared/dist/enums';

describe('LoginCredential', () => {
    let loginCredential: LoginCredential;
    let baseUser: BaseUser;
    let loginProvider: LoginProvider;

    beforeEach(() => {
        loginProvider = {
            id: 'provider123',
            code: 'email',
            name: 'Email Provider',
            isEnabled: true,
            createdAt: new Date(),
            modifiedAt: new Date()
        } as LoginProvider;

        baseUser = new BaseUser();
        baseUser.id = 'user123';
        baseUser.firstname = 'John';
        baseUser.lastname = 'Doe';
        baseUser.displayname = 'John Doe';
        baseUser.contactEmail = 'john@example.com';
        baseUser.state = UserState.ACTIVE;
        baseUser.isEnabled = true;
        baseUser.createdAt = new Date();
        baseUser.modifiedAt = new Date();

        loginCredential = new LoginCredential();
        loginCredential.id = 'cred123';
        loginCredential.identifier = 'john@example.com';
        loginCredential.loginProviderId = loginProvider.id;
        loginCredential.loginProvider = loginProvider;
        loginCredential.credentialType = CredentialType.PASSWORD;
        loginCredential.passwordHash = 'hashedpassword';
        loginCredential.baseUserId = baseUser.id;
        loginCredential.baseUser = baseUser;
        loginCredential.isEnabled = true;
        loginCredential.createdAt = new Date();
        loginCredential.modifiedAt = new Date();
    });

    it('should create a valid login credential', () => {
        expect(loginCredential).toBeDefined();
        expect(loginCredential.identifier).toBe('john@example.com');
        expect(loginCredential.loginProviderId).toBe(loginProvider.id);
        expect(loginCredential.loginProvider).toBe(loginProvider);
        expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);
        expect(loginCredential.passwordHash).toBeDefined();
        expect(loginCredential.baseUserId).toBe(baseUser.id);
        expect(loginCredential.baseUser).toBe(baseUser);
        expect(loginCredential.isEnabled).toBe(true);
    });

    describe('credential type validation', () => {
        it('should accept password credentials', () => {
            loginCredential.credentialType = CredentialType.PASSWORD;
            loginCredential.passwordHash = 'hashedpassword';
            expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);
            expect(loginCredential.passwordHash).toBeDefined();
        });

        it('should accept OAuth credentials', () => {
            loginCredential.credentialType = CredentialType.OAUTH;
            loginCredential.provider = OAuthProvider.GOOGLE;
            loginCredential.accessToken = 'google_token';
            expect(loginCredential.credentialType).toBe(CredentialType.OAUTH);
            expect(loginCredential.provider).toBe(OAuthProvider.GOOGLE);
            expect(loginCredential.accessToken).toBeDefined();
        });

        it('should handle Apple-specific OAuth fields', () => {
            loginCredential.credentialType = CredentialType.OAUTH;
            loginCredential.provider = OAuthProvider.APPLE;
            loginCredential.accessToken = 'apple_token';
            loginCredential.identityToken = 'apple_identity_token';
            loginCredential.authorizationCode = 'apple_auth_code';
            loginCredential.realUserStatus = 'REAL';
            loginCredential.nonce = 'random_nonce';

            expect(loginCredential.credentialType).toBe(CredentialType.OAUTH);
            expect(loginCredential.provider).toBe(OAuthProvider.APPLE);
            expect(loginCredential.accessToken).toBeDefined();
            expect(loginCredential.identityToken).toBeDefined();
            expect(loginCredential.authorizationCode).toBeDefined();
            expect(loginCredential.realUserStatus).toBeDefined();
            expect(loginCredential.nonce).toBeDefined();
        });
    });

    describe('user relationship', () => {
        it('should link to a base user', () => {
            expect(loginCredential.baseUser).toBeDefined();
            expect(loginCredential.baseUser).toBe(baseUser);
            expect(loginCredential.baseUserId).toBe(baseUser.id);
        });

        it('should allow null base user', () => {
            loginCredential.baseUser = undefined;
            loginCredential.baseUserId = undefined;
            expect(loginCredential.baseUser).toBeUndefined();
            expect(loginCredential.baseUserId).toBeUndefined();
        });
    });

    describe('provider relationship', () => {
        it('should link to a login provider', () => {
            expect(loginCredential.loginProvider).toBeDefined();
            expect(loginCredential.loginProvider).toBe(loginProvider);
            expect(loginCredential.loginProviderId).toBe(loginProvider.id);
        });
    });
}); 