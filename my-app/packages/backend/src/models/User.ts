import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseUser } from './BaseUser';
import { Organization } from './Organization';
import { IsString, IsUUID, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { getModelRelationConfig } from '../migrations/helpers';
import { IsStandardLength, IsStandardName } from '@my-app/shared/dist/decorators/validation';
import { UserPreferences } from '@my-app/shared/dist/types/user';

/**
 * User entity extends BaseUser with organization-specific properties.
 * 
 * Core Features:
 * - Organization membership management
 * - User identification and display
 * - Preference customization
 * - UI/UX personalization
 * 
 * Relationships:
 * - Many Users belong to one Organization (M:1)
 * - Organization relationship is required and protected (RESTRICT)
 * - Inherits authentication relationships from BaseUser
 * 
 * Identity Management:
 * - Unique username for system identification
 * - Display name for UI presentation
 * - Organization affiliation tracking
 * 
 * Customization:
 * - Theme preferences (light/dark)
 * - Notification settings (email/push)
 * - Display preferences
 * 
 * Constraints:
 * - Username must be unique across system
 * - Must belong to exactly one organization
 * - Display name must follow standard format
 * - Inherits all BaseUser constraints
 * 
 * Inheritance:
 * - Extends BaseUser for core user functionality
 * - Adds organization-specific features
 * - Maintains BaseUser validation rules
 */
@Entity()
export class User extends BaseUser {
    // Required Core Fields
    /** Unique username for system identification */
    @Column({ type: 'varchar', unique: true })
    @IsString()
    @IsStandardName('USERNAME')
    username!: string;

    /** Display name shown in UI and communications */
    @Column({ type: 'varchar' })
    @IsString()
    @IsStandardName('DISPLAYNAME')
    displayname!: string;

    // Relationship Fields
    /** ID of the user's organization (required) */
    @Column(getModelRelationConfig(true).columnOptions)
    @IsUUID()
    organizationId!: string;

    /** The user's organization (M:1 relationship) */
    @ManyToOne(() => Organization, getModelRelationConfig(true).relationOptions)
    @JoinColumn({ name: 'organizationId' })
    organization!: Organization;

    // Optional Fields
    /** User's customizable preferences */
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
