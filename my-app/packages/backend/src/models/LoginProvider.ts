import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsBoolean, Length } from 'class-validator';
import { LoginCredential } from './LoginCredential';

/**
 * LoginProvider entity represents authentication methods available in the system.
 * Examples include email, Google, phone, etc.
 */
@Entity()
export class LoginProvider {
    // Primary Key
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    @Column({ type: 'varchar', unique: true })
    @IsString()
    @Length(1, 50)
    code!: string;

    @Column({ type: 'varchar' })
    @IsString()
    @Length(1, 255)
    name!: string;

    // Optional Core Fields
    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled!: boolean;

    // Relationship Fields
    @OneToMany(() => LoginCredential, credential => credential.loginProvider)
    credentials!: LoginCredential[];

    // Timestamps
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
} 