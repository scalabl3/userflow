/**
 * Base Data Transfer Object for Apple Sign-In credential operations.
 * Extends OAuth credential DTO with Apple-specific fields and validation.
 * 
 * Core Features:
 * - Apple Sign-In integration
 * - Identity verification
 * - Authorization handling
 * - User verification
 * 
 * Apple-Specific Fields:
 * - Identity token (JWT)
 * - Authorization code
 * - Real user status
 * - Nonce verification
 * 
 * Security Features:
 * - JWT validation
 * - Nonce verification
 * - User status verification
 * - Token format validation
 * 
 * Validation:
 * - JWT format validation
 * - Required field validation
 * - Optional field handling
 * - String format validation
 * 
 * Usage:
 * - Apple Sign-In integration
 * - Identity verification
 * - User authentication
 * - Token management
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString, IsOptional } from 'class-validator';
import { BaseOAuthCredentialDto } from './BaseOAuthCredentialDto';
import { StandardString } from '../../../utils/dto-utils';
import { OAuthProvider } from '../../../enums/CredentialType';

/**
 * Base class for Apple OAuth credential DTOs
 */
export class BaseAppleCredentialDto extends BaseOAuthCredentialDto {
    // Override provider to be specifically APPLE
    @ApiProperty({
        description: 'OAuth provider type',
        enum: OAuthProvider,
        example: OAuthProvider.APPLE,
        enumName: 'OAuthProvider'
    })
    provider: OAuthProvider = OAuthProvider.APPLE;

    @ApiProperty({
        description: 'Apple identity token',
        example: 'eyJraWQ...',
        format: 'jwt'
    })
    @IsJWT({ message: 'Must be a valid JWT token' })
    identityToken!: string;

    @StandardString({
        description: 'Apple authorization code',
        example: 'c8ef...',
        required: true,
        minLength: 1,
        maxLength: 1000
    })
    @IsString()
    authorizationCode!: string;

    @ApiProperty({
        description: 'Apple\'s real user status',
        example: '2',
        required: false
    })
    @IsString()
    @IsOptional()
    realUserStatus?: string;

    @ApiProperty({
        description: 'Apple nonce used for token verification',
        example: 'abc123...',
        required: false
    })
    @IsString()
    @IsOptional()
    nonce?: string;
} 