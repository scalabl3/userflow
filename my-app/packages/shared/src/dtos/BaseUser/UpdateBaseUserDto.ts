import { IsString, IsEmail, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { UserState } from '../../enums/UserState';

export class UpdateBaseUserDto {
    @IsString()
    @IsOptional()
    firstname?: string;

    @IsString()
    @IsOptional()
    lastname?: string;

    @IsString()
    @IsOptional()
    displayname?: string;

    @IsEmail()
    @IsOptional()
    contactEmail?: string;

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
