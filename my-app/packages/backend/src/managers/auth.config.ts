import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';

/**
 * Configuration interfaces for authentication methods
 */

export interface OAuthProviderConfig {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope: string[];
    authUrl: string;
    tokenUrl: string;
}

export interface OAuthConfig {
    enabled: boolean;
    providers: {
        [key: string]: OAuthProviderConfig;
    };
}

export interface AppleAuthConfig {
    enabled: boolean;
    clientId: string;
    teamId: string;
    keyId: string;
    privateKey: string;
    redirectUri: string;
}

export interface PasswordAuthConfig {
    enabled: boolean;
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAttempts: number;
    lockoutDuration: number;
}

export interface PhoneAuthConfig {
    enabled: boolean;
    provider: string;
    accountSid: string;
    authToken: string;
    fromNumber: string;
    codeLength: number;
    codeExpiry: number;
    maxAttempts: number;
}

export interface MagicLinkConfig {
    enabled: boolean;
    tokenExpiry: number;
    maxAttempts: number;
    cooldownPeriod: number;
}

export interface BiometricConfig {
    enabled: boolean;
    allowedTypes: string[];
    maxAttempts: number;
}

export interface AuthConfig {
    oauth: OAuthConfig;
    apple: AppleAuthConfig;
    password: PasswordAuthConfig;
    phone: PhoneAuthConfig;
    magicLink: MagicLinkConfig;
    biometric: BiometricConfig;
}

/**
 * Configuration manager for authentication settings.
 * Handles loading, validation, and hot-reloading of configuration.
 */
class AuthConfigManager extends EventEmitter {
    private static instance: AuthConfigManager;
    private config: AuthConfig;
    private configPath: string;
    private watcher: fs.FSWatcher | null = null;

    private constructor() {
        super();
        this.configPath = path.resolve(__dirname, '../../../../../auth.config.json');
        this.config = this.loadConfig();
        this.startWatching();
    }

    public static getInstance(): AuthConfigManager {
        if (!AuthConfigManager.instance) {
            AuthConfigManager.instance = new AuthConfigManager();
        }
        return AuthConfigManager.instance;
    }

    /**
     * Get the current configuration
     */
    public getConfig(): AuthConfig {
        return { ...this.config };
    }

    /**
     * Update specific configuration settings
     * @param updates Partial configuration updates
     */
    public async updateConfig(updates: Partial<AuthConfig>): Promise<void> {
        // Merge updates with current config
        const newConfig = {
            ...this.config,
            ...updates,
            // Deep merge for oauth providers
            oauth: {
                ...this.config.oauth,
                ...updates.oauth,
                providers: {
                    ...this.config.oauth.providers,
                    ...(updates.oauth?.providers || {})
                }
            }
        };

        // Validate the new configuration
        this.validateConfig(newConfig);

        // Write to file
        await fs.promises.writeFile(
            this.configPath,
            JSON.stringify(newConfig, null, 4),
            'utf8'
        );

        // Update internal config
        this.config = newConfig;
        this.emit('configUpdated', this.config);
    }

    /**
     * Force reload the configuration from disk
     */
    public reloadConfig(): void {
        try {
            const newConfig = this.loadConfig();
            this.validateConfig(newConfig);
            this.config = newConfig;
            this.emit('configUpdated', this.config);
        } catch (error) {
            this.emit('error', error);
            throw error;
        }
    }

    /**
     * Start watching for configuration file changes
     */
    private startWatching(): void {
        if (this.watcher) {
            this.watcher.close();
        }

        this.watcher = fs.watch(this.configPath, (eventType) => {
            if (eventType === 'change') {
                try {
                    this.reloadConfig();
                } catch (error) {
                    this.emit('error', error);
                }
            }
        });

        this.watcher.on('error', (error) => {
            this.emit('error', error);
        });
    }

    private loadConfig(): AuthConfig {
        try {
            if (!fs.existsSync(this.configPath)) {
                throw new Error(
                    'Authentication configuration file not found. Please copy auth.config.json.example to auth.config.json and update the values.'
                );
            }

            const configFile = fs.readFileSync(this.configPath, 'utf8');
            let config: AuthConfig;

            try {
                config = JSON.parse(configFile);
            } catch (e) {
                throw new Error(
                    'Invalid JSON in auth.config.json. Please ensure the file contains valid JSON.'
                );
            }

            return config;
        } catch (error) {
            console.error(`Error loading authentication configuration from ${this.configPath}:`);
            console.error(error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

    private validateConfig(config: AuthConfig): void {
        const validationErrors: string[] = [];

        // Validate OAuth providers
        if (config.oauth.enabled) {
            for (const [provider, settings] of Object.entries(config.oauth.providers)) {
                if (settings.enabled && (!settings.clientId || !settings.clientSecret)) {
                    validationErrors.push(
                        `Missing required OAuth credentials for enabled provider: ${provider}`
                    );
                }
            }
        }

        // Validate Apple configuration
        if (config.apple.enabled && (!config.apple.teamId || !config.apple.keyId)) {
            validationErrors.push('Missing required Apple Sign In configuration');
        }

        // Validate phone configuration
        if (config.phone.enabled && (!config.phone.accountSid || !config.phone.authToken)) {
            validationErrors.push('Missing required phone authentication configuration');
        }

        // If any validation errors occurred, throw them all at once
        if (validationErrors.length > 0) {
            throw new Error(
                'Authentication configuration validation failed:\n' +
                validationErrors.map(err => `- ${err}`).join('\n')
            );
        }
    }

    /**
     * Clean up resources when shutting down
     */
    public dispose(): void {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
    }
}

// Export the configuration manager instance
export const authConfigManager = AuthConfigManager.getInstance();

// Export the current configuration
export const authConfig: AuthConfig = authConfigManager.getConfig(); 