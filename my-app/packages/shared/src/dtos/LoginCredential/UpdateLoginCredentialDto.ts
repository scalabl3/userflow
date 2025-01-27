import { IsString, Length, IsBoolean, IsOptional } from 'class-validator';

export class UpdateLoginCredentialDto {
    @IsString()
    @Length(1, 50)
    @IsOptional()
    username?: string;

    @IsString()
    @Length(8, 255)
    @IsOptional()
    password?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
