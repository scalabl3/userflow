import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class UpdateUserDto {
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

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string;

    @IsOptional()
    @IsString()
    displayname?: string;

    @IsOptional()
    @IsString()
    contactEmail?: string;
}
