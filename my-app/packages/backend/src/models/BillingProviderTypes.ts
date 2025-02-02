import { DataSource } from 'typeorm';
import { BillingProvider } from './BillingProvider';

/**
 * Information about a billing provider from cache
 */
export interface BillingProviderInfo {
    type: string;
    isEnabled: boolean;
    visible: boolean;
}

/**
 * Utility class for managing BillingProvider types.
 * Implements a singleton pattern with caching for fast access to valid provider types.
 * 
 * Usage:
 * ```typescript
 * // Initialize cache
 * await BillingProviderTypes.getInstance().load(dataSource);
 * 
 * // Check if valid
 * if (BillingProviderTypes.getInstance().isValid('STRIPE')) {
 *     // Process payment...
 * }
 * 
 * // Get all providers
 * const providers = BillingProviderTypes.getInstance().getAll();
 * ```
 */
export class BillingProviderTypes {
    private static instance: BillingProviderTypes | null = null;
    private types: Map<string, BillingProviderInfo> = new Map();
    private lastLoaded: Date | null = null;

    private constructor() {}

    /**
     * Gets the singleton instance
     */
    static getInstance(): BillingProviderTypes {
        if (!this.instance) {
            this.instance = new BillingProviderTypes();
        }
        return this.instance;
    }

    /**
     * Loads or refreshes the provider types from database
     */
    async load(dataSource: DataSource): Promise<void> {
        const providers = await dataSource
            .getRepository(BillingProvider)
            .find({
                select: ['type', 'isEnabled', 'visible']
            });
        
        this.types.clear();
        providers.forEach(p => {
            this.types.set(p.type, {
                type: p.type,
                isEnabled: p.isEnabled,
                visible: p.visible
            });
        });
        
        this.lastLoaded = new Date();
    }

    /**
     * Checks if a provider type is valid
     */
    isValid(type: string): boolean {
        return this.types.has(type);
    }

    /**
     * Checks if a provider is enabled
     */
    isEnabled(type: string): boolean {
        return this.types.get(type)?.isEnabled ?? false;
    }

    /**
     * Gets all provider types
     */
    getAll(): BillingProviderInfo[] {
        return Array.from(this.types.values());
    }

    /**
     * Gets only visible provider types
     */
    getVisible(): BillingProviderInfo[] {
        return this.getAll().filter(p => p.visible);
    }

    /**
     * Gets only enabled provider types
     */
    getEnabled(): BillingProviderInfo[] {
        return this.getAll().filter(p => p.isEnabled);
    }

    /**
     * Checks if cache needs reload based on age
     */
    needsReload(maxAge: number = 3600000): boolean {  // Default 1 hour
        if (!this.lastLoaded) return true;
        return Date.now() - this.lastLoaded.getTime() > maxAge;
    }

    /**
     * Forces cache invalidation
     */
    invalidateCache(): void {
        this.lastLoaded = null;
    }

    /**
     * Gets the last time the cache was loaded
     */
    getLastLoaded(): Date | null {
        return this.lastLoaded;
    }

    /**
     * For testing only: Clears the singleton instance
     */
    static clearInstance(): void {
        this.instance = null;
    }
} 