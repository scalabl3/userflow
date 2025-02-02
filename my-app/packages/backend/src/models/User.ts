import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseUser } from './BaseUser';
import { Organization } from './Organization';
import { IsString, IsUUID, IsObject, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { getModelRelationConfig } from '../migrations/helpers';
import { IsStandardLength, IsStandardName } from '@my-app/shared/dist/decorators/validation';

/**
 * User preferences for notifications
 */
export class NotificationPreferences {
    /** Flag for email notifications */
    @IsBoolean()
    @IsOptional()
    email: boolean = true;

    /** Flag for push notifications */
    @IsBoolean()
    @IsOptional()
    push: boolean = true;
}

/**
 * User preferences container
 */
export class UserPreferences {
    /** UI theme preference */
    @IsString()
    @IsOptional()
    theme: 'light' | 'dark' = 'light';

    /** Notification settings */
    @ValidateNested()
    @Type(() => NotificationPreferences)
    @IsOptional()
    notifications: NotificationPreferences = new NotificationPreferences();
}

/**
 * User entity extends BaseUser with organization-specific properties.
 * 
 * Core Features:
 * - Organization membership
 * - User preferences
 * - Display customization
 * 
 * Relationships:
 * - Many Users belong to one Organization (M:1)
 * - Organization relationship is required
 * - Protected from organization deletion (RESTRICT)
 * 
 * Preferences:
 * - Theme: UI appearance (light/dark)
 * - Notifications: Email and push settings
 * 
 * Constraints:
 * - Username must be unique
 * - Must belong to an organization
 * - Inherits BaseUser constraints
 */
@Entity()
export class User extends BaseUser {
    // Required Core Fields
    /** Unique username for the user */
    @Column({ type: 'varchar', unique: true })
    @IsString()
    @IsStandardName('USERNAME')
    username!: string;

    /** Display name shown in UI */
    @Column({ type: 'varchar' })
    @IsString()
    @IsStandardName('DISPLAYNAME')
    displayname!: string;

    // Relationship Fields
    /** ID of the user's organization */
    @Column(getModelRelationConfig(true).columnOptions)
    @IsUUID()
    organizationId!: string;

    /** The user's organization */
    @ManyToOne(() => Organization, getModelRelationConfig(true).relationOptions)
    @JoinColumn({ name: 'organizationId' })
    organization!: Organization;

    // Optional Fields
    /** User's preferences (theme, notifications) */
    @Column({ 
        type: 'simple-json', 
        nullable: true,
        default: () => new UserPreferences()
    })
    @IsObject()
    @ValidateNested()
    @Type(() => UserPreferences)
    @IsOptional()
    preferences: UserPreferences = new UserPreferences();
}
