/**
 * Data Transfer Object for creating a new login provider.
 * Defines required data for provider initialization.
 * 
 * Core Features:
 * - Provider identification (code)
 * - Display information (name)
 * - Enable/disable capability
 * 
 * Validation:
 * - Code: Required, 1-50 characters
 * - Name: Required, 1-255 characters
 * - Enabled: Optional, defaults to true
 * 
 * Usage:
 * - Provider creation endpoints
 * - Authentication setup
 * - Provider configuration
 * 
 * @extends {EnableableDto}
 */

import { ApiProperty } from '@nestjs/swagger';
import { EnableableDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class CreateLoginProviderDto extends EnableableDto {
    @StandardString({
        description: 'Provider code (e.g., "email", "google", "phone")',
        example: 'google',
        required: true,
        minLength: 1,
        maxLength: 50
    })
    code!: string;

    @StandardString({
        description: 'Display name of the provider',
        example: 'Google',
        required: true,
        minLength: 1,
        maxLength: 255
    })
    name!: string;
}
