/**
 * Central export point for all enumeration types.
 * Provides organized access to system-wide enums.
 * 
 * Exports:
 * 1. User Management Enums:
 *    - UserState: Account lifecycle states
 * 
 * 2. Subscription Enums:
 *    - SubscriptionStatus: Subscription state tracking
 * 
 * 3. Authentication Enums:
 *    - CredentialType: Authentication credential types
 *    - OAuthProvider: OAuth provider mappings
 * 
 * Note:
 * - Authentication enums (CredentialType, OAuthProvider) are now managed by AuthenticationManager
 * - Import these directly from '@my-app/backend/src/managers/AuthenticationManager'
 * 
 * Usage:
 * - Single import point for all enums
 * - Type-safe enum access
 * - Consistent enum usage across modules
 */

// Export user-related enums
export * from './UserState';

// Export new subscription status enum
export * from './SubscriptionStatus';

// Export authentication enums
export * from './CredentialType'; 
