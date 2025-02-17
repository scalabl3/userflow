/**
 * Central export point for all enumeration types.
 * Provides organized access to system-wide enums.
 * 
 * Exports:
 * 1. Authentication Enums:
 *    - CredentialType: Authentication method types
 *    - OAuthProvider: Supported OAuth providers
 * 
 * 2. User Management Enums:
 *    - UserState: Account lifecycle states
 * 
 * Usage:
 * - Single import point for all enums
 * - Type-safe enum access
 * - Consistent enum usage across modules
 */

// Export credential-related enums
export * from './CredentialType';

// Export user-related enums
export * from './UserState'; 
