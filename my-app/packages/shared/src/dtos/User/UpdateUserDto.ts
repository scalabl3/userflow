import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class UpdateUserDto {
    // Base user fields
    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsString()
    contactEmail?: string;

    // User fields
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    displayname?: string;

    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @IsOptional()
    @IsObject()
    preferences?: {
        theme?: 'light' | 'dark';
        notifications?: {
            email?: boolean;
            push?: boolean;
        };
    };
}
