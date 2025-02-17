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
import { UserState } from '@my-app/shared/dist/enums/UserState';

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

        it('should handle id field', () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            user.id = userId;
            expect(user.id).toBe(userId);
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
                const firstname = 'John';
                user.firstname = firstname;
                expect(user.firstname).toBe(firstname);
            });

            it('should require firstname', async () => {
                expect(user.firstname).toBeUndefined();
                const errors = await validate(user);
                const firstnameErrors = errors.find(e => e.property === 'firstname');
                expect(firstnameErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set lastname', () => {
                const lastname = 'Doe';
                user.lastname = lastname;
                expect(user.lastname).toBe(lastname);
            });

            it('should require lastname', async () => {
                expect(user.lastname).toBeUndefined();
                const errors = await validate(user);
                const lastnameErrors = errors.find(e => e.property === 'lastname');
                expect(lastnameErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set contact email', () => {
                const email = 'john@example.com';
                user.contactEmail = email;
                expect(user.contactEmail).toBe(email);
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
                user.isEnabled = false;
                expect(user.isEnabled).toBe(false);

                user.isEnabled = true;
                expect(user.isEnabled).toBe(true);
            });

            it('should handle last login time', () => {
                const loginTime = new Date();
                user.lastLoginAt = loginTime;
                expect(user.lastLoginAt).toBe(loginTime);
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
        });
    });

    /**
     * Tests for BaseUser temporal tracking.
     * Validates timestamp management and soft deletion.
     */
    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const now = new Date();
            user.createdAt = now;
            user.modifiedAt = now;

            expect(user.createdAt).toBe(now);
            expect(user.modifiedAt).toBe(now);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(user.deleted).toBe(false);
            expect(user.deletedAt).toBeUndefined();
            
            // Mark as deleted
            const deletionTime = new Date();
            user.deleted = true;
            user.deletedAt = deletionTime;
            
            expect(user.deleted).toBe(true);
            expect(user.deletedAt).toBe(deletionTime);
        });
    });
}); 