/**
 * Test suite for User entity model.
 * Validates user management functionality, inheritance from BaseUser, and data integrity.
 * 
 * Test Categories:
 * - Initialization: Default values and instance creation
 * - Core Properties: User-specific fields
 * - Inherited Properties: BaseUser fields and behavior
 * - Preferences: Theme and notification settings
 * - Relationships: Organization and credentials
 * - Timestamps: Temporal tracking
 * 
 * Coverage Areas:
 * - User Configuration
 * - Data Validation
 * - Preference Management
 * - Relationship Management
 */

import { validate } from 'class-validator';
import { User } from './User';
import { UserState } from '@my-app/shared';
import { user as userMock } from '../__mocks__/models/user.mock';
import { baseUser as baseUserMock } from '../__mocks__/models/baseUser.mock';
import { organization as orgMock } from '../__mocks__/models/organization.mock';
import { core } from '../__mocks__/models/core.mock';

describe('User', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
    });

    /**
     * Tests for User instance initialization.
     * Validates default state and basic functionality.
     */
    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(user).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(user.state).toBe(UserState.PENDING);
            expect(user.isEnabled).toBe(true);
            expect(user.preferences).toBeDefined();
            expect(user.preferences.theme).toBe('light');
            expect(user.preferences.notifications.email).toBe(true);
            expect(user.preferences.notifications.push).toBe(true);
        });

        it('should create valid instance from mock data', () => {
            const mockUser = userMock.instances.standard;
            Object.assign(user, mockUser);
            
            expect(user.id).toBe(mockUser.id);
            expect(user.username).toBe(mockUser.username);
            expect(user.displayname).toBe(mockUser.displayname);
            expect(user.organizationId).toBe(mockUser.organizationId);
            expect(user.preferences).toEqual(mockUser.preferences);
        });
    });

    /**
     * Tests for User properties and validation.
     * Ensures data integrity and constraint enforcement.
     */
    describe('properties', () => {
        /**
         * Tests for core user properties.
         * Validates username and display name management.
         */
        describe('core properties', () => {
            it('should get and set username', () => {
                const mockUser = userMock.instances.standard;
                user.username = mockUser.username;
                expect(user.username).toBe(mockUser.username);
            });

            it('should get and set displayname', () => {
                const mockUser = userMock.instances.standard;
                user.displayname = mockUser.displayname;
                expect(user.displayname).toBe(mockUser.displayname);
            });
        });

        /**
         * Tests for properties inherited from BaseUser.
         * Validates proper inheritance and behavior.
         */
        describe('inherited properties', () => {
            it('should handle firstname from BaseUser', () => {
                const mockUser = baseUserMock.instances.standard;
                user.firstname = mockUser.firstname;
                expect(user.firstname).toBe(mockUser.firstname);
            });

            it('should handle lastname from BaseUser', () => {
                const mockUser = baseUserMock.instances.standard;
                user.lastname = mockUser.lastname;
                expect(user.lastname).toBe(mockUser.lastname);
            });

            it('should handle state from BaseUser', () => {
                const mockUser = baseUserMock.instances.standard;
                user.state = mockUser.state;
                expect(user.state).toBe(mockUser.state);
            });
        });

        /**
         * Tests for user preferences.
         * Validates theme and notification settings.
         */
        describe('preferences', () => {
            it('should get and set theme', () => {
                const mockUser = userMock.instances.withMultipleCredentials;
                user.preferences = mockUser.preferences;
                expect(user.preferences.theme).toBe('dark');

                const mockStandard = userMock.instances.standard;
                user.preferences = mockStandard.preferences;
                expect(user.preferences.theme).toBe('light');
            });

            it('should get and set notification preferences', () => {
                const mockUser = userMock.instances.disabled;
                user.preferences = mockUser.preferences;
                expect(user.preferences.notifications.email).toBe(false);
                expect(user.preferences.notifications.push).toBe(false);
            });

            it('should handle complete preference override', () => {
                const mockUser = userMock.instances.withMultipleCredentials;
                user.preferences = mockUser.preferences;
                expect(user.preferences).toEqual(mockUser.preferences);
            });
        });
    });

    /**
     * Tests for User relationships.
     * Validates organization and credential management.
     */
    describe('relationships', () => {
        /**
         * Tests for organization relationship.
         * Ensures proper organization assignment.
         */
        describe('organization relationship', () => {
            describe('foreign key', () => {
                it('should get and set organizationId', () => {
                    const mockUser = userMock.instances.standard;
                    user.organizationId = mockUser.organizationId;
                    expect(user.organizationId).toBe(mockUser.organizationId);
                });

                it('should handle user without organization', () => {
                    const mockUser = userMock.instances.noOrganization;
                    user.organizationId = mockUser.organizationId;
                    expect(user.organizationId).toBe('');
                });

                it('should require organizationId', async () => {
                    expect(user.organizationId).toBeUndefined();
                    const errors = await validate(user);
                    const orgIdErrors = errors.find(e => e.property === 'organizationId');
                    expect(orgIdErrors?.constraints).toHaveProperty('isUuid');
                });
            });
        });

        /**
         * Tests for login credentials collection.
         * Validates credential management functionality.
         */
        describe('loginCredentials collection', () => {
            it('should initialize loginCredentials as empty array', () => {
                expect(user.loginCredentials).toBeDefined();
                expect(Array.isArray(user.loginCredentials)).toBe(true);
                expect(user.loginCredentials).toHaveLength(0);
            });

            it('should handle multiple credentials', () => {
                const mockUser = userMock.instances.withMultipleCredentials;
                Object.assign(user, mockUser);
                expect(user.loginCredentials).toHaveLength(mockUser.loginCredentials.length);
            });

            it('should handle OAuth credentials', () => {
                const mockUser = userMock.instances.withOAuth;
                Object.assign(user, mockUser);
                expect(user.loginCredentials).toHaveLength(1);
                expect(user.loginCredentials[0].credentialType).toBe('OAUTH');
            });
        });
    });

    /**
     * Tests for User temporal tracking.
     * Validates timestamp management and login tracking.
     */
    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const mockUser = userMock.instances.standard;
            user.createdAt = mockUser.createdAt;
            user.modifiedAt = mockUser.modifiedAt;

            expect(user.createdAt).toBe(mockUser.createdAt);
            expect(user.modifiedAt).toBe(mockUser.modifiedAt);
        });

        it('should track last login time from BaseUser', () => {
            const mockUser = userMock.instances.standard;
            user.lastLoginAt = mockUser.lastLoginAt;
            expect(user.lastLoginAt).toBe(mockUser.lastLoginAt);
        });
    });
}); 
