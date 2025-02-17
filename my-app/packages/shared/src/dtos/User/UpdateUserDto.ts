/**
 * Data Transfer Object for updating an existing organization user.
 * Extends base user updates with organization-specific properties.
 * 
 * Core Features:
 * - Partial updates (all fields optional)
 * - Display customization
 * - Preference management
 * - Inherited base user updates
 * 
 * Optional Fields:
 * 1. Identity Updates (inherited)
 *    - firstname: Modified first name
 *    - lastname: Modified last name
 *    - contactEmail: New contact email
 * 
 * 2. Display Updates
 *    - username: System identifier
 *    - displayname: UI presentation name
 *    - organizationId: Parent organization
 * 
 * 3. Preference Updates
 *    - theme: UI theme changes
 *    - notifications: Channel preferences
 * 
 * 4. Status Updates (inherited)
 *    - state: Account state transitions
 *    - isEnabled: Activation changes
 * 
 * Validation:
 * - Standard name validation if provided
 * - Preference structure validation
 * - State transition rules
 * - Partial update handling
 * 
 * Inheritance:
 * - Extends UpdateBaseUserDto
 * - Inherits all base user validations
 * - Adds organization-specific fields
 * 
 * Usage:
 * - Profile updates
 * - Preference customization
 * - Display name changes
 * - Theme switching
 * - Notification settings
 */

import { IsOptional, IsString, IsUUID, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateBaseUserDto } from '../BaseUser/UpdateBaseUserDto';
import { Type } from 'class-transformer';
import { UserPreferences } from '../../types/user';
import { StandardString } from '../../utils/dto-utils';

export class UpdateUserDto extends UpdateBaseUserDto {
    @ApiProperty({
        description: 'User\'s unique username',
        example: 'johndoe',
        required: false
    })
    @IsOptional()
    @IsString()
    username?: string;

    @StandardString({
        description: 'Display name shown in UI',
        example: 'John Doe',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    @IsOptional()
    @IsString()
    displayname?: string;

    @ApiProperty({
        description: 'ID of the associated organization',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @ApiProperty({
        description: 'User preferences including theme and notifications',
        type: () => UserPreferences,
        required: false
    })
    @IsObject()
    @ValidateNested()
    @Type(() => UserPreferences)
    @IsOptional()
    preferences?: UserPreferences;
}
