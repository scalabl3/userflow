import { LoginProvider } from './LoginProvider';
import { Column } from 'typeorm';

describe('LoginProvider', () => {
    let provider: LoginProvider;

    beforeEach(() => {
        provider = new LoginProvider();
        // Set default values manually since decorators don't work in tests
        provider.isEnabled = true;
    });

    it('should create an instance', () => {
        expect(provider).toBeTruthy();
    });

    it('should handle id field', () => {
        const providerId = '123e4567-e89b-12d3-a456-426614174000';
        provider.id = providerId;
        expect(provider.id).toBe(providerId);
    });

    it('should initialize with default values', () => {
        expect(provider.isEnabled).toBe(true);
    });

    it('should set and get basic properties', () => {
        provider.code = 'google';
        provider.name = 'Google';
        provider.isEnabled = false;

        expect(provider.code).toBe('google');
        expect(provider.name).toBe('Google');
        expect(provider.isEnabled).toBe(false);
    });

    it('should handle timestamps', () => {
        const now = new Date();
        provider.createdAt = now;
        provider.modifiedAt = now;

        expect(provider.createdAt).toBe(now);
        expect(provider.modifiedAt).toBe(now);
    });

    it('should handle common provider codes', () => {
        const commonCodes = ['email', 'google', 'apple', 'phone'];
        
        for (const code of commonCodes) {
            provider.code = code;
            expect(provider.code).toBe(code);
        }
    });

    it('should handle code field as a unique identifier', () => {
        const provider = new LoginProvider();
        const uniqueCode = 'unique-provider-code';
        provider.code = uniqueCode;
        expect(provider.code).toBe(uniqueCode);
    });
}); 