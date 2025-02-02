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
 * 
 * Core Features:
 * - Core identity management
 * - Multiple authentication methods
 * - State and lifecycle control
 * - Contact management
 * 
 * Relationships:
 * - One BaseUser has many LoginCredentials (1:M)
 * - Each LoginCredential belongs to one BaseUser
 * - Multiple credentials per provider not allowed
 * 
 * States:
 * - PENDING: Initial state after creation
 * - ACTIVE: Normal operating state
 * - SUSPENDED: Temporarily disabled
 * - DEACTIVATED: Permanently disabled
 * 
 * Constraints:
 * - Contact email must be unique
 * - Must have valid state
 * - Cannot be deleted with active credentials
 */
@Entity()
export class BaseUser {
    // Primary Key
    /** Unique identifier for the user */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    /** User's first name */
    @Column({ type: 'varchar' })
    @IsString()
    @IsStandardName('NAME')
    firstname!: string;

    /** User's last name */
    @Column({ type: 'varchar' })
    @IsString()
    @IsStandardName('NAME')
    lastname!: string;

    /** User's contact email (unique) */
    @Column({ type: 'varchar', unique: true })
    @IsEmail()
    @IsStandardLength('EMAIL')
    contactEmail!: string;

    /** User's current state */
    @Column({
        type: 'varchar',
        enum: UserState,
        default: UserState.PENDING
    })
    @IsEnum(UserState)
    state: UserState = UserState.PENDING;

    // Optional Core Fields
    /** Flag indicating if the user is enabled */
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled: boolean = true;

    // Relationship Fields
    /** User's login credentials */
    @OneToMany(() => LoginCredential, credential => credential.baseUser)
    loginCredentials: LoginCredential[] = [];

    // Optional Fields
    /** Timestamp of user's last login */
    @Column({ 
        type: 'datetime', 
        nullable: true,
        default: null
    })
    lastLoginAt?: Date;

    // Timestamps
    /** Timestamp of when the user was created */
    @CreateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt!: Date;

    /** Timestamp of when the user was last modified */
    @UpdateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    modifiedAt!: Date;
}
