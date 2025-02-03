import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDate, IsObject, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OAuthProvider } from '../../../enums/CredentialType';
import { BaseLoginCredentialDto } from './BaseLoginCredentialDto';
import { StandardString } from '../../../utils/dto-utils';

/**
 * Base class for OAuth credential DTOs
 */
export class BaseOAuthCredentialDto extends BaseLoginCredentialDto {
    @ApiProperty({
        description: 'OAuth provider type',
        enum: OAuthProvider,
        example: OAuthProvider.GOOGLE,
        enumName: 'OAuthProvider'
    })
    @IsEnum(OAuthProvider, { message: 'Must be a valid OAuth provider' })
    provider!: OAuthProvider;

    @ApiProperty({
        description: 'OAuth access token',
        example: 'ya29.a0AfB_byC...'
    })
    @IsString({ message: 'Access token must be a string' })
    accessToken!: string;

    @ApiProperty({
        description: 'When the access token expires',
        example: '2024-01-28T12:00:00.000Z',
        format: 'date-time'
    })
    @IsDate({ message: 'Must be a valid date' })
    @Type(() => Date)
    accessTokenExpiresAt!: Date;

    @ApiProperty({
        description: 'OAuth refresh token',
        example: '1//04dX...',
        required: false
    })
    @IsString({ message: 'Refresh token must be a string' })
    @IsOptional()
    refreshToken?: string;

    @ApiProperty({
        description: 'When the refresh token expires',
        example: '2024-01-28T12:00:00.000Z',
        format: 'date-time',
        required: false
    })
    @IsDate({ message: 'Must be a valid date' })
    @IsOptional()
    @Type(() => Date)
    refreshTokenExpiresAt?: Date;

    @StandardString({
        description: 'OAuth scope',
        example: 'email profile',
        required: false,
        minLength: 1,
        maxLength: 1000
    })
    scope?: string;

    @ApiProperty({
        description: 'Raw profile data from OAuth provider',
        example: { name: 'John Doe', email: 'john@example.com' },
        required: false
    })
    @IsObject({ message: 'Raw profile must be an object' })
    @IsOptional()
    rawProfile?: Record<string, any>;
} 