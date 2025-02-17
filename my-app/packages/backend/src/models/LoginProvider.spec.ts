/**
 * Test suite for LoginProvider entity model.
 * Validates authentication provider functionality and data integrity.
 * 
 * Test Categories:
 * - Initialization: Default values and instance creation
 * - Core Properties: Provider identification and naming
 * - State Management: Provider activation control
 * - Relationships: Credential collections
 * - Timestamps: Temporal tracking
 * 
 * Coverage Areas:
 * - Provider Configuration:
 *   - Unique provider codes
 *   - Display names
 *   - Enable/disable functionality
 * 
 * - Data Validation:
 *   - Required fields
 *   - Field formats
 *   - Length constraints
 * 
 * - Collection Management:
 *   - Credential associations
 *   - Collection initialization
 * 
 * Test Structure:
 * 1. Initialization
 *    - Instance creation
 *    - Default values
 *    - ID handling
 * 
 * 2. Properties
 *    - Core fields (code, name)
 *    - Field validation
 *    - State management
 * 
 * 3. Relationships
 *    - Credentials collection
 *    - Collection initialization
 * 
 * 4. Timestamps
 *    - Creation tracking
 *    - Modification tracking
 *    - Soft deletion
 */

import { validate } from 'class-validator';
import { LoginProvider } from './LoginProvider';

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
            expect(provider.isEnabled).toBe(true);
        });

        it('should handle id field', () => {
            const providerId = '123e4567-e89b-12d3-a456-426614174000';
            provider.id = providerId;
            expect(provider.id).toBe(providerId);
        });
    });

    /**
     * Tests for LoginProvider properties and validation.
     * Ensures data integrity and constraint enforcement.
     */
    describe('properties', () => {
        /**
         * Tests for core provider properties.
         * Validates required fields and format constraints.
         */
        describe('core properties', () => {
            it('should get and set code', () => {
                const code = 'google';
                provider.code = code;
                expect(provider.code).toBe(code);
            });

            it('should require code', async () => {
                expect(provider.code).toBeUndefined();
                const errors = await validate(provider);
                const codeErrors = errors.find(e => e.property === 'code');
                expect(codeErrors?.constraints).toHaveProperty('isString');
                expect(codeErrors?.constraints).toHaveProperty('isStandardLength');
            });

            it('should get and set name', () => {
                const name = 'Google OAuth';
                provider.name = name;
                expect(provider.name).toBe(name);
            });

            it('should require name', async () => {
                expect(provider.name).toBeUndefined();
                const errors = await validate(provider);
                const nameErrors = errors.find(e => e.property === 'name');
                expect(nameErrors?.constraints).toHaveProperty('isString');
                expect(nameErrors?.constraints).toHaveProperty('isStandardLength');
            });
        });

        /**
         * Tests for provider state management.
         * Validates enable/disable functionality.
         */
        describe('state management', () => {
            it('should get and set enabled status', () => {
                provider.isEnabled = false;
                expect(provider.isEnabled).toBe(false);

                provider.isEnabled = true;
                expect(provider.isEnabled).toBe(true);
            });
        });
    });

    /**
     * Tests for LoginProvider relationships.
     * Validates credential collection management.
     */
    describe('relationships', () => {
        /**
         * Tests for credentials collection.
         * Ensures proper initialization and array handling.
         */
        describe('credentials collection', () => {
            it('should initialize credentials as empty array', () => {
                expect(provider.credentials).toBeDefined();
                expect(Array.isArray(provider.credentials)).toBe(true);
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
            const now = new Date();
            provider.createdAt = now;
            provider.modifiedAt = now;

            expect(provider.createdAt).toBe(now);
            expect(provider.modifiedAt).toBe(now);
        });

        it('should handle soft deletion', () => {
            // Initially not deleted
            expect(provider.deleted).toBe(false);
            expect(provider.deletedAt).toBeUndefined();
            
            // Mark as deleted
            const deletionTime = new Date();
            provider.deleted = true;
            provider.deletedAt = deletionTime;
            
            expect(provider.deleted).toBe(true);
            expect(provider.deletedAt).toBe(deletionTime);
        });
    });
}); 