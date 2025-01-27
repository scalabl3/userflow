import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';

export class UpdateLoginProviderDto {
    @IsString()
    @Length(1, 50)
    @IsOptional()
    code?: string;

    @IsString()
    @Length(1, 255)
    @IsOptional()
    name?: string;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
