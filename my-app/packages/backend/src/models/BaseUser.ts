import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { LoginCredential } from './LoginCredential';

export enum UserState {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    DEACTIVATED = 'DEACTIVATED'
}

@Entity()
export class BaseUser {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    firstname!: string;

    @Column({ type: 'varchar' })
    lastname!: string;

    @Column({ type: 'varchar', unique: true })
    contactEmail!: string;

    @Column({
        type: 'varchar',
        enum: UserState,
        default: UserState.PENDING
    })
    state!: UserState;

    @Column({ type: 'uuid', nullable: true })
    primaryLoginCredentialId?: string;

    @ManyToOne(() => LoginCredential, { nullable: true })
    @JoinColumn({ name: 'primaryLoginCredentialId' })
    primaryLoginCredential?: LoginCredential;

    @OneToMany(() => LoginCredential, credential => credential.baseUser)
    loginCredentials!: LoginCredential[];

    @Column({ type: 'datetime', nullable: true })
    lastLoginAt?: Date;

    @Column({ type: 'boolean', default: true })
    isEnabled!: boolean;

    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}
