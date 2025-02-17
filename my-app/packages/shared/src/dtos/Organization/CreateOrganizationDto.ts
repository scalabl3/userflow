/**
 * Data Transfer Object for creating a new organization.
 * Defines the required and optional properties for organization initialization.
 * 
 * Core Features:
 * - Organization identification
 * - Admin user assignment
 * - Visibility control
 * - Stripe integration
 * - Subscription management
 * 
 * Required Fields:
 * 1. Basic Information
 *    - name: Organization display name
 *    - adminUser: Initial administrator ID
 * 
 * Optional Fields:
 * 1. Visibility Settings
 *    - visible: Public visibility flag (defaults to false)
 * 
 * 2. Billing Integration
 *    - stripeCustomerId: Stripe customer reference
 *    - subscriptionStatus: Current subscription state
 * 
 * Validation:
 * - Name: Required, 1-255 characters
 * - Admin: Required, valid UUID
 * - Visibility: Optional boolean
 * - Stripe ID: Optional, standard string format
 * - Status: Optional, standard string format
 * 
 * Usage:
 * - Organization registration
 * - Tenant creation
 * - Business account setup
 * - Test environment initialization
 */

import { IsString, IsOptional, IsBoolean, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StandardString } from '../../utils/dto-utils';

export class CreateOrganizationDto {
    @ApiProperty({
        description: 'Organization name',
        example: 'Acme Corporation',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @Length(1, 255)
    name!: string;

    @ApiProperty({
        description: 'Whether the organization is visible',
        example: false,
        default: false,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    visible?: boolean;

    @ApiProperty({
        description: 'ID of the admin user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    adminUser!: string;

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
