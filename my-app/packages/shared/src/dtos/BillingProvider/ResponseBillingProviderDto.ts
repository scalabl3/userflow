import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BillingProviderType } from '../../enums/BillingProviderType';

@Exclude()
export class ResponseBillingProviderDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier of the billing provider',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid'
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'Name of the billing provider',
        example: 'Stripe',
        minLength: 2,
        maxLength: 255
    })
    name!: string;

    @Expose()
    @ApiProperty({
        description: 'Type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
        enumName: 'BillingProviderType'
    })
    type!: BillingProviderType;

    @Expose()
    @ApiProperty({
        description: 'Whether the provider is enabled for system use',
        example: true,
        type: Boolean
    })
    isEnabled!: boolean;

    @Expose()
    @ApiProperty({
        description: 'Whether the provider is visible to users in the system',
        example: true,
        type: Boolean
    })
    visible!: boolean;

    @Expose()
    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-28T12:00:00.000Z',
        format: 'date-time'
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'Last modification timestamp',
        example: '2024-01-28T12:00:00.000Z',
        format: 'date-time'
    })
    modifiedAt!: Date;
}
