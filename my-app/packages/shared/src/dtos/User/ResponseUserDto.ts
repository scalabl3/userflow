/**
 * Data Transfer Object for organization user responses.
 * Extends base user responses with organization-specific data.
 * 
 * Core Features:
 * - Complete user information
 * - Organization context
 * - Preference exposure
 * - Inherited base user data
 * 
 * Field Categories:
 * 1. Identity Information (inherited)
 *    - firstname, lastname
 *    - contactEmail
 *    - state, isEnabled
 * 
 * 2. Organization Context
 *    - username: System identifier
 *    - displayname: UI presentation
 *    - organizationId: Parent reference
 *    - organization: Full organization details
 * 
 * 3. Preferences
 *    - theme: UI customization
 *    - notifications: Channel settings
 * 
 * 4. Activity Tracking (inherited)
 *    - lastLoginAt
 *    - createdAt, modifiedAt
 * 
 * Security:
 * - Selective field exposure
 * - Type-safe preferences
 * - Proper relationship handling
 * 
 * Inheritance:
 * - Extends ResponseBaseUserDto
 * - Inherits all base user fields
 * - Adds organization-specific data
 * 
 * Usage:
 * - API responses
 * - User profiles
 * - Member listings
 * - Preference management
 * - Organization context
 */

import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseBaseUserDto } from '../BaseUser/ResponseBaseUserDto';
import { ResponseOrganizationDto } from '../Organization/ResponseOrganizationDto';


export class ResponseUserDto extends ResponseBaseUserDto {
    @Expose()
    @ApiProperty({
        description: 'Unique username for system identification',
        example: 'johndoe'
    })
    username!: string;

    @Expose()
    @ApiProperty({
        description: 'Display name shown in UI',
        example: 'John Doe'
    })
    displayname!: string;

    @Expose()
    @ApiProperty({
        description: 'ID of the organization this user belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    organizationId!: string;

    @Expose()
    @Type(() => ResponseOrganizationDto)
    @ApiProperty({
        description: 'Associated organization details',
        type: () => ResponseOrganizationDto
    })
    organization?: ResponseOrganizationDto;

    
}
