import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsBoolean } from 'class-validator';
import { LoginCredential } from './LoginCredential';
import { IsStandardLength } from '@my-app/shared/dist/decorators/validation';

/**
 * LoginProvider entity represents authentication methods available in the system.
 * 
 * Core Features:
 * - Unique code identifier for each provider
 * - Human-readable name for display
 * - Enable/disable functionality for system use
 * 
 * Relationships:
 * - One LoginProvider has many LoginCredentials (1:M)
 * - LoginCredentials are prevented from being orphaned (RESTRICT)
 * 
 * Examples:
 * - Email/Password: Basic authentication
 * - OAuth (Google, Apple): Third-party authentication
 * - Phone: SMS-based authentication
 * 
 * Constraints:
 * - Code must be unique
 * - Cannot be deleted if has active credentials
 * - Name must follow standard length
 */
@Entity()
export class LoginProvider {
    // Primary Key
    /** Unique identifier for the login provider */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    /** Unique code identifying the provider (e.g., 'google', 'apple') */
    @Column({ type: 'varchar', length: 30, unique: true })
    @IsString()
    @IsStandardLength('CODE')
    code!: string;

    /** Display name of the provider (e.g., 'Google', 'Apple') */
    @Column({ type: 'varchar', length: 30 })
    @IsString()
    @IsStandardLength('NAME')
    name!: string;

    // Optional Core Fields
    /** Flag indicating if the provider is enabled for use */
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled: boolean = true;

    // Relationship Fields
    /** Associated login credentials */
    @OneToMany(() => LoginCredential, credential => credential.loginProvider, {
        onDelete: 'RESTRICT'  // Prevent deletion if credentials exist
    })
    credentials: LoginCredential[] = [];

    // Timestamps
    /** Timestamp of when the provider was created */
    @CreateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt!: Date;

    /** Timestamp of when the provider was last modified */
    @UpdateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    modifiedAt!: Date;
} 