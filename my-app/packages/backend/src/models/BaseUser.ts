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
import { IsString, IsEmail, IsEnum, IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { UserState } from '@my-app/shared/dist/enums/UserState';

/**
 * Base user entity that contains common user properties.
 * Extended by specific user types like User.
 */
@Entity()
export class BaseUser {
    // Primary Key
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    @Column({ type: 'varchar' })
    @IsString()
    firstname!: string;

    @Column({ type: 'varchar' })
    @IsString()
    lastname!: string;

    @Column({ type: 'varchar', unique: true })
    @IsEmail()
    contactEmail!: string;

    @Column({
        type: 'varchar',
        enum: UserState,
        default: UserState.PENDING
    })
    @IsEnum(UserState)
    state!: UserState;

    // Optional Core Fields
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled!: boolean;

    // Relationship Fields
    @Column({ type: 'uuid', nullable: true })
    @IsUUID()
    @IsOptional()
    primaryLoginCredentialId?: string;

    @ManyToOne(() => LoginCredential, { nullable: true })
    @JoinColumn({ name: 'primaryLoginCredentialId' })
    primaryLoginCredential?: LoginCredential;

    @OneToMany(() => LoginCredential, credential => credential.baseUser)
    loginCredentials!: LoginCredential[];

    // Optional Fields
    @Column({ type: 'datetime', nullable: true })
    lastLoginAt?: Date;

    // Timestamps
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}
