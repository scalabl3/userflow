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
import { UserState } from '@my-app/shared/dist/enums/UserState';

@Entity()
export class BaseUser {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    firstname!: string;

    @Column({ type: 'varchar' })
    lastname!: string;

    @Column({ type: 'varchar' })
    displayname!: string;

    @Column({ type: 'varchar', unique: true })
    contactEmail!: string;

    @Column({
        type: 'varchar',
        enum: UserState,
        default: UserState.PENDING,
    })
    state!: UserState;

    @Column({ type: 'uuid', nullable: true })
    primaryLoginCredentialId?: string;

    @ManyToOne(() => LoginCredential, { nullable: true, onDelete: 'SET NULL' })
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
