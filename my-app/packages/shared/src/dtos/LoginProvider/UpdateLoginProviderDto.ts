/**
 * Data Transfer Object for updating an existing login provider.
 * Supports partial updates of provider properties.
 * 
 * Core Features:
 * - Optional field updates
 * - Provider code modification
 * - Display name updates
 * - Enable/disable toggling
 * 
 * Validation:
 * - Code: Optional, 1-50 characters if provided
 * - Name: Optional, 1-255 characters if provided
 * - Enabled: Optional boolean
 * 
 * Usage:
 * - Provider modification endpoints
 * - Configuration updates
 * - Provider state management
 * 
 * @extends {EnableableDto}
 */

import { ApiProperty } from '@nestjs/swagger';
import { EnableableDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class UpdateLoginProviderDto extends EnableableDto {
    @StandardString({
        description: 'Provider code (e.g., "email", "google", "phone")',
        example: 'google',
        required: false,
        minLength: 1,
        maxLength: 50
    })
    code?: string;

    @StandardString({
        description: 'Display name of the provider',
        example: 'Google',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    name?: string;
}
