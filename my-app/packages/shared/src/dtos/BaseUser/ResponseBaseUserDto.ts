/**
 * Data Transfer Object for base user responses.
 * Provides standardized user data representation with proper field exposure.
 * 
 * Core Features:
 * - Basic user information
 * - Contact details
 * - Account state tracking
 * - Login history
 * - Activation status
 * 
 * Field Categories:
 * 1. Identity Information
 *    - firstname, lastname
 *    - contactEmail
 * 
 * 2. Account Status
 *    - state (PENDING, ACTIVE, etc.)
 *    - isEnabled
 * 
 * 3. Activity Tracking
 *    - lastLoginAt
 *    - Inherited timestamps (createdAt, modifiedAt)
 * 
 * Security:
 * - Selective field exposure
 * - No sensitive data
 * - Proper type transformation
 * 
 * Usage:
 * - API responses
 * - User profile data
 * - Account management
 * - Authentication flows
 */

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserState } from '../../enums/UserState';
import { BaseResponseDto } from '../base/BaseDto';

@Exclude()
export class ResponseBaseUserDto extends BaseResponseDto {
    @Expose()
    @ApiProperty({
        description: 'User\'s first name',
        example: 'John',
        minLength: 1,
        maxLength: 255
    })
    firstname!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s last name',
        example: 'Doe',
        minLength: 1,
        maxLength: 255
    })
    lastname!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s contact email',
        example: 'john.doe@example.com',
        format: 'email'
    })
    contactEmail!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s current state',
        enum: UserState,
        example: UserState.ACTIVE,
        enumName: 'UserState'
    })
    state!: UserState;

    @Expose()
    @ApiProperty({
        description: 'Last login timestamp',
        example: '2024-01-28T12:00:00.000Z',
        required: false,
        format: 'date-time'
    })
    lastLoginAt?: Date;

    @Expose()
    @ApiProperty({
        description: 'Whether the user is enabled',
        example: true,
        type: Boolean
    })
    isEnabled!: boolean;
}
