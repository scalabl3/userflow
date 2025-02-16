import { validate } from 'class-validator';
import { LoginProvider } from './LoginProvider';

describe('LoginProvider', () => {
    let provider: LoginProvider;

    beforeEach(() => {
        provider = new LoginProvider();
    });

    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(provider).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(provider.isEnabled).toBe(true);
        });

        it('should handle id field', () => {
            const providerId = '123e4567-e89b-12d3-a456-426614174000';
            provider.id = providerId;
            expect(provider.id).toBe(providerId);
        });
    });

    describe('properties', () => {
        describe('core properties', () => {
            it('should get and set code', () => {
                const code = 'google';
                provider.code = code;
                expect(provider.code).toBe(code);
            });

            it('should require code', async () => {
                expect(provider.code).toBeUndefined();
                const errors = await validate(provider);
                const codeErrors = errors.find(e => e.property === 'code');
                expect(codeErrors?.constraints).toHaveProperty('isString');
                expect(codeErrors?.constraints).toHaveProperty('isStandardLength');
            });

            it('should get and set name', () => {
                const name = 'Google OAuth';
                provider.name = name;
                expect(provider.name).toBe(name);
            });

            it('should require name', async () => {
                expect(provider.name).toBeUndefined();
                const errors = await validate(provider);
                const nameErrors = errors.find(e => e.property === 'name');
                expect(nameErrors?.constraints).toHaveProperty('isString');
                expect(nameErrors?.constraints).toHaveProperty('isStandardLength');
            });
        });

        describe('state management', () => {
            it('should get and set enabled status', () => {
                provider.isEnabled = false;
                expect(provider.isEnabled).toBe(false);

                provider.isEnabled = true;
                expect(provider.isEnabled).toBe(true);
            });
        });
    });

    describe('relationships', () => {
        describe('credentials collection', () => {
            it('should initialize credentials as empty array', () => {
                expect(provider.credentials).toBeDefined();
                expect(Array.isArray(provider.credentials)).toBe(true);
                expect(provider.credentials).toHaveLength(0);
            });
        });
    });

    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const now = new Date();
            provider.createdAt = now;
            provider.modifiedAt = now;

            expect(provider.createdAt).toBe(now);
            expect(provider.modifiedAt).toBe(now);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(provider.deleted).toBe(false);
            expect(provider.deletedAt).toBeUndefined();
            
            // Mark as deleted
            const deletionTime = new Date();
            provider.deleted = true;
            provider.deletedAt = deletionTime;
            
            expect(provider.deleted).toBe(true);
            expect(provider.deletedAt).toBe(deletionTime);
        });
    });
}); 