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
    ValidateIf 
} from 'class-validator';

/**
 * LoginCredential entity represents authentication methods for users.
 * Supports both password-based and OAuth-based authentication.
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

    @Column('uuid')
    @IsUUID()
    loginProviderId!: string;

    @Column({
        type: 'varchar',
        enum: CredentialType
    })
    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    // Optional Core Fields
    @Column({ default: true })
    @IsBoolean()
    isEnabled!: boolean;

    // Relationship Fields
    @ManyToOne(() => LoginProvider)
    @JoinColumn({ name: 'loginProviderId' })
    loginProvider!: LoginProvider;

    @Column('uuid', { nullable: true })
    @IsUUID()
    @IsOptional()
    baseUserId?: string;

    @ManyToOne(() => BaseUser, baseUser => baseUser.loginCredentials)
    @JoinColumn({ name: 'baseUserId' })
    baseUser?: BaseUser;

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
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    scope?: string;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @Column({ type: 'simple-json', nullable: true })
    @IsObject()
    @IsOptional()
    rawProfile?: Record<string, any>;

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
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    modifiedAt!: Date;
}
