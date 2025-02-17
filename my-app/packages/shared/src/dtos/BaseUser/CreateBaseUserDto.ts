/**
 * Data Transfer Object for creating a new base user.
 * Provides core user properties without organization context.
 * 
 * Core Features:
 * - Basic user information
 * - Contact details
 * - Initial state management
 * - Account activation control
 * 
 * Required Fields:
 * 1. Identity Information
 *    - firstname: User's first name
 *    - lastname: User's last name
 *    - contactEmail: Primary contact email
 * 
 * Optional Fields:
 * 1. Account Status
 *    - state: Initial account state (defaults to PENDING)
 *    - isEnabled: Initial activation status (inherited)
 * 
 * Validation:
 * - Standard string validation for names
 * - Email format validation
 * - State enum validation
 * - Boolean flag validation
 * 
 * Usage:
 * - User registration
 * - Account creation
 * - System user setup
 * - Test data generation
 */

import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserState } from '../../enums/UserState';
import { EnableableDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class CreateBaseUserDto extends EnableableDto {
    @StandardString({
        description: 'User\'s first name',
        example: 'John',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    firstname!: string;

    @StandardString({
        description: 'User\'s last name',
        example: 'Doe',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    lastname!: string;

    @ApiProperty({
        description: 'User\'s contact email',
        example: 'john.doe@example.com',
        required: true
    })
    @IsEmail({}, { message: 'Must be a valid email address' })
    contactEmail!: string;

    @ApiProperty({
        description: 'User\'s state',
        enum: UserState,
        example: UserState.ACTIVE,
        default: UserState.PENDING,
        enumName: 'UserState',
        required: false
    })
    @IsEnum(UserState, { message: 'Must be a valid user state' })
    @IsOptional()
    state?: UserState = UserState.PENDING;
}
