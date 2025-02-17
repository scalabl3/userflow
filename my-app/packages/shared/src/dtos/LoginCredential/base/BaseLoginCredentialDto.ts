/**
 * Base Data Transfer Object for all login credential operations.
 * Provides core fields and validation rules common to all credential types.
 * 
 * Core Features:
 * - Basic credential identification
 * - Provider association
 * - User association
 * - Type classification
 * - State management
 * 
 * Common Properties:
 * - identifier: User's authentication identifier
 * - loginProviderId: Associated provider reference
 * - baseUserId: Associated user reference
 * - credentialType: Type of credential
 * - isEnabled: Activation state
 * 
 * Validation:
 * - Required fields validation
 * - UUID format validation
 * - Enum value validation
 * - Boolean state validation
 * 
 * Usage:
 * - Base class for credential DTOs
 * - Common field definitions
 * - Shared validation rules
 * - Type classification
 */

import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialType } from '../../../enums/CredentialType';
import { EnableableDto } from '../../base/BaseDto';
import { StandardString, RelationshipId } from '../../../utils/dto-utils';

/**
 * Base class for all login credential DTOs
 */
export class BaseLoginCredentialDto extends EnableableDto {
    @ApiProperty({
        description: 'Identifier used for authentication (email, phone, etc.)',
        example: 'user@example.com'
    })
    @IsString()
    identifier!: string;

    @ApiProperty({
        description: 'ID of the associated login provider',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    loginProviderId!: string;

    @ApiProperty({
        description: 'ID of the associated base user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    baseUserId!: string;

    @ApiProperty({
        description: 'Type of credential',
        enum: CredentialType,
        example: CredentialType.PASSWORD
    })
    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    @ApiProperty({
        description: 'Whether the credential is enabled',
        example: true,
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean = true;
} 