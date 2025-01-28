import { validate } from 'class-validator';
import { BillingProvider } from './BillingProvider';
import { BillingProviderType } from '@my-app/shared/dist/enums/BillingProviderType';

describe('BillingProvider Model', () => {
    let provider: BillingProvider;

    beforeEach(() => {
        provider = new BillingProvider();
        provider.id = 'test-id';
        provider.name = 'Test Provider';
        provider.type = BillingProviderType.STRIPE;
        provider.visible = true;
        provider.isEnabled = true;
        provider.createdAt = new Date();
        provider.modifiedAt = new Date();
    });

    describe('validation', () => {
        it('should validate with all required fields', async () => {
            const errors = await validate(provider);
            expect(errors.length).toBe(0);
        });

        it('should fail validation without name', async () => {
            provider.name = '';
            
            const errors = await validate(provider);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isNotEmpty');
        });

        it('should fail validation with invalid provider type', async () => {
            (provider.type as any) = 'INVALID_TYPE';
            
            const errors = await validate(provider);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isEnum');
        });

        it('should fail validation with non-boolean enabled flag', async () => {
            (provider.isEnabled as any) = 'not-a-boolean';
            
            const errors = await validate(provider);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isBoolean');
        });

        it('should fail validation with non-boolean visible flag', async () => {
            (provider.visible as any) = 'not-a-boolean';
            
            const errors = await validate(provider);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].constraints).toHaveProperty('isBoolean');
        });
    });

    describe('default values', () => {
        it('should set default enabled status to true', () => {
            const newProvider = new BillingProvider();
            expect(newProvider.isEnabled).toBe(true);
        });

        it('should set default visible status to true', () => {
            const newProvider = new BillingProvider();
            expect(newProvider.visible).toBe(true);
        });
    });

    it('should create a valid provider', () => {
        expect(provider.id).toBeDefined();
        expect(provider.name).toBe('Test Provider');
        expect(provider.type).toBe(BillingProviderType.STRIPE);
        expect(provider.visible).toBe(true);
        expect(provider.isEnabled).toBe(true);
        expect(provider.createdAt).toBeDefined();
        expect(provider.modifiedAt).toBeDefined();
    });

    it('should handle required fields', () => {
        provider.name = '';
        expect(provider.name).toBe('');
    });
});
