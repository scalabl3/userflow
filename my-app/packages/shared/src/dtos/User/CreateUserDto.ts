import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    firstname!: string;

    @IsString()
    lastname!: string;

    @IsString()
    displayname!: string;

    @IsString()
    contactEmail!: string;

    @IsOptional()
    preferences?: Record<string, any>;
}
