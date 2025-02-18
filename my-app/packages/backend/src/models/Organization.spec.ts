/**
 * Test suite for Organization entity model.
 * Validates organization management functionality and data integrity.
 * 
 * Test Categories:
 * - Initialization: Default values and instance creation
 * - Core Properties: Organization identification and visibility
 * - Stripe Integration: Customer and subscription management
 * - Relationships: Admin user and member management
 * - Timestamps: Temporal tracking
 * 
 * Coverage Areas:
 * - Organization Configuration:
 *   - Name management
 *   - Visibility control
 *   - Stripe customer integration
 *   - Subscription status tracking
 * 
 * - Data Validation:
 *   - Required fields (name, adminUserId)
 *   - Optional fields (stripeCustomerId, subscriptionStatus)
 *   - Field formats and constraints
 * 
 * - Relationship Management:
 *   - Admin user assignment
 *   - User collection handling
 * 
 * Test Structure:
 * 1. Initialization
 *    - Instance creation
 *    - Default values
 *    - ID handling
 * 
 * 2. Properties
 *    - Core fields (name, visible)
 *    - Stripe integration (customerId, subscriptionStatus)
 * 
 * 3. Relationships
 *    - Admin user assignment
 *    - User collection management
 * 
 * 4. Timestamps
 *    - Creation tracking
 *    - Modification tracking
 *    - Soft deletion
 */

import { validate } from 'class-validator';
import { Organization } from './Organization';
import { SubscriptionStatus } from '@my-app/shared';
import { organization as orgMock } from '../__mocks__/models/organization.mock';
import { user as userMock } from '../__mocks__/models/user.mock';
import { core } from '../__mocks__/models/core.mock';

describe('Organization', () => {
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization();
    });

    /**
     * Tests for Organization instance initialization.
     * Validates default state and basic functionality.
     */
    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(organization).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(organization.name).toBeUndefined();
            expect(organization.visible).toBe(false);
            expect(organization.stripeCustomerId).toBeUndefined();
            expect(organization.subscriptionStatus).toBeUndefined();
            expect(organization.users).toHaveLength(0);
            expect(organization.adminUserId).toBeUndefined();
        });

        it('should create valid instance from mock data', () => {
            const mockOrg = orgMock.instances.standard;
            Object.assign(organization, mockOrg);
            
            expect(organization.id).toBe(mockOrg.id);
            expect(organization.name).toBe(mockOrg.name);
            expect(organization.adminUser.id).toBe(mockOrg.adminUser.id);
            expect(organization.visible).toBe(mockOrg.visible);
            expect(organization.stripeCustomerId).toBe(mockOrg.stripeCustomerId);
            expect(organization.subscriptionStatus).toBe(mockOrg.subscriptionStatus);
        });

        it('should create instance with multiple users', () => {
            const mockOrg = orgMock.instances.withUsers;
            Object.assign(organization, mockOrg);
            
            expect(organization.users).toHaveLength(mockOrg.users.length);
            expect(organization.users.map(u => u.id)).toEqual(
                expect.arrayContaining(mockOrg.users.map(u => u.id))
            );
        });
    });

    /**
     * Tests for Organization properties and validation.
     * Ensures data integrity and constraint enforcement.
     */
    describe('properties', () => {
        /**
         * Tests for core organization properties.
         * Validates name and visibility management.
         */
        describe('core properties', () => {
            it('should get and set name', () => {
                const mockOrg = orgMock.instances.standard;
                organization.name = mockOrg.name;
                expect(organization.name).toBe(mockOrg.name);
            });

            it('should require name', async () => {
                organization.name = undefined as any;
                const errors = await validate(organization);
                const nameErrors = errors.find(e => e.property === 'name');
                expect(nameErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set visible flag', () => {
                const mockOrg = orgMock.instances.standard;
                organization.visible = !mockOrg.visible;
                expect(organization.visible).toBe(!mockOrg.visible);
            });

            it('should default visible to false', () => {
                expect(organization.visible).toBe(false);
            });
        });

        /**
         * Tests for Stripe integration properties.
         * Validates customer ID and subscription status handling.
         */
        describe('stripe integration', () => {
            it('should get and set stripeCustomerId', () => {
                const mockOrg = orgMock.instances.standard;
                organization.stripeCustomerId = mockOrg.stripeCustomerId;
                expect(organization.stripeCustomerId).toBe(mockOrg.stripeCustomerId);
            });

            it('should allow organization without Stripe integration', () => {
                const mockOrg = orgMock.instances.noStripe;
                Object.assign(organization, mockOrg);
                expect(organization.stripeCustomerId).toBeUndefined();
            });

            it('should get and set subscriptionStatus', () => {
                const mockOrg = orgMock.instances.pastDue;
                organization.subscriptionStatus = mockOrg.subscriptionStatus;
                expect(organization.subscriptionStatus).toBe(SubscriptionStatus.PAST_DUE);
            });

            it('should handle different subscription states', () => {
                const states = [
                    orgMock.instances.standard, // ACTIVE
                    orgMock.instances.pastDue,  // PAST_DUE
                    orgMock.instances.suspended, // SUSPENDED
                    orgMock.instances.trial     // TRIAL
                ];

                states.forEach(org => {
                    organization.subscriptionStatus = org.subscriptionStatus;
                    expect(organization.subscriptionStatus).toBe(org.subscriptionStatus);
                });
            });
        });
    });

    /**
     * Tests for Organization relationships.
     * Validates admin user and member management.
     */
    describe('relationships', () => {
        /**
         * Tests for admin user relationship.
         * Ensures proper admin user assignment and validation.
         */
        describe('adminUser relationship', () => {
            describe('foreign key', () => {
                it('should get and set adminUserId', () => {
                    const mockOrg = orgMock.instances.standard;
                    organization.adminUserId = mockOrg.adminUser.id;
                    expect(organization.adminUserId).toBe(mockOrg.adminUser.id);
                });

                it('should require adminUserId', async () => {
                    expect(organization.adminUserId).toBeUndefined();
                    const errors = await validate(organization);
                    const adminUserIdErrors = errors.find(e => e.property === 'adminUserId');
                    expect(adminUserIdErrors?.constraints).toHaveProperty('isUuid');
                });
            });

            it('should set admin user relationship', () => {
                const mockOrg = orgMock.instances.standard;
                organization.adminUser = mockOrg.adminUser;
                expect(organization.adminUser).toBeDefined();
                expect(organization.adminUser.id).toBe(mockOrg.adminUser.id);
            });
        });

        /**
         * Tests for users collection.
         * Validates member management functionality.
         */
        describe('users collection', () => {
            it('should initialize users as empty array', () => {
                expect(organization.users).toBeDefined();
                expect(Array.isArray(organization.users)).toBe(true);
                expect(organization.users).toHaveLength(0);
            });

            it('should handle multiple users', () => {
                const mockOrg = orgMock.instances.withUsers;
                organization.users = mockOrg.users;
                expect(organization.users).toHaveLength(mockOrg.users.length);
            });

            it('should handle organization without users', () => {
                const mockOrg = orgMock.instances.noUsers;
                organization.users = mockOrg.users;
                expect(organization.users).toHaveLength(0);
            });

            it('should maintain user references', () => {
                const mockOrg = orgMock.instances.withUsers;
                organization.users = mockOrg.users;
                
                mockOrg.users.forEach(mockUser => {
                    const user = organization.users.find(u => u.id === mockUser.id);
                    expect(user).toBeDefined();
                    expect(user?.id).toBe(mockUser.id);
                });
            });
        });
    });

    /**
     * Tests for Organization temporal tracking.
     * Validates timestamp management and soft deletion.
     */
    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const mockOrg = orgMock.instances.standard;
            organization.createdAt = mockOrg.createdAt;
            organization.modifiedAt = mockOrg.modifiedAt;

            expect(organization.createdAt).toBe(mockOrg.createdAt);
            expect(organization.modifiedAt).toBe(mockOrg.modifiedAt);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(organization.deleted).toBe(false);
            expect(organization.deletedAt).toBeUndefined();
            
            // Mark as deleted
            organization.deleted = true;
            organization.deletedAt = core.timestamps.now;
            
            expect(organization.deleted).toBe(true);
            expect(organization.deletedAt).toBe(core.timestamps.now);
        });
    });
}); 