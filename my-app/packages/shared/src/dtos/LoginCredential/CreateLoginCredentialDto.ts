import { IsString, IsUUID, IsEnum, IsOptional, IsBoolean, IsDate } from 'class-validator';

export enum CredentialType {
    PASSWORD = 'PASSWORD',
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN'
}

export class CreateLoginCredentialDto {
    @IsString()
    identifier!: string;

    @IsUUID()
    loginProviderId!: string;

    @IsString()
    @IsOptional()
    credentials?: string;

    @IsEnum(CredentialType)
    credentialType!: CredentialType;

    @IsDate()
    @IsOptional()
    expiresAt?: Date;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean = true;
}
