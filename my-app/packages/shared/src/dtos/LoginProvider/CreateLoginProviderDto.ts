import { IsString, IsBoolean, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginProviderDto {
    @ApiProperty({
        description: 'Provider code (e.g., "email", "google", "phone")',
        example: 'google',
        minLength: 1,
        maxLength: 50
    })
    @IsString()
    @Length(1, 50)
    code!: string;

    @ApiProperty({
        description: 'Display name of the provider',
        example: 'Google',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @Length(1, 255)
    name!: string;

    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
