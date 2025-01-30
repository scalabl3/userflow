import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { IsString, IsBoolean, IsUUID, Length } from 'class-validator';
import { User } from './User';
import { getModelRelationConfig } from '../migrations/helpers';

/**
 * Organization entity represents a company or group in the system.
 * 
 * Relationships:
 * - One Organization has many Users (1:M)
 * - One Organization has exactly one admin User (1:1)
 * - Admin User relationship is required and protected from deletion (RESTRICT)
 * - If Organization is deleted, associated Users become unaffiliated (SET NULL)
 * 
 * Constraints:
 * - Name must be unique when visible is true
 * - Must have exactly one admin user
 * - Cannot be deleted if it has active users
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

    // Admin User Relationship (1:1)
    @Column(getModelRelationConfig(true, 'RESTRICT').columnOptions)
    @IsUUID()
    adminUserId!: string;

    @OneToOne(() => User, getModelRelationConfig(true, 'RESTRICT').relationOptions)
    @JoinColumn({ name: 'adminUserId' })
    adminUser!: User;

    // Optional Core Fields
    @Column({ default: false })
    @IsBoolean()
    visible!: boolean;

    // User Relationship (1:M)
    @OneToMany(() => User, user => user.organization)
    users!: User[];

    // Timestamps
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    modifiedAt!: Date;
}
