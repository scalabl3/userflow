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
import { getModelRelationConfig, getEnumColumn } from '../migrations/helpers';

/**
 * Represents OAuth-specific profile data
 */
class OAuthProfile {
    @IsObject()
    @IsOptional()
    rawData?: Record<string, any>;

    @IsString()
    @IsOptional()
    scope?: string;
}

/**
 * LoginCredential entity represents authentication methods for users.
 * 
 * Relationships:
 * - Many LoginCredentials belong to one LoginProvider (M:1)
 * - Many LoginCredentials belong to one BaseUser (M:1)
 * - Both relationships are required and protected from deletion (RESTRICT)
 * 
 * Supports:
 * - Password-based authentication (passwordHash)
 * - OAuth-based authentication (provider, tokens, profile)
 * - Apple-specific OAuth fields
 */
@Entity()
@Index(['identifier', 'loginProviderId'], { unique: true })
@Index(['loginProviderId'])
@Index(['baseUserId'])
export class LoginCredential {
    // Primary Key
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    @Column()
    @IsString()
    identifier!: string;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
    loginProviderId!: string;

    @Column({ 
        type: 'varchar',
        enum: CredentialType,
        enumName: 'credential_type'
    })
    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    // Optional Core Fields
    @Column({ default: true })
    @IsBoolean()
    isEnabled!: boolean;

    // Relationship Fields
    @ManyToOne(() => LoginProvider, getModelRelationConfig(true, 'RESTRICT').relationOptions)
    @JoinColumn({ name: 'loginProviderId' })
    loginProvider!: LoginProvider;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
    baseUserId!: string;

    @ManyToOne(() => BaseUser, baseUser => baseUser.loginCredentials, getModelRelationConfig(true, 'RESTRICT').relationOptions)
    @JoinColumn({ name: 'baseUserId' })
    baseUser!: BaseUser;

    // Password-specific Fields
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    passwordHash?: string;

    // OAuth-specific Fields
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

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    accessToken?: string;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ type: 'datetime', nullable: true })
    @IsDate()
    @IsOptional()
    accessTokenExpiresAt?: Date;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    refreshToken?: string;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ type: 'datetime', nullable: true })
    @IsDate()
    @IsOptional()
    refreshTokenExpiresAt?: Date;

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
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    identityToken?: string;

    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    authorizationCode?: string;

    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    realUserStatus?: string;

    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    nonce?: string;

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
