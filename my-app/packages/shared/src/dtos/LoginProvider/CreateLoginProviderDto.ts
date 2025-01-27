import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';

export class CreateLoginProviderDto {
    @IsString()
    @Length(1, 50)
    code!: string;

    @IsString()
    @Length(1, 255)
    name!: string;

    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
