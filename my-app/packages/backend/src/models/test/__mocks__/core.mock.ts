/**
 * Core mock data used across all test files.
 * Provides consistent test data for all model tests.
 * 
 * Core Features:
 * - Consistent entity IDs for reliable references
 * - Standard timestamps for temporal testing
 * - Predictable test data for reproducible tests
 * 
 * Test Categories:
 * - Entity Relationships: Consistent IDs for relationship testing
 * - Temporal Logic: Standard timestamps for time-based operations
 * - Data Integrity: Predictable values for validation testing
 * 
 * Usage:
 * - Service Tests: Base data for service operations
 * - Integration Tests: Consistent data across test suites
 * - Relationship Tests: Testing entity associations
 * - Validation Tests: Testing data constraints
 */

export const core = {
  /** 
   * Standard entity identifiers for testing.
   * Used to maintain consistent relationships across tests.
   * 
   * IDs follow pattern: 'entity-type-123'
   * This ensures unique, readable test identifiers.
   */
  ids: {
    /** Organization test ID for org-specific operations */
    organization: 'org-123',
    /** Base user test ID for core user operations */
    baseUser: 'base-user-123',
    /** User test ID for organization member operations */
    user: 'user-123',
    /** Email provider test ID for password auth */
    emailProvider: 'email-provider-123',
    /** Password credential test ID for local auth */
    passwordCred: 'password-cred-123',
    /** Google provider test ID for OAuth */
    googleProvider: 'google-provider-123',
    /** Google credential test ID for OAuth auth */
    googleCred: 'google-cred-123'
  },
  /** 
   * Standard timestamps for temporal testing.
   * Provides fixed points in time for predictable testing.
   * 
   * Time Points:
   * - now: Current reference point (2024)
   * - past: Historical reference (2023)
   * - future: Forward reference (2025)
   * 
   * Used for:
   * - Creation dates
   * - Modification tracking
   * - Token expiration
   * - Temporal validation
   */
  timestamps: {
    /** Current timestamp (2024-01-01) for "now" operations */
    now: new Date('2024-01-01T00:00:00Z'),
    /** Past timestamp (2023-01-01) for historical operations */
    past: new Date('2023-01-01T00:00:00Z'),
    /** Future timestamp (2025-01-01) for expiration testing */
    future: new Date('2025-01-01T00:00:00Z')
  }
}; 