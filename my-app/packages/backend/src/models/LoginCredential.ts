import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';
import { CredentialType, OAuthProvider } from '@my-app/shared';

@Entity()
@Index(['identifier', 'loginProviderId'], { unique: true })
@Index(['loginProviderId'])
@Index(['baseUserId'])
export class LoginCredential {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    identifier!: string;

    @Column('uuid')
    loginProviderId!: string;

    @ManyToOne(() => LoginProvider)
    @JoinColumn({ name: 'loginProviderId' })
    loginProvider!: LoginProvider;

    @Column('uuid', { nullable: true })
    baseUserId?: string;

    @ManyToOne(() => BaseUser, baseUser => baseUser.loginCredentials)
    @JoinColumn({ name: 'baseUserId' })
    baseUser?: BaseUser;

    @Column({
        type: 'varchar',
        enum: CredentialType
    })
    credentialType!: CredentialType;

    @Column({ default: true })
    isEnabled!: boolean;

    // Password-specific fields
    @Column({ nullable: true })
    passwordHash?: string;

    // OAuth-specific fields
    @Column({
        type: 'varchar',
        enum: OAuthProvider,
        nullable: true
    })
    provider?: OAuthProvider;

    @Column({ nullable: true })
    accessToken?: string;

    @Column({ type: 'datetime', nullable: true })
    accessTokenExpiresAt?: Date;

    @Column({ nullable: true })
    refreshToken?: string;

    @Column({ type: 'datetime', nullable: true })
    refreshTokenExpiresAt?: Date;

    @Column({ nullable: true })
    scope?: string;

    @Column({ type: 'simple-json', nullable: true })
    rawProfile?: Record<string, any>;

    // Apple-specific fields
    @Column({ nullable: true })
    identityToken?: string;

    @Column({ nullable: true })
    authorizationCode?: string;

    @Column({ nullable: true })
    realUserStatus?: string;

    @Column({ nullable: true })
    nonce?: string;

    // Timestamps
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    modifiedAt!: Date;
}
