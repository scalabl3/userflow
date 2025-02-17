/**
 * Data Transfer Object for updating an existing organization.
 * Supports partial updates of organization properties.
 * 
 * Core Features:
 * - Partial updates (all fields optional)
 * - Organization details modification
 * - Admin reassignment
 * - Visibility toggling
 * - Subscription management
 * 
 * Optional Fields:
 * 1. Basic Information
 *    - name: Updated organization name
 *    - adminUser: New administrator ID
 * 
 * 2. Settings
 *    - visible: Modified visibility state
 * 
 * 3. Billing Updates
 *    - stripeCustomerId: New Stripe customer reference
 *    - subscriptionStatus: Updated subscription state
 * 
 * Validation:
 * - Name: 1-255 characters if provided
 * - Admin: Valid UUID if provided
 * - Visibility: Boolean if provided
 * - Stripe ID: Standard string format
 * - Status: Standard string format
 * 
 * Usage:
 * - Organization profile updates
 * - Admin transfers
 * - Visibility changes
 * - Subscription updates
 * - Billing information changes
 */

import { IsString, IsOptional, IsBoolean, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StandardString } from '../../utils/dto-utils';

export class UpdateOrganizationDto {
    @ApiProperty({
        description: 'Organization name',
        example: 'Acme Corporation',
        minLength: 1,
        maxLength: 255,
        required: false
    })
    @IsString()
    @Length(1, 255)
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Whether the organization is visible',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    visible?: boolean;

    @ApiProperty({
        description: 'ID of the admin user',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    adminUser?: string;

    @StandardString({
        description: 'Stripe customer ID for payment processing',
        example: 'cus_123456789',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    stripeCustomerId?: string;

    @StandardString({
        description: 'Current subscription status',
        example: 'active',
        required: false,
        minLength: 1,
        maxLength: 50
    })
    subscriptionStatus?: string;
}
