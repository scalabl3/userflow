import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { BillingProviderType } from '@my-app/shared/dist/enums/BillingProviderType';
import { IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';

/**
 * BillingProvider entity represents a payment provider supported by the system.
 * Examples include Stripe, PayPal, Apple Pay, etc.
 * Each provider must have a unique name and can be enabled/disabled for system use.
 */
@Entity('billing_provider')
@Index(['name'], { unique: true })
export class BillingProvider {
    /** Unique identifier for the billing provider */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /** Unique name of the billing provider (e.g., 'Stripe', 'PayPal') */
    @Column({ 
        type: 'varchar',
        length: 255,
        unique: true 
    })
    @IsNotEmpty({ message: 'Provider name is required' })
    name!: string;

    /** Type of billing provider (e.g., STRIPE, PAYPAL, APPLE_PAY) */
    @Column({
        type: 'enum',
        enum: BillingProviderType
    })
    @IsEnum(BillingProviderType, { message: 'Invalid billing provider type' })
    type!: BillingProviderType;

    /** Flag indicating if the provider is enabled for system use */
    @Column({ 
        type: 'boolean',
        default: true
    })
    @IsBoolean()
    isEnabled!: boolean;

    /** Flag indicating if the provider is visible to users */
    @Column({ 
        type: 'boolean',
        default: true
    })
    @IsBoolean()
    visible!: boolean;

    /** Timestamp of when the provider was created */
    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    /** Timestamp of when the provider was last modified */
    @UpdateDateColumn({ type: 'datetime' })
    modifiedAt!: Date;
}
