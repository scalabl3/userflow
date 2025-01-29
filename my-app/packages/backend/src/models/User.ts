import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseUser } from './BaseUser';
import { Organization } from './Organization';
import { IsString, IsUUID, IsObject, IsOptional } from 'class-validator';

/**
 * User entity extends BaseUser with organization-specific properties.
 * Represents an end-user in the system with organization affiliation.
 */
@Entity()
export class User extends BaseUser {
    // Required Core Fields
    @Column({ type: 'varchar', unique: true })
    @IsString()
    username!: string;

    @Column({ type: 'varchar' })
    @IsString()
    displayname!: string;

    // Relationship Fields
    @Column({ type: 'uuid' })
    @IsUUID()
    organizationId!: string;

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'organizationId' })
    organization!: Organization;

    // Optional Fields
    @Column('simple-json', { nullable: true })
    @IsObject()
    @IsOptional()
    preferences?: {
        theme?: 'light' | 'dark';
        notifications?: {
            email?: boolean;
            push?: boolean;
        };
    };

    /**
     * Sets default preferences if none are set
     */
    setDefaultPreferences() {
        if (!this.preferences) {
            this.preferences = {
                theme: 'light',
                notifications: {
                    email: true,
                    push: true
                }
            };
        }
    }
}
