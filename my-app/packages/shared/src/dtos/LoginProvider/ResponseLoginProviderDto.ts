import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseResponseDto } from '../base/BaseDto';

@Exclude()
export class ResponseLoginProviderDto extends BaseResponseDto {
    @Expose()
    @ApiProperty({
        description: 'Provider code (e.g., "email", "google", "phone")',
        example: 'google',
        minLength: 1,
        maxLength: 50
    })
    code!: string;

    @Expose()
    @ApiProperty({
        description: 'Display name of the provider',
        example: 'Google',
        minLength: 1,
        maxLength: 255
    })
    name!: string;

    @Expose()
    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
        type: Boolean
    })
    isEnabled!: boolean;
}
