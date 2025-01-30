import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { LoginCredential } from './LoginCredential';
import { IsString, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { UserState } from '@my-app/shared/dist/enums/UserState';
import { IsStandardLength, IsStandardName } from '@my-app/shared/dist/decorators/validation';

/**
 * BaseUser entity represents the core user identity in the system.
 * It contains essential user information and manages authentication state.
 * 
 * Key features:
 * - Core identity separate from authentication methods
 * - Supports multiple login credentials per user
 * - State management for user lifecycle
 * - Unique contact email for notifications and login
 * 
 * Relationships:
 * - One-to-Many with LoginCredential (baseUser -> loginCredentials)
 * - Each LoginCredential must belong to exactly one BaseUser
 * - Multiple credentials allowed, but unique per provider
 * 
 * Constraints:
 * - contactEmail must be unique
 * - Must have valid state from enum
 * - Cannot be deleted if has active LoginCredentials
 */
@Entity()
export class BaseUser {
    // Primary Key
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    @Column({ type: 'varchar' })
    @IsString()
    @IsStandardName('NAME')
    firstname!: string;

    @Column({ type: 'varchar' })
    @IsString()
    @IsStandardName('NAME')
    lastname!: string;

    @Column({ type: 'varchar', unique: true })
    @IsEmail()
    @IsStandardLength('EMAIL')
    contactEmail!: string;

    @Column({
        type: 'varchar',
        enum: UserState,
        default: UserState.PENDING
    })
    @IsEnum(UserState)
    state!: UserState;

    // Optional Core Fields
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled!: boolean;

    // Relationship Fields
    @OneToMany(() => LoginCredential, credential => credential.baseUser)
    loginCredentials!: LoginCredential[];

    // Optional Fields
    @Column({ type: 'datetime', nullable: true })
    lastLoginAt?: Date;

    // Timestamps
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}
