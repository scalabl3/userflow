import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
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
    ValidateNested,
    IsJWT
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
 * - Credential type (PASSWORD, OAUTH_*, etc.)
 * - Provider-specific details
 * - Soft deletion support
 * 
 * Field Groups:
 * 1. Core Fields
 *    - id: Primary key
 *    - identifier: User identifier (email/phone)
 *    - credentialType: Authentication method type
 *    - isEnabled: Activation status
 * 
 * 2. Password Authentication
 *    - passwordHash: Hashed password storage
 * 
 * 3. OAuth Authentication
 *    - accessToken: OAuth access token
 *    - refreshToken: OAuth refresh token
 *    - accessTokenExpiresAt: Access token expiration
 *    - refreshTokenExpiresAt: Refresh token expiration
 * 
 * 4. Apple Sign In
 *    - identityToken: Apple JWT identity token
 *    - authorizationCode: Apple authorization code
 *    - realUserStatus: Apple's user validation status
 *    - nonce: Security nonce for validation
 * 
 * 5. Relationships
 *    - baseUserId: Foreign key to base_user
 *    - baseUser: BaseUser relationship
 * 
 * 6. Timestamps
 *    - createdAt: Creation timestamp
 *    - modifiedAt: Last modification timestamp
 *    - deleted: Soft deletion flag
 *    - deletedAt: Soft deletion timestamp
 * 
 * Constraints:
 * - Unique (identifier, credentialType) pair
 * - Cannot be orphaned (user required)
 * - Must have valid credential type
 * - Type-specific field validation
 * 
 * Examples:
 * - Password: Email + hashed password
 * - OAuth: Provider token + refresh token
 * - Apple: Identity token + authorization code
 */
@Entity()
@Index(['identifier', 'credentialType'], { unique: true })
@Index(['baseUserId'])
export class LoginCredential {
    // ----------------
    // Core Fields
    // ----------------
    /** Unique identifier for the credential */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /** User identifier (email, phone, OAuth ID) */
    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @IsStandardLength('IDENTIFIER')
    identifier!: string;

    /** Type of credential (PASSWORD, OAUTH_GOOGLE, etc.) */
    @Column({ 
        type: 'varchar',
        enum: CredentialType,
        enumName: 'credential_type'
    })
    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    /** Flag indicating if the credential is enabled */
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled: boolean = true;

    // ----------------
    // Password Authentication
    // ----------------
    /** Hashed password for PASSWORD type */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('PASSWORD_HASH')
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    passwordHash?: string;

    // ----------------
    // OAuth Authentication
    // ----------------
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

    // ----------------
    // Apple Sign In
    // ----------------
    /** Apple identity token (JWT) */
    @Column({ type: 'varchar', length: 2048, nullable: true })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_APPLE)
    @IsJWT()
    @IsOptional()
    @IsStandardLength('TOKEN')
    identityToken?: string;

    /** Apple authorization code */
    @Column({ type: 'varchar', length: 255, nullable: true })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_APPLE)
    @IsString()
    @IsOptional()
    @IsStandardLength('AUTH_CODE')
    authorizationCode?: string;

    /** Apple's real user status */
    @Column({ type: 'varchar', length: 50, nullable: true })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_APPLE)
    @IsString()
    @IsOptional()
    @IsStandardLength('REAL_USER_STATUS')
    realUserStatus?: string;

    /** Nonce used for Apple token verification */
    @Column({ type: 'varchar', length: 100, nullable: true })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_APPLE)
    @IsString()
    @IsOptional()
    @IsStandardLength('NONCE')
    nonce?: string;

    // ----------------
    // Relationships
    // ----------------
    /** ID of the user this credential belongs to */
    @Column(getModelRelationConfig(true, 'CASCADE').columnOptions)
    @IsUUID()
    baseUserId!: string;

    /** The user this credential belongs to */
    @ManyToOne(() => BaseUser, user => user.loginCredentials, getModelRelationConfig(true, 'CASCADE').relationOptions)
    @JoinColumn({ name: 'base_user_id' })
    baseUser!: BaseUser;

    // ----------------
    // Timestamps
    // ----------------
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

    /** Flag indicating if the credential has been soft deleted */
    @Column({ type: 'boolean', default: false })
    @IsBoolean()
    deleted: boolean = false;

    /** Timestamp of when the credential was soft deleted */
    @DeleteDateColumn({ 
        type: 'datetime',
        nullable: true
    })
    deletedAt?: Date;
}
