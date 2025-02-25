/**
 * Data Transfer Object for login credential responses.
 * Provides standardized credential data representation with security measures.
 * 
 * Core Features:
 * - Complete credential information
 * - Secure field exposure control
 * - Type-specific data handling
 * - Relationship exposure
 * 
 * Authentication Types:
 * 1. Password Credentials
 *    - No password exposure
 *    - Basic credential info only
 * 
 * 2. OAuth Credentials
 *    - Token information
 *    - Provider details
 *    - Profile data
 * 
 * 3. Apple Sign-In
 *    - Identity verification
 *    - Real user status
 * 
 * Security:
 * - No sensitive data exposure
 * - Selective field visibility
 * - Relationship ID only references
 * 
 * Usage:
 * - API responses
 * - Credential management
 * - Authentication state
 * - User profile data
 */

import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialType, OAuthProvider } from '../../enums/CredentialType';
import { BaseResponseDto } from '../base/BaseDto';
import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate, IsObject, ValidateIf, IsJWT } from 'class-validator';

@Exclude()
export class ResponseLoginCredentialDto extends BaseResponseDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'Identifier used for authentication (email, phone, etc.)',
        example: 'user@example.com'
    })
    identifier!: string;


    @Expose()
    @ApiProperty({
        description: 'Type of credential',
        enum: CredentialType,
        example: CredentialType.PASSWORD
    })
    credentialType!: CredentialType;

    @Expose()
    @ApiProperty({
        description: 'Whether the credential is enabled',
        example: true
    })
    isEnabled!: boolean;

    // Password-specific fields
    @Expose()
    @ApiProperty({
        description: 'Indicates if password is set',
        example: true,
        required: false
    })
    hasPassword?: boolean;

    // OAuth-specific fields
    @Expose()
    @ApiProperty({
        description: 'OAuth provider type (for OAuth credentials)',
        enum: OAuthProvider,
        example: OAuthProvider.GOOGLE,
        required: false
    })
    provider?: OAuthProvider;

    @Expose()
    @ApiProperty({
        description: 'When the access token expires (for OAuth credentials)',
        example: '2024-01-28T12:00:00.000Z',
        required: false
    })
    accessTokenExpiresAt?: Date;

    @Expose()
    @ApiProperty({
        description: 'Indicates if refresh token exists',
        example: true,
        required: false
    })
    hasRefreshToken?: boolean;

    @Expose()
    @ApiProperty({
        description: 'When the refresh token expires (for OAuth credentials)',
        example: '2024-01-28T12:00:00.000Z',
        required: false
    })
    refreshTokenExpiresAt?: Date;

    @Expose()
    @ApiProperty({
        description: 'OAuth scope (for OAuth credentials)',
        example: 'email profile',
        required: false
    })
    scope?: string;

    @Expose()
    @ApiProperty({
        description: 'Raw profile data from OAuth provider',
        example: { name: 'John Doe', email: 'john@example.com' },
        required: false
    })
    rawProfile?: Record<string, any>;

    // Apple-specific fields
    @Expose()
    @ApiProperty({
        description: 'Indicates if Apple identity token exists',
        example: true,
        required: false
    })
    hasIdentityToken?: boolean;

    @Expose()
    @ApiProperty({
        description: 'Indicates if Apple authorization code exists',
        example: true,
        required: false
    })
    hasAuthorizationCode?: boolean;

    @Expose()
    @ApiProperty({
        description: 'Real user status from Apple Sign-In',
        example: '2',
        required: false
    })
    realUserStatus?: string;

    @Expose()
    @ApiProperty({
        description: 'ID of the associated base user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    baseUserId!: string;

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
