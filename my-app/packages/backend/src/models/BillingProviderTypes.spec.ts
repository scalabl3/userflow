import { DataSource } from 'typeorm';
import { BillingProviderTypes, BillingProviderInfo } from './BillingProviderTypes';
import { BillingProvider } from './BillingProvider';

describe('BillingProviderTypes', () => {
    let instance: BillingProviderTypes;
    let mockDataSource: DataSource;
    
    const mockProviders: BillingProviderInfo[] = [
        { type: 'STRIPE', isEnabled: true, visible: true },
        { type: 'PAYPAL', isEnabled: true, visible: true },
        { type: 'APPLE_PAY', isEnabled: false, visible: false },
        { type: 'GOOGLE_PAY', isEnabled: true, visible: false }
    ];

    beforeEach(() => {
        // Clear singleton between tests
        BillingProviderTypes.clearInstance();
        
        // Setup mock DataSource
        mockDataSource = {
            getRepository: jest.fn().mockReturnValue({
                find: jest.fn().mockResolvedValue(mockProviders)
            })
        } as unknown as DataSource;

        instance = BillingProviderTypes.getInstance();
    });

    describe('initialization', () => {
        it('should create only one instance', () => {
            const instance1 = BillingProviderTypes.getInstance();
            const instance2 = BillingProviderTypes.getInstance();
            expect(instance1).toBe(instance2);
        });

        it('should initialize with empty cache', () => {
            expect(instance.getLastLoaded()).toBeNull();
            expect(instance.getAll()).toHaveLength(0);
        });

        it('should maintain state between gets', async () => {
            await instance.load(mockDataSource);
            const instance2 = BillingProviderTypes.getInstance();
            expect(instance2.getAll()).toHaveLength(mockProviders.length);
        });
    });

    describe('operations', () => {
        describe('loading', () => {
            it('should load providers from database', async () => {
                await instance.load(mockDataSource);
                expect(instance.getAll()).toHaveLength(mockProviders.length);
            });

            it('should update lastLoaded timestamp', async () => {
                expect(instance.getLastLoaded()).toBeNull();
                await instance.load(mockDataSource);
                expect(instance.getLastLoaded()).toBeInstanceOf(Date);
            });

            it('should clear existing data on reload', async () => {
                await instance.load(mockDataSource);
                
                // Mock different data for second load
                const mockRepo = mockDataSource.getRepository as jest.Mock;
                mockRepo.mockReturnValue({
                    find: jest.fn().mockResolvedValue([mockProviders[0]])
                });

                await instance.load(mockDataSource);
                expect(instance.getAll()).toHaveLength(1);
            });
        });

        describe('validation', () => {
            beforeEach(async () => {
                await instance.load(mockDataSource);
            });

            it('should validate existing types', () => {
                expect(instance.isValid('STRIPE')).toBe(true);
                expect(instance.isValid('INVALID')).toBe(false);
            });

            it('should check enabled status', () => {
                expect(instance.isEnabled('STRIPE')).toBe(true);
                expect(instance.isEnabled('APPLE_PAY')).toBe(false);
                expect(instance.isEnabled('INVALID')).toBe(false);
            });
        });

        describe('filtering', () => {
            beforeEach(async () => {
                await instance.load(mockDataSource);
            });

            it('should get all providers', () => {
                const all = instance.getAll();
                expect(all).toHaveLength(mockProviders.length);
                expect(all).toContainEqual(mockProviders[0]);
            });

            it('should get only visible providers', () => {
                const visible = instance.getVisible();
                expect(visible).toHaveLength(2);
                expect(visible.every(p => p.visible)).toBe(true);
            });

            it('should get only enabled providers', () => {
                const enabled = instance.getEnabled();
                expect(enabled).toHaveLength(3);
                expect(enabled.every(p => p.isEnabled)).toBe(true);
            });
        });
    });

    describe('state management', () => {
        describe('cache control', () => {
            it('should need reload when never loaded', () => {
                expect(instance.needsReload()).toBe(true);
            });

            it('should need reload after max age', async () => {
                await instance.load(mockDataSource);
                expect(instance.needsReload(0)).toBe(true);  // Immediate expiry
                expect(instance.needsReload(1000000)).toBe(false);  // Long expiry
            });

            it('should need reload after invalidation', async () => {
                await instance.load(mockDataSource);
                expect(instance.needsReload()).toBe(false);
                
                instance.invalidateCache();
                expect(instance.needsReload()).toBe(true);
            });
        });
    });
}); 