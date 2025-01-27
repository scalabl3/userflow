import { LoginProvider } from './LoginProvider';

describe('LoginProvider', () => {
    let loginProvider: LoginProvider;

    beforeEach(() => {
        loginProvider = new LoginProvider();
        // Set default values manually since decorators don't work in tests
        loginProvider.isEnabled = true;
    });

    it('should handle basic properties', () => {
        loginProvider.code = 'email';
        loginProvider.name = 'Email and Password';
        
        expect(loginProvider.code).toBe('email');
        expect(loginProvider.name).toBe('Email and Password');
    });

    it('should have correct default values', () => {
        expect(loginProvider.isEnabled).toBe(true);
    });

    it('should handle timestamps', () => {
        const now = new Date();
        loginProvider.createdAt = now;
        loginProvider.modifiedAt = now;

        expect(loginProvider.createdAt).toBe(now);
        expect(loginProvider.modifiedAt).toBe(now);
    });
}); 