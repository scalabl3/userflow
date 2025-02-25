/**
 * Test suite for LoginCredential entity model.
 * Validates authentication credential functionality and data integrity.
 * 
 * Test Categories:
 * - Initialization: Default values and instance creation
 * - Core Properties: Credential identification and type
 * - Authentication: Password and OAuth handling
 * - Relationships: User associations
 * - Timestamps: Temporal tracking
 * 
 * Coverage Areas:
 * - Credential Configuration:
 *   - Identifier management
 *   - Type validation
 *   - User binding
 * 
 * - Authentication Types:
 *   - Password credentials
 *   - OAuth credentials
 *   - Token management
 * 
 * - Relationship Management:
 *   - User association
 */

import { validate } from 'class-validator';
import { LoginCredential } from './LoginCredential';
import { CredentialType, OAuthProvider } from '../managers/AuthenticationManager';
import { loginCredential as credentialMock } from '../__mocks__/models/loginCredential.mock';
import { baseUser as baseUserMock } from '../__mocks__/models/baseUser.mock';
import { core } from '../__mocks__/models/core.mock';

describe('LoginCredential', () => {
    let credential: LoginCredential;

    beforeEach(() => {
        credential = new LoginCredential();
    });

    /**
     * Tests for LoginCredential instance initialization.
     * Validates default state and basic functionality.
     */
    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(credential).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(credential.identifier).toBeUndefined();
            expect(credential.credentialType).toBeUndefined();
            expect(credential.isEnabled).toBe(true);
            expect(credential.baseUserId).toBeUndefined();
        });

        it('should create valid password credential from mock data', () => {
            const mockCred = credentialMock.instances.password.standard;
            Object.assign(credential, mockCred);
            
            expect(credential.id).toBe(mockCred.id);
            expect(credential.identifier).toBe(mockCred.identifier);
            expect(credential.credentialType).toBe(CredentialType.PASSWORD);
            expect(credential.isEnabled).toBe(mockCred.isEnabled);
            expect(credential.baseUserId).toBe(mockCred.baseUserId);
            expect(credential.passwordHash).toBe(mockCred.passwordHash);
        });

        it('should create valid OAuth credential from mock data', () => {
            const mockCred = credentialMock.instances.oauth.google;
            Object.assign(credential, mockCred);
            
            expect(credential.id).toBe(mockCred.id);
            expect(credential.identifier).toBe(mockCred.identifier);
            expect(credential.credentialType).toBe(CredentialType.OAUTH_GOOGLE);
            expect(credential.accessToken).toBe(mockCred.accessToken);
            expect(credential.refreshToken).toBe(mockCred.refreshToken);
        });
    });

    /**
     * Tests for LoginCredential properties and validation.
     * Ensures data integrity and constraint enforcement.
     */
    describe('properties', () => {
        /**
         * Tests for core credential properties.
         * Validates identifier and type management.
         */
        describe('core properties', () => {
            it('should get and set identifier', () => {
                const mockCred = credentialMock.instances.password.standard;
                credential.identifier = mockCred.identifier;
                expect(credential.identifier).toBe(mockCred.identifier);
            });

            it('should require identifier', async () => {
                const errors = await validate(credential);
                const identifierErrors = errors.find(e => e.property === 'identifier');
                expect(identifierErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set credential type', () => {
                const mockCred = credentialMock.instances.password.standard;
                credential.credentialType = mockCred.credentialType;
                expect(credential.credentialType).toBe(CredentialType.PASSWORD);
            });

            it('should require credential type', async () => {
                const errors = await validate(credential);
                const typeErrors = errors.find(e => e.property === 'credentialType');
                expect(typeErrors?.constraints).toHaveProperty('isEnum');
            });

            it('should get and set enabled flag', () => {
                credential.isEnabled = false;
                expect(credential.isEnabled).toBe(false);
            });
        });

        /**
         * Tests for password credential functionality.
         * Validates password-specific features.
         */
        describe('password credentials', () => {
            it('should handle password hash', () => {
                const mockCred = credentialMock.instances.password.standard;
                credential.passwordHash = mockCred.passwordHash;
                expect(credential.passwordHash).toBe(mockCred.passwordHash);
            });

            it('should validate password credential type', () => {
                const mockCred = credentialMock.instances.password.standard;
                Object.assign(credential, mockCred);
                expect(credential.credentialType).toBe(CredentialType.PASSWORD);
            });
        });

        /**
         * Tests for OAuth credential functionality.
         * Validates OAuth-specific features.
         */
        describe('oauth credentials', () => {
            it('should handle OAuth credential types', () => {
                const mockCred = credentialMock.instances.oauth.google;
                credential.credentialType = mockCred.credentialType;
                expect(credential.credentialType).toBe(CredentialType.OAUTH_GOOGLE);
            });

            it('should handle access token', () => {
                const mockCred = credentialMock.instances.oauth.google;
                credential.accessToken = mockCred.accessToken;
                credential.accessTokenExpiresAt = mockCred.accessTokenExpiresAt;
                
                expect(credential.accessToken).toBe(mockCred.accessToken);
                expect(credential.accessTokenExpiresAt).toBe(mockCred.accessTokenExpiresAt);
            });

            it('should handle refresh token', () => {
                const mockCred = credentialMock.instances.oauth.google;
                credential.refreshToken = mockCred.refreshToken;
                credential.refreshTokenExpiresAt = mockCred.refreshTokenExpiresAt;
                
                expect(credential.refreshToken).toBe(mockCred.refreshToken);
                expect(credential.refreshTokenExpiresAt).toBe(mockCred.refreshTokenExpiresAt);
            });

            it('should handle Apple-specific fields', () => {
                const mockCred = credentialMock.instances.oauth.apple;
                Object.assign(credential, mockCred);
                
                expect(credential.identityToken).toBe(mockCred.identityToken);
                expect(credential.authorizationCode).toBe(mockCred.authorizationCode);
            });
        });
    });

    /**
     * Tests for LoginCredential relationships.
     * Validates user associations.
     */
    describe('relationships', () => {
        /**
         * Tests for base user relationship.
         * Ensures proper user assignment and validation.
         */
        describe('baseUser relationship', () => {
            describe('foreign key', () => {
                it('should get and set baseUserId', () => {
                    const mockCred = credentialMock.instances.password.standard;
                    credential.baseUserId = mockCred.baseUserId;
                    expect(credential.baseUserId).toBe(mockCred.baseUserId);
                });

                it('should require baseUserId', async () => {
                    const errors = await validate(credential);
                    const userIdErrors = errors.find(e => e.property === 'baseUserId');
                    expect(userIdErrors?.constraints).toHaveProperty('isUuid');
                });
            });

            it('should set base user relationship', () => {
                const mockCred = credentialMock.instances.password.standard;
                credential.baseUser = baseUserMock.instances.standard;
                expect(credential.baseUser.id).toBe(mockCred.baseUserId);
            });
        });
    });

    /**
     * Tests for LoginCredential temporal tracking.
     * Validates timestamp management and soft deletion.
     */
    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const mockCred = credentialMock.instances.password.standard;
            credential.createdAt = mockCred.createdAt;
            credential.modifiedAt = mockCred.modifiedAt;

            expect(credential.createdAt).toBe(mockCred.createdAt);
            expect(credential.modifiedAt).toBe(mockCred.modifiedAt);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(credential.deleted).toBe(false);
            expect(credential.deletedAt).toBeUndefined();
            
            // Mark as deleted
            credential.deleted = true;
            credential.deletedAt = core.timestamps.now;
            
            expect(credential.deleted).toBe(true);
            expect(credential.deletedAt).toBe(core.timestamps.now);
        });
    });
}); 