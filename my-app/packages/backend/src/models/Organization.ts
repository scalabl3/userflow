import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsBoolean, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { User } from './User';
import { getModelRelationConfig } from '../migrations/helpers';
import { IsStandardLength } from '@my-app/shared';
import { SubscriptionStatus } from '@my-app/shared';

/**
 * Organization entity represents a company or group in the system.
 * 
 * Core Features:
 * - Unique identifier
 * - Organization details (name, contact info)
 * - Subscription and billing status
 * - Soft deletion support
 * 
 * Relationships:
 * - One Organization has many Users (1:M)
 * - Users are prevented from being orphaned (RESTRICT)
 * 
 * Examples:
 * - Small Business: "Tech Startup LLC"
 * - Enterprise: "Global Corp Industries"
 * - Non-profit: "Community Foundation"
 * 
 * Constraints:
 * - Name must be unique
 * - Cannot be deleted with active users
 * - Must maintain valid contact info
 * 
 * Soft Deletion:
 * - Uses deleted flag and deletedAt timestamp
 * - Maintains referential integrity
 * - Allows organization recovery if needed
 */
@Entity()
export class Organization {
    // Primary Key
    /** Unique identifier for the organization */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    /** Organization name (defaults to 'shadow' for initial creation) */
    @Column({ type: 'varchar', length: 50, default: 'shadow', nullable: true })
    @IsString()
    @IsStandardLength('NAME')
    name!: string;

    // Admin User Relationship (1:1)
    /** ID of the organization's admin user */
    @Column(getModelRelationConfig(true, 'RESTRICT').columnOptions)
    @IsUUID()
    adminUserId!: string;

    /** The organization's admin user */
    @OneToOne(() => User, getModelRelationConfig(true, 'RESTRICT').relationOptions)
    @JoinColumn({ name: 'adminUserId' })
    adminUser!: User;

    // Optional Core Fields
    /** Flag indicating if the organization is visible in listings */
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    visible: boolean = false;

    // Stripe Integration Fields
    /** Stripe customer ID for payment processing */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('IDENTIFIER')
    stripeCustomerId?: string;

    /** Organization's subscription status */
    @Column({ 
        type: 'varchar',
        enum: SubscriptionStatus,
        enumName: 'subscription_status',
        nullable: true 
    })
    @IsEnum(SubscriptionStatus)
    @IsOptional()
    subscriptionStatus?: SubscriptionStatus;

    // User Relationship (1:M)
    /** Users belonging to this organization */
    @OneToMany(() => User, user => user.organization)
    users: User[] = [];

    // Timestamps
    /** Timestamp of when the organization was created */
    @CreateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt!: Date;

    /** Timestamp of when the organization was last modified */
    @UpdateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    modifiedAt!: Date;

    /** Flag indicating if the organization has been soft deleted */
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    deleted: boolean = false;

    /** Timestamp of when the organization was soft deleted */
    @DeleteDateColumn({ 
        type: 'datetime',
        nullable: true
    })
    deletedAt?: Date;
}
