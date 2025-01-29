import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Exclude()
export class ResponseLoginProviderDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

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
        example: true
    })
    isEnabled!: boolean;

    @Expose()
    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'Last modification timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    modifiedAt!: Date;
}
