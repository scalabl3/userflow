import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate, IsObject, ValidateIf, IsJWT } from 'class-validator';
import { Type } from 'class-transformer';
import { CredentialType, OAuthProvider } from '../../enums/CredentialType';

// Base update DTO
class UpdateLoginCredentialBaseDto {
    @IsString()
    @IsOptional()
    identifier?: string;

    @IsUUID()
    @IsOptional()
    loginProviderId?: string;

    @IsEnum(CredentialType)
    @IsOptional()
    credentialType?: CredentialType;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}

// Password update DTO
class UpdatePasswordCredentialDto extends UpdateLoginCredentialBaseDto {
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @IsString()
    @IsOptional()
    currentPassword?: string;  // Required for password change

    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @IsString()
    @IsOptional()
    newPassword?: string;  // New password to set
}

// OAuth update DTO
class UpdateOAuthCredentialDto extends UpdateLoginCredentialBaseDto {
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsEnum(OAuthProvider)
    @IsOptional()
    provider?: OAuthProvider;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    @IsOptional()
    accessToken?: string;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    accessTokenExpiresAt?: Date;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    @IsOptional()
    refreshToken?: string;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    refreshTokenExpiresAt?: Date;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    @IsOptional()
    scope?: string;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsObject()
    @IsOptional()
    rawProfile?: Record<string, any>;

    // Apple-specific fields
    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsJWT()
    @IsOptional()
    identityToken?: string;

    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsString()
    @IsOptional()
    authorizationCode?: string;

    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsString()
    @IsOptional()
    realUserStatus?: string;

    @ValidateIf(o => o.provider === OAuthProvider.APPLE)
    @IsString()
    @IsOptional()
    nonce?: string;
}

// Export types with aliases to maintain backward compatibility
export type UpdateLoginCredentialDto = UpdateLoginCredentialBaseDto;
export type { UpdatePasswordCredentialDto, UpdateOAuthCredentialDto };
