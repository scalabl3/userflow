import { validate } from 'class-validator';
import { Organization } from './Organization';

describe('Organization', () => {
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization();
    });

    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(organization).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(organization.name).toBeUndefined();
            expect(organization.visible).toBe(false);
            expect(organization.stripeCustomerId).toBeUndefined();
            expect(organization.subscriptionStatus).toBeUndefined();
        });

        it('should handle id field', () => {
            const orgId = '123e4567-e89b-12d3-a456-426614174000';
            organization.id = orgId;
            expect(organization.id).toBe(orgId);
        });
    });

    describe('properties', () => {
        describe('core properties', () => {
            it('should get and set name', () => {
                organization.name = 'Test Org';
                expect(organization.name).toBe('Test Org');
            });

            it('should get and set visible flag', () => {
                organization.visible = true;
                expect(organization.visible).toBe(true);
            });
        });

        describe('stripe integration', () => {
            it('should get and set stripeCustomerId', () => {
                const customerId = 'cus_123456789';
                organization.stripeCustomerId = customerId;
                expect(organization.stripeCustomerId).toBe(customerId);
            });

            it('should allow null stripeCustomerId', async () => {
                organization.stripeCustomerId = undefined;
                const errors = await validate(organization);
                const stripeErrors = errors.find(e => e.property === 'stripeCustomerId');
                expect(stripeErrors).toBeUndefined();
            });

            it('should get and set subscriptionStatus', () => {
                const status = 'active';
                organization.subscriptionStatus = status;
                expect(organization.subscriptionStatus).toBe(status);
            });

            it('should allow null subscriptionStatus', async () => {
                organization.subscriptionStatus = undefined;
                const errors = await validate(organization);
                const statusErrors = errors.find(e => e.property === 'subscriptionStatus');
                expect(statusErrors).toBeUndefined();
            });
        });
    });

    describe('relationships', () => {
        describe('adminUser relationship', () => {
            describe('foreign key', () => {
                it('should get and set adminUserId', () => {
                    const id = '123e4567-e89b-12d3-a456-426614174000';
                    organization.adminUserId = id;
                    expect(organization.adminUserId).toBe(id);
                });

                it('should require adminUserId', async () => {
                    expect(organization.adminUserId).toBeUndefined();
                    const errors = await validate(organization);
                    const adminUserIdErrors = errors.find(e => e.property === 'adminUserId');
                    expect(adminUserIdErrors?.constraints).toHaveProperty('isUuid');
                });
            });
        });

        describe('users collection', () => {
            it('should initialize users as empty array', () => {
                expect(organization.users).toBeDefined();
                expect(Array.isArray(organization.users)).toBe(true);
                expect(organization.users).toHaveLength(0);
            });
        });
    });

    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const now = new Date();
            organization.createdAt = now;
            organization.modifiedAt = now;

            expect(organization.createdAt).toBe(now);
            expect(organization.modifiedAt).toBe(now);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(organization.deleted).toBe(false);
            expect(organization.deletedAt).toBeUndefined();
            
            // Mark as deleted
            const deletionTime = new Date();
            organization.deleted = true;
            organization.deletedAt = deletionTime;
            
            expect(organization.deleted).toBe(true);
            expect(organization.deletedAt).toBe(deletionTime);
        });
    });
}); 