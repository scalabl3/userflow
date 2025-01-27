import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class CreateUserDto {
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

    // Base user fields that can be set on creation
    @IsString()
    firstname!: string;

    @IsString()
    lastname!: string;

    @IsString()
    displayname!: string;

    @IsString()
    contactEmail!: string;
}
