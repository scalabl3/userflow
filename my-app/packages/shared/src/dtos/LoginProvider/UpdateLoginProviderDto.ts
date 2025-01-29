import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLoginProviderDto {
    @ApiProperty({
        description: 'Provider code (e.g., "email", "google", "phone")',
        example: 'google',
        minLength: 1,
        maxLength: 50,
        required: false
    })
    @IsString()
    @Length(1, 50)
    @IsOptional()
    code?: string;

    @ApiProperty({
        description: 'Display name of the provider',
        example: 'Google',
        minLength: 1,
        maxLength: 255,
        required: false
    })
    @IsString()
    @Length(1, 255)
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
