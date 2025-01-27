import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { LoginProvider } from './LoginProvider';
import { BaseUser } from './BaseUser';

export enum CredentialType {
    PASSWORD = 'PASSWORD',
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN'
}

@Entity()
@Unique(['identifier', 'loginProviderId'])
export class LoginCredential {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    identifier!: string;

    @Column({ type: 'uuid' })
    loginProviderId!: string;

    @ManyToOne(() => LoginProvider)
    @JoinColumn({ name: 'loginProviderId' })
    loginProvider!: LoginProvider;

    @Column({ type: 'varchar', nullable: true })
    credentials?: string;

    @Column({ type: 'varchar' })
    credentialType!: CredentialType;

    @Column({ type: 'datetime', nullable: true })
    expiresAt?: Date;

    @Column({ default: true })
    isEnabled!: boolean;

    @Column({ type: 'uuid', nullable: true })
    baseUserId?: string;

    @ManyToOne(() => BaseUser, baseUser => baseUser.loginCredentials)
    @JoinColumn({ name: 'baseUserId' })
    baseUser?: BaseUser;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}
