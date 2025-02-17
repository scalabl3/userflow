/**
 * Types of authentication credentials supported by the system.
 * Used to identify and manage different authentication methods.
 * 
 * Core Features:
 * - Password-based authentication
 * - OAuth provider authentication
 * - Phone-based authentication
 * 
 * Usage:
 * - User authentication flow selection
 * - Credential type validation
 * - Authentication method tracking
 * 
 * @enum {string}
 */
export enum CredentialType {
    /** Traditional username/password authentication */
    PASSWORD = 'PASSWORD',
    /** OAuth-based authentication through external providers */
    OAUTH = 'OAUTH',
    /** Phone number based authentication (SMS/call verification) */
    PHONE = 'PHONE'
}

/**
 * Supported OAuth providers for external authentication.
 * Defines the list of third-party authentication providers.
 * 
 * Core Features:
 * - Google OAuth integration
 * - GitHub OAuth integration
 * - Apple Sign-In support
 * 
 * Usage:
 * - OAuth provider selection
 * - Authentication flow routing
 * - Provider-specific configuration
 * 
 * @enum {string}
 */
export enum OAuthProvider {
    /** Google OAuth authentication provider */
    GOOGLE = 'google',
    /** GitHub OAuth authentication provider */
    GITHUB = 'github',
    /** Apple Sign-In authentication provider */
    APPLE = 'apple'
} 