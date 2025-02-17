/**
 * Data Transfer Objects for creating login credentials.
 * Supports multiple authentication types with type-specific validation.
 * 
 * Core Features:
 * - Multiple credential types (Password, OAuth)
 * - Provider-specific fields
 * - Conditional validation
 * - Swagger documentation
 * 
 * Authentication Types:
 * 1. Password Authentication
 *    - Standard username/password
 *    - Password hashing handled by service
 * 
 * 2. OAuth Authentication
 *    - Multiple providers (Google, GitHub, Apple)
 *    - Token management
 *    - Profile data handling
 * 
 * 3. Apple Sign-In
 *    - Identity token handling
 *    - Real user verification
 *    - Nonce validation
 * 
 * Usage:
 * - User authentication setup
 * - OAuth integration
 * - Credential management
 */

import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate, IsObject, ValidateIf, IsJWT } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialType, OAuthProvider } from '../../enums/CredentialType';

/**
 * Base DTO for all credential creation operations.
 * Provides common fields required for any credential type.
 * 
 * Core Features:
 * - Basic credential information
 * - Type identification
 * - Relationship management
 * 
 * Validation:
 * - Required fields: identifier, provider, user, type
 * - UUID validation for relationships
 * - Enum validation for type
 * 
 * @class
 */
class CreateLoginCredentialBaseDto {
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

/**
 * DTO for creating password-based credentials.
 * Handles traditional username/password authentication.
 * 
 * Core Features:
 * - Password field handling
 * - Conditional validation
 * - Service-side hashing
 * 
 * Security:
 * - Password will be hashed by service
 * - Never stored in plain text
 * 
 * @extends {CreateLoginCredentialBaseDto}
 */
class CreatePasswordCredentialDto extends CreateLoginCredentialBaseDto {
    @ApiProperty({
        description: 'Password in plain text (will be hashed by service)',
        example: 'MySecurePassword123'
    })
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @IsString()
    password!: string;  // Will be hashed by service
}

/**
 * DTO for creating OAuth-based credentials.
 * Supports multiple OAuth providers with provider-specific fields.
 * 
 * Core Features:
 * - Multi-provider support
 * - Token management
 * - Profile data handling
 * - Apple Sign-In support
 * 
 * Provider Support:
 * - Google OAuth
 * - GitHub OAuth
 * - Apple Sign-In
 * 
 * Token Management:
 * - Access token handling
 * - Refresh token support
 * - Expiration tracking
 * 
 * @extends {CreateLoginCredentialBaseDto}
 */
class CreateOAuthCredentialDto extends CreateLoginCredentialBaseDto {
    @ApiProperty({
        description: 'OAuth provider type',
        enum: OAuthProvider,
        example: OAuthProvider.GOOGLE
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsEnum(OAuthProvider)
    provider!: OAuthProvider;

    @ApiProperty({
        description: 'OAuth access token',
        example: 'ya29.a0AfB_byC...'
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    accessToken!: string;

    @ApiProperty({
        description: 'When the access token expires',
        example: '2024-01-28T12:00:00.000Z'
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsDate()
    @Type(() => Date)
    accessTokenExpiresAt!: Date;

    @ApiProperty({
        description: 'OAuth refresh token',
        example: '1//04dX...',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    @IsOptional()
    refreshToken?: string;

    @ApiProperty({
        description: 'When the refresh token expires',
        example: '2024-01-28T12:00:00.000Z',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    refreshTokenExpiresAt?: Date;

    @ApiProperty({
        description: 'OAuth scope',
        example: 'email profile',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    @IsOptional()
    scope?: string;

    @ApiProperty({
        description: 'Raw profile data from OAuth provider',
        example: { name: 'John Doe', email: 'john@example.com' },
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
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
export type CreateLoginCredentialDto = CreateLoginCredentialBaseDto;
export type { CreatePasswordCredentialDto, CreateOAuthCredentialDto };

