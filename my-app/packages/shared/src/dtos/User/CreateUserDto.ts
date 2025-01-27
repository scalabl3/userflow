import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class CreateUserDto {
    // Base user fields
    @IsString()
    firstname!: string;

    @IsString()
    lastname!: string;

    @IsString()
    contactEmail!: string;

    // User fields
    @IsString()
    username!: string;

    @IsString()
    displayname!: string;

    @IsUUID()
    organizationId!: string;

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
