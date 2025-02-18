import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';
import { CredentialType } from '../managers/AuthenticationManager';
import { OAuthProvider } from '@my-app/shared/dist/enums/CredentialType';
import { 
    IsString, 
    IsUUID, 
    IsEnum, 
    IsOptional, 
    IsBoolean, 
    IsDate, 
    IsObject, 
    ValidateIf,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { getModelRelationConfig } from '../migrations/helpers';
import { IsStandardLength } from '@my-app/shared/dist/decorators/validation';

/**
 * Represents OAuth-specific profile data
 */
class OAuthProfile {
    /** Raw profile data from the OAuth provider */
    @IsObject()
    @IsOptional()
    rawData?: Record<string, any>;

    /** OAuth scope string */
    @IsString()
    @IsOptional()
    scope?: string;
}

/**
 * LoginCredential entity represents user authentication credentials.
 * 
 * Core Features:
 * - Unique identifier for each credential
 * - Credential type (password, OAuth, etc.)
 * - Provider-specific details
 * - Soft deletion support
 * 
 * Relationships:
 * - Belongs to BaseUser (M:1)
 * 
 * Examples:
 * - Password: Email + hashed password
 * - OAuth: Provider token + refresh token
 * - Phone: Verified phone number
 * 
 * Constraints:
 * - Unique (identifier, loginProviderId) pair
 * - Cannot be orphaned (user required)
 * - Must have valid credential type
 */
@Entity()
@Index(['identifier', 'loginProviderId'], { unique: true })
@Index(['loginProviderId'])
@Index(['baseUserId'])
export class LoginCredential {
    // Primary Key
    /** Unique identifier for the credential */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    /** User identifier (email, phone, OAuth ID) */
    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @IsStandardLength('IDENTIFIER')
    identifier!: string;

    /** Type of credential (PASSWORD, OAUTH, etc.) */
    @Column({ 
        type: 'varchar',
        enum: CredentialType,
        enumName: 'credential_type'
    })
    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    /** Provider code for this credential */
    @Column({ type: 'varchar', length: 30 })
    @IsString()
    @IsStandardLength('CODE')
    providerCode!: string;

    // Optional Core Fields
    /** Flag indicating if the credential is enabled */
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled: boolean = true;

    /** Flag indicating if the credential has been soft deleted */
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    deleted: boolean = false;

    // Type-Specific Fields
    /** Hashed password for PASSWORD type */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('PASSWORD_HASH')
    passwordHash?: string;

    /** OAuth access token */
    @Column({ type: 'varchar', length: 2048, nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('TOKEN')
    accessToken?: string;

    /** OAuth refresh token */
    @Column({ type: 'varchar', length: 2048, nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('TOKEN')
    refreshToken?: string;

    /** OAuth access token expiration */
    @Column({ type: 'datetime', nullable: true })
    @IsDate()
    @IsOptional()
    accessTokenExpiresAt?: Date;

    /** OAuth refresh token expiration */
    @Column({ type: 'datetime', nullable: true })
    @IsDate()
    @IsOptional()
    refreshTokenExpiresAt?: Date;

    // Relationship Fields
    /** ID of the user this credential belongs to */
    @Column(getModelRelationConfig(true, 'CASCADE').columnOptions)
    @IsUUID()
    baseUserId!: string;

    /** The user this credential belongs to */
    @ManyToOne(() => BaseUser, user => user.loginCredentials, getModelRelationConfig(true, 'CASCADE').relationOptions)
    @JoinColumn({ name: 'baseUserId' })
    baseUser!: BaseUser;

    // Timestamps
    /** Timestamp of when the credential was created */
    @CreateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt!: Date;

    /** Timestamp of when the credential was last modified */
    @UpdateDateColumn({ 
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    modifiedAt!: Date;

    /** Timestamp of when the credential was soft deleted */
    @DeleteDateColumn({ 
        type: 'datetime',
        nullable: true
    })
    deletedAt?: Date;
}
