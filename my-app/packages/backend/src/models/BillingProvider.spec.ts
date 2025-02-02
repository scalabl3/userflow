import { validate } from 'class-validator';
import { BillingProvider } from './BillingProvider';

describe('BillingProvider', () => {
    let provider: BillingProvider;

    beforeEach(() => {
        provider = new BillingProvider();
    });

    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(provider).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(provider.isEnabled).toBe(true);
            expect(provider.visible).toBe(true);
        });

        it('should handle id field', () => {
            const providerId = '123e4567-e89b-12d3-a456-426614174000';
            provider.id = providerId;
            expect(provider.id).toBe(providerId);
        });
    });

    describe('properties', () => {
        describe('core properties', () => {
            it('should get and set type', () => {
                const type = 'STRIPE';
                provider.type = type;
                expect(provider.type).toBe(type);
            });

            it('should require type', async () => {
                expect(provider.type).toBeUndefined();
                const errors = await validate(provider);
                const typeErrors = errors.find(e => e.property === 'type');
                expect(typeErrors?.constraints).toHaveProperty('isString');
                expect(typeErrors?.constraints).toHaveProperty('matches');
            });

            it('should validate type format', async () => {
                provider.type = 'invalid_type';
                const errors = await validate(provider);
                const typeErrors = errors.find(e => e.property === 'type');
                expect(typeErrors?.constraints).toHaveProperty('matches');
            });

            it('should handle valid provider types', () => {
                const validTypes = ['STRIPE', 'PAYPAL', 'APPLE_PAY', 'GOOGLE_PAY'];
                validTypes.forEach(type => {
                    provider.type = type;
                    expect(provider.type).toBe(type);
                });
            });

            it('should store type as uppercase', () => {
                provider.type = 'STRIPE_TEST_PROVIDER';
                expect(provider.type).toBe('STRIPE_TEST_PROVIDER');
            });
        });

        describe('state management', () => {
            it('should get and set enabled state', () => {
                provider.isEnabled = false;
                expect(provider.isEnabled).toBe(false);

                provider.isEnabled = true;
                expect(provider.isEnabled).toBe(true);
            });

            it('should validate enabled state', async () => {
                (provider.isEnabled as any) = 'not-a-boolean';
                const errors = await validate(provider);
                const enabledErrors = errors.find(e => e.property === 'isEnabled');
                expect(enabledErrors?.constraints).toHaveProperty('isBoolean');
            });

            it('should get and set visibility state', () => {
                provider.visible = false;
                expect(provider.visible).toBe(false);

                provider.visible = true;
                expect(provider.visible).toBe(true);
            });

            it('should validate visibility state', async () => {
                (provider.visible as any) = 'not-a-boolean';
                const errors = await validate(provider);
                const visibleErrors = errors.find(e => e.property === 'visible');
                expect(visibleErrors?.constraints).toHaveProperty('isBoolean');
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
    });
});
