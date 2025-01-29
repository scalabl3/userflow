import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsString, IsBoolean, IsUUID, Length } from 'class-validator';
import { User } from './User';

/**
 * Organization entity represents a company or group in the system.
 * Each user belongs to an organization, and organizations can have multiple users.
 */
@Entity()
export class Organization {
    // Primary Key
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // Required Core Fields
    @Column({ type: 'varchar', length: 255, default: 'shadow', nullable: true })
    @IsString()
    @Length(1, 255)
    name!: string;

    @Column({ type: 'uuid' })
    @IsUUID()
    adminUser!: string;

    // Optional Core Fields
    @Column({ default: false })
    @IsBoolean()
    visible!: boolean;

    // Relationship Fields
    @OneToMany(() => User, user => user.organization)
    users!: User[];

    // Timestamps
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}
