import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';
import { CredentialType, OAuthProvider } from '@my-app/shared/dist/enums/CredentialType';
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
 * LoginCredential entity represents authentication methods for users.
 * 
 * Core Features:
 * - Flexible authentication methods (password/OAuth)
 * - Provider-specific data storage
 * - Security token management
 * 
 * Relationships:
 * - Many LoginCredentials belong to one LoginProvider (M:1)
 * - Many LoginCredentials belong to one BaseUser (M:1)
 * - Both relationships are required and protected (RESTRICT)
 * 
 * Authentication Types:
 * - Password: Basic email/password authentication
 * - OAuth: Third-party authentication (Google, Apple)
 * - Provider-specific: Apple Sign In with extra fields
 * 
 * Constraints:
 * - Unique identifier per provider
 * - Required relationship to provider and user
 * - Type-specific field validation
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
    /** Identifier used for authentication (email, phone, etc.) */
    @Column()
    @IsString()
    @IsStandardLength('IDENTIFIER')
    identifier!: string;

    /** Type of credential (password/OAuth) */
    @Column({ 
        type: 'varchar',
        enum: CredentialType,
        enumName: 'credential_type'
    })
    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    // Optional Core Fields
    /** Flag indicating if the credential is enabled */
    @Column({ default: true })
    @IsBoolean()
    isEnabled: boolean = true;

    // Relationship Fields
    /** ID of the associated login provider */
    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
    loginProviderId!: string;

    /** Associated login provider */
    @ManyToOne(() => LoginProvider, getModelRelationConfig(true, 'RESTRICT').relationOptions)
    @JoinColumn({ name: 'loginProviderId' })
    loginProvider!: LoginProvider;

    /** ID of the associated base user */
    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
    baseUserId!: string;

    /** Associated base user */
    @ManyToOne(() => BaseUser, baseUser => baseUser.loginCredentials, getModelRelationConfig(true, 'RESTRICT').relationOptions)
    @JoinColumn({ name: 'baseUserId' })
    baseUser!: BaseUser;

    // Password-specific Fields
    /** Hashed password for password-based authentication */
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('PASSWORD_HASH')
    passwordHash?: string;

    // OAuth-specific Fields
    /** OAuth provider type (Google, Apple, etc.) */
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ 
        type: 'varchar',
        enum: OAuthProvider,
        enumName: 'oauth_provider',
        nullable: true 
    })
    @IsEnum(OAuthProvider)
    @IsOptional()
    provider?: OAuthProvider;

    /** OAuth access token */
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('TOKEN')
    accessToken?: string;

    /** OAuth access token expiration */
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ type: 'datetime', nullable: true })
    @IsDate()
    @IsOptional()
    accessTokenExpiresAt?: Date;

    /** OAuth refresh token */
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('TOKEN')
    refreshToken?: string;

    /** OAuth refresh token expiration */
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ type: 'datetime', nullable: true })
    @IsDate()
    @IsOptional()
    refreshTokenExpiresAt?: Date;

    /** OAuth profile data */
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ 
        type: 'simple-json', 
        nullable: true,
        default: {
            scope: '',
            rawData: {}
        }
    })
    @IsObject()
    @ValidateNested()
    @Type(() => OAuthProfile)
    @IsOptional()
    profile?: OAuthProfile;

    // Apple-specific Fields
    /** Apple identity token */
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('TOKEN')
    identityToken?: string;

    /** Apple authorization code */
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('AUTH_CODE')
    authorizationCode?: string;

    /** Apple real user status */
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('REAL_USER_STATUS')
    realUserStatus?: string;

    /** Apple nonce for token verification */
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    @IsStandardLength('NONCE')
    nonce?: string;

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
}
