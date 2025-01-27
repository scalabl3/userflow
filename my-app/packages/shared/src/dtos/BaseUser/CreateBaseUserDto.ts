import { IsString, IsEmail, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { UserState } from '@backend/models/BaseUser';

export class CreateBaseUserDto {
    @IsString()
    firstname!: string;

    @IsString()
    lastname!: string;

    @IsString()
    displayname!: string;

    @IsEmail()
    contactEmail!: string;

    @IsEnum(UserState)
    @IsOptional()
    state?: UserState;

    @IsUUID()
    @IsOptional()
    primaryLoginCredentialId?: string;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
