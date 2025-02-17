/**
 * Data Transfer Object for login provider responses.
 * Provides standardized provider data representation.
 * 
 * Core Features:
 * - Complete provider information
 * - Standard response fields (id, timestamps)
 * - Selective field exposure
 * 
 * Properties:
 * - ID: Unique identifier
 * - Code: Provider type identifier
 * - Name: Display name
 * - Enabled: Current state
 * - Timestamps: Creation and modification
 * 
 * Usage:
 * - API responses
 * - Provider listings
 * - Configuration views
 * - Status reporting
 * 
 * @extends {BaseResponseDto}
 */

import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseResponseDto } from '../base/BaseDto';

@Exclude()
export class ResponseLoginProviderDto extends BaseResponseDto {
    @Expose()
    @ApiProperty({
        description: 'Provider code (e.g., "email", "google", "phone")',
        example: 'google',
        minLength: 1,
        maxLength: 50
    })
    code!: string;

    @Expose()
    @ApiProperty({
        description: 'Display name of the provider',
        example: 'Google',
        minLength: 1,
        maxLength: 255
    })
    name!: string;

    @Expose()
    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
        type: Boolean
    })
    isEnabled!: boolean;
}
