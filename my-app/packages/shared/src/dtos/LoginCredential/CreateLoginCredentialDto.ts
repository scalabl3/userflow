import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate, IsObject, ValidateIf, IsJWT } from 'class-validator';
import { Type } from 'class-transformer';
import { CredentialType, OAuthProvider } from '../../enums/CredentialType';

// Base DTO with common fields
class CreateLoginCredentialBaseDto {
    @IsString()
    identifier!: string;

    @IsUUID()
    loginProviderId!: string;

    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean = true;
}

// Password-specific DTO
class CreatePasswordCredentialDto extends CreateLoginCredentialBaseDto {
    @ValidateIf(o => o.credentialType === CredentialType.PASSWORD)
    @IsString()
    password!: string;  // Will be hashed by service
}

// OAuth base DTO
class CreateOAuthCredentialDto extends CreateLoginCredentialBaseDto {
    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsEnum(OAuthProvider)
    provider!: OAuthProvider;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsString()
    accessToken!: string;

    @ValidateIf(o => o.credentialType === CredentialType.OAUTH)
    @IsDate()
    @Type(() => Date)
    accessTokenExpiresAt!: Date;

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
export type CreateLoginCredentialDto = CreateLoginCredentialBaseDto;
export type { CreatePasswordCredentialDto, CreateOAuthCredentialDto };

