/**
 * Test suite for LoginProvider entity model.
 * Validates authentication provider functionality and data integrity.
 * 
 * Test Categories:
 * - Initialization: Default values and instance creation
 * - Core Properties: Provider identification and configuration
 * - Relationships: Credential associations
 * - Timestamps: Temporal tracking
 * 
 * Coverage Areas:
 * - Provider Configuration:
 *   - Code management
 *   - Name handling
 *   - Status control
 * 
 * - Relationship Management:
 *   - Credential linkage
 *   - Collection handling
 * 
 * - Status Management:
 *   - Enable/disable functionality
 *   - State tracking
 */

import { validate } from 'class-validator';
import { LoginProvider } from './LoginProvider';
import { loginProvider as providerMock } from '../__mocks__/models/loginProvider.mock';
import { loginCredential as credentialMock } from '../__mocks__/models/loginCredential.mock';
import { core } from '../__mocks__/models/core.mock';

describe('LoginProvider', () => {
    let provider: LoginProvider;

    beforeEach(() => {
        provider = new LoginProvider();
    });

    /**
     * Tests for LoginProvider instance initialization.
     * Validates default state and basic functionality.
     */
    describe('initialization', () => {
        it('should create a valid instance', () => {
            expect(provider).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(provider.code).toBeUndefined();
            expect(provider.name).toBeUndefined();
            expect(provider.isEnabled).toBe(true);
            expect(provider.credentials).toHaveLength(0);
        });

        it('should create valid instance from mock data', () => {
            const mockProvider = providerMock.instances.standard;
            Object.assign(provider, mockProvider);
            
            expect(provider.id).toBe(mockProvider.id);
            expect(provider.code).toBe(mockProvider.code);
            expect(provider.name).toBe(mockProvider.name);
            expect(provider.isEnabled).toBe(mockProvider.isEnabled);
        });

        it('should create instance with credentials', () => {
            const mockProvider = providerMock.instances.withCredentials;
            Object.assign(provider, mockProvider);
            
            expect(provider.credentials).toBeDefined();
            expect(Array.isArray(provider.credentials)).toBe(true);
        });
    });

    /**
     * Tests for LoginProvider properties and validation.
     * Ensures data integrity and constraint enforcement.
     */
    describe('properties', () => {
        /**
         * Tests for core provider properties.
         * Validates code and name management.
         */
        describe('core properties', () => {
            it('should get and set code', () => {
                const mockProvider = providerMock.instances.standard;
                provider.code = mockProvider.code;
                expect(provider.code).toBe(mockProvider.code);
            });

            it('should require code', async () => {
                const errors = await validate(provider);
                const codeErrors = errors.find(e => e.property === 'code');
                expect(codeErrors?.constraints).toHaveProperty('isString');
            });

            it('should get and set name', () => {
                const mockProvider = providerMock.instances.standard;
                provider.name = mockProvider.name;
                expect(provider.name).toBe(mockProvider.name);
            });

            it('should require name', async () => {
                const errors = await validate(provider);
                const nameErrors = errors.find(e => e.property === 'name');
                expect(nameErrors?.constraints).toHaveProperty('isString');
            });
        });

        /**
         * Tests for provider status management.
         * Validates enable/disable functionality.
         */
        describe('status management', () => {
            it('should get and set enabled flag', () => {
                const mockProvider = providerMock.instances.disabled;
                provider.isEnabled = mockProvider.isEnabled;
                expect(provider.isEnabled).toBe(false);

                const mockEnabled = providerMock.instances.standard;
                provider.isEnabled = mockEnabled.isEnabled;
                expect(provider.isEnabled).toBe(true);
            });

            it('should default to enabled', () => {
                expect(provider.isEnabled).toBe(true);
            });
        });
    });

    /**
     * Tests for LoginProvider relationships.
     * Validates credential associations.
     */
    describe('relationships', () => {
        /**
         * Tests for credentials collection.
         * Validates credential management functionality.
         */
        describe('credentials collection', () => {
            it('should initialize credentials as empty array', () => {
                expect(provider.credentials).toBeDefined();
                expect(Array.isArray(provider.credentials)).toBe(true);
                expect(provider.credentials).toHaveLength(0);
            });

            it('should handle provider with credentials', () => {
                const mockProvider = providerMock.instances.withCredentials;
                provider.credentials = [credentialMock.instances.password.standard];
                expect(provider.credentials).toBeDefined();
                expect(provider.credentials.length).toBeGreaterThan(0);
            });

            it('should handle provider without credentials', () => {
                const mockProvider = providerMock.instances.standard;
                Object.assign(provider, mockProvider);
                expect(provider.credentials).toHaveLength(0);
            });
        });
    });

    /**
     * Tests for LoginProvider temporal tracking.
     * Validates timestamp management and soft deletion.
     */
    describe('timestamps', () => {
        it('should track creation and modification times', () => {
            const mockProvider = providerMock.instances.standard;
            provider.createdAt = mockProvider.createdAt;
            provider.modifiedAt = mockProvider.modifiedAt;

            expect(provider.createdAt).toBe(mockProvider.createdAt);
            expect(provider.modifiedAt).toBe(mockProvider.modifiedAt);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(provider.deleted).toBe(false);
            expect(provider.deletedAt).toBeUndefined();
            
            // Mark as deleted
            provider.deleted = true;
            provider.deletedAt = core.timestamps.now;
            
            expect(provider.deleted).toBe(true);
            expect(provider.deletedAt).toBe(core.timestamps.now);
        });
    });
}); 