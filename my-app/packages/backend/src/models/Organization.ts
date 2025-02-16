import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsBoolean, IsUUID, IsOptional } from 'class-validator';
import { User } from './User';
import { getModelRelationConfig } from '../migrations/helpers';
import { IsStandardLength } from '@my-app/shared/dist/decorators/validation';

/**
 * Organization entity represents a company or group in the system.
 * 
 * Core Features:
 * - Unique organization name
 * - Admin user management
 * - Visibility control
 * 
 * Relationships:
 * - One Organization has many Users (1:M)
 * - One Organization has exactly one admin User (1:1)
 * - Admin User relationship is required and protected (RESTRICT)
 * - Users become unaffiliated on org deletion (SET NULL)
 * 
 * States:
 * - Shadow: Initial state with default name
 * - Visible: Organization appears in listings
 * - Hidden: Organization exists but isn't listed
 * 
 * Constraints:
 * - Name must be unique when visible
 * - Must have exactly one admin user
 * - Cannot be deleted with active users
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
    @Column({ type: 'varchar', length: 50, nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('CODE')
    subscriptionStatus?: string;  // 'active', 'past_due', 'canceled', etc.

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
}
