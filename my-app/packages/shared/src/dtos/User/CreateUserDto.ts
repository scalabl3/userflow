/**
 * Data Transfer Object for creating a new organization user.
 * Extends base user creation with organization-specific properties.
 * 
 * Core Features:
 * - Organization membership
 * - User identification
 * - Display customization
 * - Preference initialization
 * - Inherited base user features
 * 
 * Required Fields:
 * 1. Identity Information (inherited)
 *    - firstname: User's first name
 *    - lastname: User's last name
 *    - contactEmail: Primary contact email
 * 
 * 2. Organization Context
 *    - username: Unique system identifier
 *    - displayname: UI presentation name
 *    - organizationId: Parent organization
 * 
 * Optional Fields:
 * 1. Account Status (inherited)
 *    - state: Initial account state
 *    - isEnabled: Activation status
 * 
 * 2. Preferences
 *    - theme: UI theme selection
 *    - notifications: Channel settings
 * 
 * Validation:
 * - Standard name validation
 * - Username uniqueness
 * - Organization existence
 * - Preference structure
 * 
 * Inheritance:
 * - Extends CreateBaseUserDto
 * - Inherits all base user validations
 * - Adds organization-specific fields
 * 
 * Usage:
 * - Organization user creation
 * - Member registration
 * - Account initialization
 * - Profile setup
 */

import { IsObject, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBaseUserDto } from '../BaseUser/CreateBaseUserDto';
import { StandardString } from '../../utils/dto-utils';

export class CreateUserDto extends CreateBaseUserDto {
    @StandardString({
        description: 'Unique username for system identification',
        example: 'johndoe',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    username!: string;

    @StandardString({
        description: 'Display name shown in UI',
        example: 'John Doe',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    displayname!: string;

    @ApiProperty({
        description: 'ID of the organization this user belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    organizationId!: string;


}
