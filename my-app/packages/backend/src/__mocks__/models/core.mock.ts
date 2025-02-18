/**
 * Core mock data used across all test files.
 * Provides consistent test data for all model tests.
 * 
 * Structure:
 * - ids: Entity identifiers for relationships
 * - timestamps: Standard time points
 * - constants: Shared test values
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
    // Organization IDs
    organization: 'org-test-123',
    organization2: 'org-test-456',
    organization3: 'org-test-789',
    organization4: 'org-test-012',
    organization5: 'org-test-345',

    // User IDs
    baseUser: 'base-user-123',
    baseUser2: 'base-user-456',
    baseUser3: 'base-user-789',
    user: 'user-test-123',
    user2: 'user-test-456',
    user3: 'user-test-789',

    // Authentication IDs
    emailProvider: 'email-prov-123',
    googleProvider: 'google-prov-123',
    appleProvider: 'apple-prov-123',
    passwordCred: 'pass-cred-123',
    googleCred: 'google-cred-123',
    appleCred: 'apple-cred-123'
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
    // Fixed points in time for predictable testing
    past: new Date('2025-01-01T00:00:00Z'),     // 1 day ago
    now: new Date('2025-01-02T00:00:00Z'),      // current reference
    future: new Date('2025-01-03T00:00:00Z'),   // 1 day ahead
    farPast: new Date('2024-01-02T00:00:00Z'),  // 1 year ago
    farFuture: new Date('2026-01-02T00:00:00Z') // 1 year ahead
  },

  constants: {
    // Standard test values
    email: 'test@example.com',
    password: 'Password123!',
    phone: '+1234567890',
    website: 'https://example.com',
    
    // OAuth values
    oauthToken: 'oauth-token-123',
    oauthRefresh: 'oauth-refresh-123',
    
    // Stripe values
    stripeCustomer: 'cus_test123',
    stripeSubscription: 'sub_test123',
    stripePrice: 'price_test123'
  }
}; 