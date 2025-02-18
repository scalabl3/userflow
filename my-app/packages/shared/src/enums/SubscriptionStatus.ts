/**
 * Represents the possible states of a subscription.
 */
export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    PAST_DUE = 'PAST_DUE',
    SUSPENDED = 'SUSPENDED',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
    TRIAL = 'TRIAL',
    FREE = 'FREE',
    FREE_PROMOTION = 'FREE_PROMOTION'
} 