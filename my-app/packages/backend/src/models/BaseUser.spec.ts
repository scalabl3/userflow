/**
 * Test suite for BaseUser entity model.
 * Validates core user functionality and data integrity.
 * 
 * Test Categories:
 * - Initialization: Default values and instance creation
 * - Properties: Core field validation and constraints
 * - State Management: User state transitions and flags
 * - Relationships: Credential associations
 * - Timestamps: Temporal tracking and soft deletion
 * 
 * Coverage Areas:
 * - Data Validation: Field constraints and types
 * - State Transitions: Valid state changes
 * - Relationship Integrity: Collection initialization
 * - Temporal Tracking: Creation, modification, deletion
 * 
 * Test Structure:
 * 1. Initialization
 *    - Instance creation
 *    - Default values
 *    - ID handling
 * 
 * 2. Properties
 *    - Core fields (firstname, lastname, email)
 *    - Required field validation
 *    - Format validation
 * 
 * 3. State Management
 *    - State transitions
 *    - Enable/disable functionality
 *    - Login tracking
 * 
 * 4. Relationships
 *    - LoginCredentials collection
 *    - Collection initialization
 * 
 * 5. Timestamps
 *    - Creation tracking
 *    - Modification tracking
 *    - Soft deletion support
 */

import { validate } from 'class-validator';
import { BaseUser } from './BaseUser';
import { UserState } from '@my-app/shared';
import { baseUser as baseUserMock } from '../__mocks__/models/baseUser.mock';
import { loginCredential as loginCredentialMock } from '../__mocks__/models/loginCredential.mock';
import { core } from '../__mocks__/models/core.mock';

describe('BaseUser', () => {
    let user: BaseUser;

    beforeEach(() => {
        user = new BaseUser();
    });

    /**
     * Tests for BaseUser instance initialization.
     * Validates default state and basic functionality.
     */
    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(user).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(user.state).toBe(UserState.PENDING);
            expect(user.isEnabled).toBe(true);
            expect(user.lastLoginAt).toBeUndefined();
        });

        it('should create valid instance from mock data', () => {
            const mockUser = baseUserMock.instances.standard;
            Object.assign(user, mockUser);
            
            expect(user.id).toBe(mockUser.id);
            expect(user.firstname).toBe(mockUser.firstname);
            expect(user.lastname).toBe(mockUser.lastname);
            expect(user.contactEmail).toBe(mockUser.contactEmail);
            expect(user.state).toBe(mockUser.state);
            expect(user.isEnabled).toBe(mockUser.isEnabled);
        });
    });

    /**
     * Tests for BaseUser properties and validation.
     * Ensures data integrity and constraint enforcement.
     */
    describe('properties', () => {
        /**
         * Tests for core user properties.
         * Validates required fields and format constraints.
         */
        describe('core properties', () => {
            it('should get and set firstname', () => {
                const mockUser = baseUserMock.instances.standard;
                user.firstname = mockUser.firstname;
                expect(user.firstname).toBe(mockUser.firstname);
            });

            it('should require firstname', async () => {
                expect(user.firstname).toBeUndefined();
                const errors = await validate(user);
                const firstnameErrors = errors.find(e => e.property === 'firstname');
                expect(firstnameErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set lastname', () => {
                const mockUser = baseUserMock.instances.standard;
                user.lastname = mockUser.lastname;
                expect(user.lastname).toBe(mockUser.lastname);
            });

            it('should require lastname', async () => {
                expect(user.lastname).toBeUndefined();
                const errors = await validate(user);
                const lastnameErrors = errors.find(e => e.property === 'lastname');
                expect(lastnameErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set contact email', () => {
                const mockUser = baseUserMock.instances.standard;
                user.contactEmail = mockUser.contactEmail;
                expect(user.contactEmail).toBe(mockUser.contactEmail);
            });

            it('should require contact email', async () => {
                expect(user.contactEmail).toBeUndefined();
                const errors = await validate(user);
                const emailErrors = errors.find(e => e.property === 'contactEmail');
                expect(emailErrors?.constraints).toHaveProperty('isEmail');
            });
        });

        /**
         * Tests for user state management.
         * Validates state transitions and status flags.
         */
        describe('state management', () => {
            it('should handle state transitions', () => {
                const states = [
                    UserState.PENDING,
                    UserState.ACTIVE,
                    UserState.SUSPENDED,
                    UserState.DEACTIVATED
                ];

                states.forEach(state => {
                    user.state = state;
                    expect(user.state).toBe(state);
                });
            });

            it('should handle enabled flag', () => {
                const mockDisabled = baseUserMock.instances.disabled;
                user.isEnabled = mockDisabled.isEnabled;
                expect(user.isEnabled).toBe(mockDisabled.isEnabled);

                const mockEnabled = baseUserMock.instances.standard;
                user.isEnabled = mockEnabled.isEnabled;
                expect(user.isEnabled).toBe(mockEnabled.isEnabled);
            });

            it('should handle last login time', () => {
                const mockUser = baseUserMock.instances.standard;
                user.lastLoginAt = mockUser.lastLoginAt;
                expect(user.lastLoginAt).toBe(mockUser.lastLoginAt);
            });
        });
    });

    /**
     * Tests for BaseUser relationships.
     * Validates association initialization and management.
     */
    describe('relationships', () => {
        /**
         * Tests for login credentials collection.
         * Ensures proper initialization and array handling.
         */
        describe('loginCredentials collection', () => {
            it('should initialize loginCredentials as empty array', () => {
                expect(user.loginCredentials).toBeDefined();
                expect(Array.isArray(user.loginCredentials)).toBe(true);
                expect(user.loginCredentials).toHaveLength(0);
            });

            it('should handle multiple credentials', () => {
                const mockUser = baseUserMock.instances.withMultipleCredentials;
                Object.assign(user, mockUser);
                
                expect(user.loginCredentials).toHaveLength(2);
                expect(user.loginCredentials).toContainEqual(
                    expect.objectContaining({
                        credentialType: loginCredentialMock.instances.password.standard.credentialType
                    })
                );
                expect(user.loginCredentials).toContainEqual(
                    expect.objectContaining({
                        credentialType: loginCredentialMock.instances.oauth.google.credentialType
                    })
                );
            });

            it('should handle user without credentials', () => {
                const mockUser = baseUserMock.instances.noCredentials;
                Object.assign(user, mockUser);
                
                expect(user.loginCredentials).toHaveLength(0);
            });
        });
    });

    /**
     * Tests for BaseUser temporal tracking.
     * Validates timestamp management and soft deletion.
     */
    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const mockUser = baseUserMock.instances.standard;
            user.createdAt = mockUser.createdAt;
            user.modifiedAt = mockUser.modifiedAt;

            expect(user.createdAt).toBe(mockUser.createdAt);
            expect(user.modifiedAt).toBe(mockUser.modifiedAt);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(user.deleted).toBe(false);
            expect(user.deletedAt).toBeUndefined();
            
            // Mark as deleted
            user.deleted = true;
            user.deletedAt = core.timestamps.now;
            
            expect(user.deleted).toBe(true);
            expect(user.deletedAt).toBe(core.timestamps.now);
        });
    });
}); 