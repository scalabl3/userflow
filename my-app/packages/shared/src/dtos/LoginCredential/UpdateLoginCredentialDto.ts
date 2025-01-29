import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate, IsObject, ValidateIf, IsJWT } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialType, OAuthProvider } from '../../enums/CredentialType';

// Base update DTO
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
        description: 'ID of the associated login provider',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    loginProviderId?: string;

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

// Password update DTO
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

// OAuth update DTO
class UpdateOAuthCredentialDto extends UpdateLoginCredentialBaseDto {
    @ApiProperty({
        description: 'OAuth provider type',
        enum: OAuthProvider,
        example: OAuthProvider.GOOGLE,
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsEnum(OAuthProvider)
    @IsOptional()
    provider?: OAuthProvider;

    @ApiProperty({
        description: 'OAuth access token',
        example: 'ya29.a0AfB_byC...',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    @IsOptional()
    accessToken?: string;

    @ApiProperty({
        description: 'When the access token expires',
        example: '2024-01-28T12:00:00.000Z',
        required: false
    })
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    accessTokenExpiresAt?: Date;

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
export type UpdateLoginCredentialDto = UpdateLoginCredentialBaseDto;
export type { UpdatePasswordCredentialDto, UpdateOAuthCredentialDto };
