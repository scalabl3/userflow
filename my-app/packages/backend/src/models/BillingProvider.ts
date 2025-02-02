import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsString, IsBoolean, Matches } from 'class-validator';

/**
 * BillingProvider entity represents a payment provider supported by the system.
 * This table is the source of truth for valid provider types.
 * 
 * Core Features:
 * - Provider type serves as unique identifier
 * - Visibility control for UI display
 * - Enable/disable functionality for system use
 * 
 * Valid Types (seeded in migration):
 * - STRIPE: Credit card processing
 * - PAYPAL: Digital wallet payments
 * - APPLE_PAY: Mobile payments
 * - GOOGLE_PAY: Mobile payments
 * 
 * Constraints:
 * - Type must be unique uppercase string
 * - Cannot be deleted if in use by billing accounts
 */
@Entity('billing_provider')
@Index(['type'], { unique: true })
export class BillingProvider {
    // Primary Key
    /** Unique identifier for the billing provider */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    /** Type identifier for the provider (e.g., 'STRIPE', 'PAYPAL') */
    @Column({
        type: 'varchar',
        length: 50,
        unique: true
    })
    @IsString()
    @Matches(/^[A-Z][A-Z0-9_]*$/, {
        message: 'Type must be uppercase letters, numbers, and underscores'
    })
    type!: string;

    // Optional Core Fields
    /** Flag indicating if the provider is enabled for system use */
    @Column({ 
        type: 'boolean',
        default: true
    })
    @IsBoolean()
    isEnabled: boolean = true;

    /** Flag indicating if the provider is visible to users */
    @Column({ 
        type: 'boolean',
        default: true
    })
    @IsBoolean()
    visible: boolean = true;

    // Timestamps
    /** Timestamp of when the provider was created */
    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    /** Timestamp of when the provider was last modified */
    @UpdateDateColumn({ type: 'datetime' })
    modifiedAt!: Date;
}
