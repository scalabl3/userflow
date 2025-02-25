/**
 * Data Transfer Objects for updating login credentials.
 * Supports partial updates for all credential types.
 * 
 * Core Features:
 * - Partial updates (all fields optional)
 * - Type-specific validation
 * - Password change handling
 * - OAuth token refresh
 * 
 * Update Types:
 * 1. Base Updates:
 *    - Identifier modification
 *    - Provider reassignment
 *    - Enable/disable toggling
 * 
 * 2. Password Updates:
 *    - Password change with verification
 *    - Current password validation
 * 
 * 3. OAuth Updates:
 *    - Token refresh
 *    - Profile updates
 *    - Provider-specific fields
 * 
 * Usage:
 * - Credential modification
 * - Token refresh operations
 * - State management
 */

import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate, IsObject, ValidateIf, IsJWT } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialType, OAuthProvider } from '../../enums/CredentialType';

/**
 * Base DTO for all credential update operations.
 * All fields are optional to support partial updates.
 * 
 * Core Features:
 * - Optional field updates
 * - Type modification
 * - State management
 * 
 * Validation:
 * - Optional fields only
 * - Type-safe updates
 * - UUID validation
 * 
 * @class
 */
class UpdateLoginCredentialBaseDto {
    @ApiProperty({
        description: 'Identifier used for authentication (email, phone, etc.)',
        example: 'user@example.com',
        required: false
    })
    @IsString()
    @IsOptional()
    identifier?: string;


    @ApiProperty({
        description: 'Type of credential',
        enum: CredentialType,
        example: CredentialType.PASSWORD,
        required: false
    })
    @IsEnum(CredentialType)
    @IsOptional()
    credentialType?: CredentialType;

    @ApiProperty({
        description: 'Whether the credential is enabled',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}

/**
 * DTO for updating password-based credentials.
 * Handles secure password changes with verification.
 * 
 * Core Features:
 * - Password change workflow
 * - Current password verification
 * - Optional updates
 * 
 * Security:
 * - Current password required for changes
 * - Service-side hashing
 * - Validation rules
 * 
 * @extends {UpdateLoginCredentialBaseDto}
 */
class UpdatePasswordCredentialDto extends UpdateLoginCredentialBaseDto {
    @ApiProperty({
        description: 'Current password (required for password change)',
        example: 'CurrentPass123',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @IsString()
    @IsOptional()
    currentPassword?: string;

    @ApiProperty({
        description: 'New password to set',
        example: 'NewPass123',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @IsString()
    @IsOptional()
    newPassword?: string;
}

/**
 * DTO for updating OAuth-based credentials.
 * Handles token refresh and profile updates.
 * 
 * Core Features:
 * - Token refresh workflow
 * - Profile data updates
 * - Provider-specific fields
 * 
 * Token Management:
 * - Access token updates
 * - Refresh token handling
 * - Expiration tracking
 * 
 * Provider Support:
 * - Google OAuth
 * - GitHub OAuth
 * - Apple Sign-In
 * 
 * @extends {UpdateLoginCredentialBaseDto}
 */
class UpdateOAuthCredentialDto extends UpdateLoginCredentialBaseDto {
    @ApiProperty({
        description: 'OAuth provider type',
        enum: OAuthProvider,
        example: OAuthProvider.GOOGLE,
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_GOOGLE || 
                o.credentialType === CredentialType.OAUTH_GITHUB || 
                o.credentialType === CredentialType.OAUTH_APPLE)
    @IsEnum(OAuthProvider)
    @IsOptional()
    provider?: OAuthProvider;

    @ApiProperty({
        description: 'OAuth access token',
        example: 'ya29.a0AfB_byC...',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_GOOGLE || 
                o.credentialType === CredentialType.OAUTH_GITHUB || 
                o.credentialType === CredentialType.OAUTH_APPLE)
    @IsString()
    @IsOptional()
    accessToken?: string;

    @ApiProperty({
        description: 'When the access token expires',
        example: '2024-01-28T12:00:00.000Z',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_GOOGLE || 
                o.credentialType === CredentialType.OAUTH_GITHUB || 
                o.credentialType === CredentialType.OAUTH_APPLE)
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    accessTokenExpiresAt?: Date;

    @ApiProperty({
        description: 'OAuth refresh token',
        example: '1//04dX...',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_GOOGLE || 
                o.credentialType === CredentialType.OAUTH_GITHUB || 
                o.credentialType === CredentialType.OAUTH_APPLE)
    @IsString()
    @IsOptional()
    refreshToken?: string;

    @ApiProperty({
        description: 'When the refresh token expires',
        example: '2024-01-28T12:00:00.000Z',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_GOOGLE || 
                o.credentialType === CredentialType.OAUTH_GITHUB || 
                o.credentialType === CredentialType.OAUTH_APPLE)
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    refreshTokenExpiresAt?: Date;

    @ApiProperty({
        description: 'OAuth scope',
        example: 'email profile',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_GOOGLE || 
                o.credentialType === CredentialType.OAUTH_GITHUB || 
                o.credentialType === CredentialType.OAUTH_APPLE)
    @IsString()
    @IsOptional()
    scope?: string;

    @ApiProperty({
        description: 'Raw profile data from OAuth provider',
        example: { name: 'John Doe', email: 'john@example.com' },
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH_GOOGLE || 
                o.credentialType === CredentialType.OAUTH_GITHUB || 
                o.credentialType === CredentialType.OAUTH_APPLE)
    @IsObject()
    @IsOptional()
    rawProfile?: Record<string, any>;

    // Apple-specific fields
    @ApiProperty({
        description: 'Apple identity token',
        example: 'eyJraWQ...',
        required: false
    })
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsJWT()
    @IsOptional()
    identityToken?: string;

    @ApiProperty({
        description: 'Apple authorization code',
        example: 'c8ef...',
        required: false
    })
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsString()
    @IsOptional()
    authorizationCode?: string;

    @ApiProperty({
        description: 'Apple\'s real user status',
        example: '2',
        required: false
    })
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsString()
    @IsOptional()
    realUserStatus?: string;

    @ApiProperty({
        description: 'Apple nonce used for token verification',
        example: 'abc123...',
        required: false
    })
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsString()
    @IsOptional()
    nonce?: string;
}

// Export types with aliases to maintain backward compatibility
export type UpdateLoginCredentialDto = UpdateLoginCredentialBaseDto;
export type { UpdatePasswordCredentialDto, UpdateOAuthCredentialDto };
