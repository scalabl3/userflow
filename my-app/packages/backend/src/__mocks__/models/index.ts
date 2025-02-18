/**
 * Central export point for all mock data used in testing.
 * 
 * Core Features:
 * - Aggregates all mock data from individual mock files
 * - Provides a single import point for test files
 * - Includes mocks for:
 *   - Core data (IDs and timestamps)
 *   - Authentication (providers and credentials)
 *   - Users (base and standard)
 *   - Error responses
 *   - Organizations
 */

export * from './core.mock';
export * from './bcrypt.mock';
export * from './auth.mock';
export * from './user.mock';
export * from './errors.mock'; 
export * from './organization.mock';