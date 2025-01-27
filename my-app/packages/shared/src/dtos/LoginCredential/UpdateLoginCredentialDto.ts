import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { CredentialType } from './CreateLoginCredentialDto';

export class UpdateLoginCredentialDto {
    @IsString()
    @IsOptional()
    identifier?: string;

    @IsUUID()
    @IsOptional()
    loginProviderId?: string;

    @IsString()
    @IsOptional()
    credentials?: string;

    @IsEnum(CredentialType)
    @IsOptional()
    credentialType?: CredentialType;

    @IsDate()
    @IsOptional()
    expiresAt?: Date;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
