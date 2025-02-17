/**
 * Shared type definitions for user-related functionality.
 * Provides common types used across frontend and backend.
 * 
 * Core Features:
 * - User preference types
 * - Notification settings
 * - Theme configuration
 * - Default values
 */

import { IsString, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Notification preferences for user communication settings.
 * Controls which notification channels are enabled.
 */
export class NotificationPreferences {
    /** Flag for enabling/disabling email notifications */
    @IsBoolean()
    @IsOptional()
    email: boolean = true;

    /** Flag for enabling/disabling push notifications */
    @IsBoolean()
    @IsOptional()
    push: boolean = true;
}

/**
 * Comprehensive user preferences container.
 * Manages UI/UX and communication preferences.
 */
export class UserPreferences {
    /** UI theme selection (light/dark) */
    @IsString()
    @IsOptional()
    theme: 'light' | 'dark' = 'light';

    /** Notification delivery preferences */
    @ValidateNested()
    @Type(() => NotificationPreferences)
    @IsOptional()
    notifications: NotificationPreferences = new NotificationPreferences();
} 