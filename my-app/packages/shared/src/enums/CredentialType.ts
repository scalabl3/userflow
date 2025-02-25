/**
 * Re-exports the authentication credential enums from the backend.
 * This approach avoids duplicating enum definitions across the codebase.
 * 
 * This file exists for backward compatibility and to provide a consistent import path.
 */

// Define local versions for the build process
/**
 * Types of authentication credentials supported by the system.
 * All types are in SCREAMING_SNAKE_CASE for consistency.
 * OAuth subtypes are prefixed with OAUTH_ to clearly indicate their category.
 */
export enum CredentialType {
    /** Traditional username/password authentication */
    PASSWORD = 'PASSWORD',
    
    /** Phone number verification (SMS/call codes) */
    PHONE = 'PHONE',
    
    /** Email magic link authentication */
    MAGIC_LINK = 'MAGIC_LINK',
    
    /** Biometric authentication (fingerprint, face, etc) */
    BIOMETRIC = 'BIOMETRIC',
    
    /** Google OAuth authentication */
    OAUTH_GOOGLE = 'OAUTH_GOOGLE',
    
    /** GitHub OAuth authentication */
    OAUTH_GITHUB = 'OAUTH_GITHUB',
    
    /** Apple Sign In (special OAuth case) */
    OAUTH_APPLE = 'OAUTH_APPLE'
}

/**
 * OAuth providers supported by the system.
 * These map to the CredentialType OAUTH_* values without the prefix.
 */
export enum OAuthProvider {
    /** Google OAuth provider */
    GOOGLE = 'OAUTH_GOOGLE',
    
    /** GitHub OAuth provider */
    GITHUB = 'OAUTH_GITHUB',
    
    /** Apple Sign In provider */
    APPLE = 'OAUTH_APPLE'
} 