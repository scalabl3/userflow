import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsBoolean, Length } from 'class-validator';
import { LoginCredential } from './LoginCredential';

/**
 * LoginProvider entity represents authentication methods available in the system.
 * 
 * Relationships:
 * - One LoginProvider has many LoginCredentials (1:M)
 * - LoginCredentials are prevented from being orphaned (RESTRICT)
 * 
 * Core Features:
 * - Unique code identifier for each provider (e.g., 'google', 'apple')
 * - Human-readable name for display
 * - Can be disabled to temporarily prevent new logins
 * 
 * Examples:
 * - Email/Password
 * - OAuth providers (Google, Apple, etc.)
 * - Phone number
 */
@Entity()
export class LoginProvider {
    // Primary Key
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    @Column({ type: 'varchar', length: 50, unique: true })
    @IsString()
    @Length(1, 50)
    code!: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @Length(1, 255)
    name!: string;

    // Optional Core Fields
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled!: boolean;

    // Relationship Fields
    @OneToMany(() => LoginCredential, credential => credential.loginProvider, {
        onDelete: 'RESTRICT'  // Prevent deletion if credentials exist
    })
    credentials!: LoginCredential[];

    // Timestamps
    @CreateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt!: Date;

    @UpdateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    modifiedAt!: Date;
} 