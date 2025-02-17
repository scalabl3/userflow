/**
 * Data Transfer Object for updating an existing base user.
 * Supports partial updates of user properties.
 * 
 * Core Features:
 * - Partial updates (all fields optional)
 * - Identity information updates
 * - Contact detail changes
 * - State transitions
 * - Account status control
 * 
 * Optional Fields:
 * 1. Identity Updates
 *    - firstname: Modified first name
 *    - lastname: Modified last name
 *    - contactEmail: New contact email
 * 
 * 2. Status Changes
 *    - state: New account state
 *    - isEnabled: Modified activation status (inherited)
 * 
 * Validation:
 * - Standard string validation for names
 * - Email format validation when provided
 * - State enum validation
 * - Boolean flag validation
 * 
 * Usage:
 * - Profile updates
 * - Contact info changes
 * - Account state transitions
 * - Status modifications
 */

import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserState } from '../../enums/UserState';
import { EnableableDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class UpdateBaseUserDto extends EnableableDto {
    @StandardString({
        description: 'User\'s first name',
        example: 'John',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    firstname?: string;

    @StandardString({
        description: 'User\'s last name',
        example: 'Doe',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    lastname?: string;

    @ApiProperty({
        description: 'User\'s contact email',
        example: 'john.doe@example.com',
        required: false,
        format: 'email'
    })
    @IsEmail({}, { message: 'Must be a valid email address' })
    @IsOptional()
    contactEmail?: string;

    @ApiProperty({
        description: 'User\'s state',
        enum: UserState,
        example: UserState.ACTIVE,
        enumName: 'UserState',
        required: false
    })
    @IsEnum(UserState, { message: 'Must be a valid user state' })
    @IsOptional()
    state?: UserState;
}
