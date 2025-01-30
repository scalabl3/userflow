import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseUser } from './BaseUser';
import { Organization } from './Organization';
import { IsString, IsUUID, IsObject, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { getModelRelationConfig } from '../migrations/helpers';

/**
 * Represents user notification preferences
 */
class NotificationPreferences {
    @IsBoolean()
    @IsOptional()
    email?: boolean = true;

    @IsBoolean()
    @IsOptional()
    push?: boolean = true;
}

/**
 * Represents all user preferences
 */
class UserPreferences {
    @IsString()
    @IsOptional()
    theme?: 'light' | 'dark' = 'light';

    @ValidateNested()
    @Type(() => NotificationPreferences)
    @IsOptional()
    notifications?: NotificationPreferences = new NotificationPreferences();
}

/**
 * User entity extends BaseUser with organization-specific properties.
 * Represents an end-user in the system with organization affiliation.
 * 
 * Relationships:
 * - Many Users belong to one Organization (M:1)
 * - Organization relationship is required
 * - If Organization is deleted, associated Users are prevented from being orphaned (RESTRICT)
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
    @Column(getModelRelationConfig(true).columnOptions)
    @IsUUID()
    organizationId!: string;

    @ManyToOne(() => Organization, getModelRelationConfig(true).relationOptions)
    @JoinColumn({ name: 'organizationId' })
    organization!: Organization;

    // Optional Fields
    @Column({ 
        type: 'simple-json', 
        nullable: true,
        default: {
            theme: 'light',
            notifications: {
                email: true,
                push: true
            }
        }
    })
    @IsObject()
    @ValidateNested()
    @Type(() => UserPreferences)
    @IsOptional()
    preferences?: UserPreferences;

    /**
     * Sets default preferences if none are set
     */
    setDefaultPreferences() {
        if (!this.preferences) {
            this.preferences = new UserPreferences();
        }
    }
}
