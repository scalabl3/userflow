import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BillingProviderType } from '../../enums/BillingProviderType';
import { BaseResponseDto } from '../base/BaseDto';

@Exclude()
export class ResponseBillingProviderDto extends BaseResponseDto {
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
}
