import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
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

    @IsOptional()
    preferences?: Record<string, any>;
}
