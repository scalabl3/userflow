/**
 * Data Transfer Object for organization responses.
 * Provides standardized organization data representation with proper field exposure.
 * 
 * Core Features:
 * - Complete organization information
 * - User membership exposure
 * - Billing integration data
 * - Temporal tracking
 * - Selective field exposure
 * 
 * Field Categories:
 * 1. Identity Information
 *    - id: Unique identifier
 *    - name: Display name
 *    - visible: Public visibility state
 * 
 * 2. Membership Management
 *    - adminUser: Administrator reference
 *    - users: Member collection
 * 
 * 3. Billing Information
 *    - stripeCustomerId: Payment integration
 *    - subscriptionStatus: Current billing state
 * 
 * 4. Temporal Tracking
 *    - createdAt: Creation timestamp
 *    - modifiedAt: Last update timestamp
 * 
 * Security:
 * - Selective field exposure with @Expose()
 * - Type-safe nested objects
 * - Proper relationship handling
 * 
 * Usage:
 * - API responses
 * - Organization profiles
 * - Member management
 * - Billing operations
 * - Audit tracking
 */

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ResponseUserDto } from '../User/ResponseUserDto';
import { SubscriptionStatus } from '../../enums/SubscriptionStatus';

@Exclude()
export class ResponseOrganizationDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'Organization name',
        example: 'Acme Corporation',
        minLength: 1,
        maxLength: 255
    })
    name!: string;

    @Expose()
    @ApiProperty({
        description: 'Whether the organization is visible',
        example: true,
        default: false
    })
    visible!: boolean;

    @Expose()
    @ApiProperty({
        description: 'ID of the admin user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    adminUser!: string;

    @Expose()
    @Type(() => ResponseUserDto)
    @ApiProperty({
        description: 'Users belonging to this organization',
        type: [ResponseUserDto],
        required: false
    })
    users?: ResponseUserDto[];

    @Expose()
    @ApiProperty({
        description: 'Stripe customer ID for payment processing',
        example: 'cus_123456789',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    stripeCustomerId?: string;

    @Expose()
    @ApiProperty({
        description: 'Current subscription status',
        enum: SubscriptionStatus,
        example: SubscriptionStatus.ACTIVE,
        required: false
    })
    subscriptionStatus?: SubscriptionStatus;

    @Expose()
    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'Last modification timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    modifiedAt!: Date;
}
