import { authConfigManager, AuthConfig, OAuthProviderConfig, AppleAuthConfig, PasswordAuthConfig, PhoneAuthConfig, MagicLinkConfig, BiometricConfig } from './auth.config';

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
 * Singleton manager for handling authentication validation and flows.
 * Provides centralized authentication logic for all credential types.
 * 
 * Usage:
 * ```typescript
 * const authManager = AuthenticationManager.getInstance();
 * const isValid = authManager.validateCredential(credential);
 * ```
 */
export class AuthenticationManager {
    private static instance: AuthenticationManager;
    private config: AuthConfig;

    private constructor() {
        this.config = authConfigManager.getConfig();
        this.setupConfigListener();
    }

    /**
     * Gets the singleton instance of AuthenticationManager.
     * Creates the instance if it doesn't exist.
     */
    public static getInstance(): AuthenticationManager {
        if (!AuthenticationManager.instance) {
            AuthenticationManager.instance = new AuthenticationManager();
        }
        return AuthenticationManager.instance;
    }

    /**
     * Set up listener for configuration changes
     */
    private setupConfigListener(): void {
        authConfigManager.on('configUpdated', (newConfig: AuthConfig) => {
            this.config = newConfig;
            // You might want to emit your own event or handle the update in some way
            console.log('Authentication configuration updated');
        });

        authConfigManager.on('error', (error: Error) => {
            console.error('Authentication configuration error:', error);
        });
    }

    /**
     * Update authentication configuration
     * @param updates Partial configuration updates
     */
    public async updateConfig(updates: Partial<AuthConfig>): Promise<void> {
        await authConfigManager.updateConfig(updates);
    }

    /**
     * Force reload the configuration from disk
     */
    public reloadConfig(): void {
        authConfigManager.reloadConfig();
    }

    /**
     * Check if a specific authentication method is enabled
     */
    public isMethodEnabled(method: CredentialType): boolean {
        switch (method) {
            case CredentialType.PASSWORD:
                return this.config.password.enabled;
            case CredentialType.OAUTH_GOOGLE:
            case CredentialType.OAUTH_GITHUB:
            case CredentialType.OAUTH_APPLE:
                return this.config.oauth.enabled;
            case CredentialType.PHONE:
                return this.config.phone.enabled;
            case CredentialType.MAGIC_LINK:
                return this.config.magicLink.enabled;
            case CredentialType.BIOMETRIC:
                return this.config.biometric.enabled;
            default:
                return false;
        }
    }

    /**
     * Check if a specific OAuth provider is enabled
     */
    public isOAuthProviderEnabled(provider: string): boolean {
        return (
            this.config.oauth.enabled &&
            this.config.oauth.providers[provider]?.enabled
        );
    }

    /**
     * Gets the configuration for a specific OAuth provider
     */
    public getOAuthConfig(provider: string): OAuthProviderConfig {
        if (!this.isOAuthProviderEnabled(provider)) {
            throw new Error(`OAuth provider ${provider} is not enabled`);
        }
        return this.config.oauth.providers[provider];
    }

    /**
     * Gets the configuration for Apple Sign In
     */
    public getAppleConfig(): AppleAuthConfig {
        if (!this.config.apple.enabled) {
            throw new Error('Apple Sign In is not enabled');
        }
        return this.config.apple;
    }

    /**
     * Gets the password validation configuration
     */
    public getPasswordConfig(): PasswordAuthConfig {
        if (!this.config.password.enabled) {
            throw new Error('Password authentication is not enabled');
        }
        return this.config.password;
    }

    /**
     * Gets the phone authentication configuration
     */
    public getPhoneConfig(): PhoneAuthConfig {
        if (!this.config.phone.enabled) {
            throw new Error('Phone authentication is not enabled');
        }
        return this.config.phone;
    }

    /**
     * Gets the magic link configuration
     */
    public getMagicLinkConfig(): MagicLinkConfig {
        if (!this.config.magicLink.enabled) {
            throw new Error('Magic link authentication is not enabled');
        }
        return this.config.magicLink;
    }

    /**
     * Gets the biometric authentication configuration
     */
    public getBiometricConfig(): BiometricConfig {
        if (!this.config.biometric.enabled) {
            throw new Error('Biometric authentication is not enabled');
        }
        return this.config.biometric;
    }

    /**
     * Validates a credential based on its type.
     * Handles different validation rules for each CredentialType.
     */
    public validateCredential(credential: any): boolean {
        if (!this.isMethodEnabled(credential.credentialType)) {
            throw new Error(`Authentication method ${credential.credentialType} is not enabled`);
        }

        switch (credential.credentialType) {
            case CredentialType.PASSWORD:
                return this.validatePasswordCredential(credential);
            
            case CredentialType.OAUTH_GOOGLE:
            case CredentialType.OAUTH_GITHUB:
            case CredentialType.OAUTH_APPLE:
                return this.validateOAuthCredential(credential);
            
            case CredentialType.PHONE:
                return this.validatePhoneCredential(credential);
            
            case CredentialType.MAGIC_LINK:
                return this.validateMagicLinkCredential(credential);
            
            case CredentialType.BIOMETRIC:
                return this.validateBiometricCredential(credential);
            
            default:
                throw new Error(`Unsupported credential type: ${credential.credentialType}`);
        }
    }

    /**
     * Validates password-based credentials.
     * Checks password hash and format.
     */
    private validatePasswordCredential(credential: any): boolean {
        const config = this.config.password;
        // TODO: Implement password validation using config
        throw new Error('Not implemented');
    }

    /**
     * Validates OAuth credentials.
     * Checks token validity and expiration.
     */
    private validateOAuthCredential(credential: any): boolean {
        const config = this.getOAuthConfig(credential.provider);
        // TODO: Implement OAuth validation using config
        throw new Error('Not implemented');
    }

    /**
     * Validates phone-based credentials.
     * Checks verification codes and expiration.
     */
    private validatePhoneCredential(credential: any): boolean {
        const config = this.config.phone;
        // TODO: Implement phone validation using config
        throw new Error('Not implemented');
    }

    /**
     * Validates magic link credentials.
     * Checks link validity and expiration.
     */
    private validateMagicLinkCredential(credential: any): boolean {
        const config = this.config.magicLink;
        // TODO: Implement magic link validation using config
        throw new Error('Not implemented');
    }

    /**
     * Validates biometric credentials.
     * Checks biometric data validity.
     */
    private validateBiometricCredential(credential: any): boolean {
        const config = this.config.biometric;
        // TODO: Implement biometric validation using config
        throw new Error('Not implemented');
    }
} 