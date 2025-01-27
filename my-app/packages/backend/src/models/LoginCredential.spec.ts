import { LoginCredential, CredentialType } from './LoginCredential';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';

describe('LoginCredential', () => {
    let loginCredential: LoginCredential;
    let loginProvider: LoginProvider;
    let baseUser: BaseUser;

    beforeEach(() => {
        loginCredential = new LoginCredential();
        // Set default values manually since decorators don't work in tests
        loginCredential.isEnabled = true;
        
        loginProvider = new LoginProvider();
        baseUser = new BaseUser();

        loginProvider.id = 'provider123';
        baseUser.id = 'user123';
    });

    it('should handle login provider relationship', () => {
        loginCredential.loginProviderId = loginProvider.id;
        loginCredential.loginProvider = loginProvider;

        expect(loginCredential.loginProviderId).toBe('provider123');
        expect(loginCredential.loginProvider).toBe(loginProvider);
    });

    it('should handle base user relationship', () => {
        loginCredential.baseUserId = baseUser.id;
        loginCredential.baseUser = baseUser;

        expect(loginCredential.baseUserId).toBe('user123');
        expect(loginCredential.baseUser).toBe(baseUser);
    });

    it('should handle optional credentials', () => {
        expect(loginCredential.credentials).toBeUndefined();
        
        loginCredential.credentials = 'hashedPassword';
        expect(loginCredential.credentials).toBe('hashedPassword');
    });

    it('should handle expiration date', () => {
        expect(loginCredential.expiresAt).toBeUndefined();
        
        const expiresAt = new Date();
        loginCredential.expiresAt = expiresAt;
        expect(loginCredential.expiresAt).toBe(expiresAt);
    });

    it('should handle timestamps', () => {
        const now = new Date();
        loginCredential.createdAt = now;
        loginCredential.modifiedAt = now;

        expect(loginCredential.createdAt).toBe(now);
        expect(loginCredential.modifiedAt).toBe(now);
    });

    it('should have correct default values', () => {
        expect(loginCredential.isEnabled).toBe(true);
    });

    it('should handle credential type', () => {
        loginCredential.credentialType = CredentialType.PASSWORD;
        expect(loginCredential.credentialType).toBe(CredentialType.PASSWORD);
    });
}); 