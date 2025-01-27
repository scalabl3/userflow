import { IsString, Length, IsBoolean, IsOptional } from 'class-validator';

export class CreateLoginCredentialDto {
    @IsString()
    @Length(1, 50)
    username!: string;

    @IsString()
    @Length(8, 255)
    password!: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
