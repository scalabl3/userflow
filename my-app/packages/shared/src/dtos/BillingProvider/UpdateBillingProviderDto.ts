import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingProviderType } from '../../enums/BillingProviderType';
import { BaseUpdateDto, EnableableVisibilityDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class UpdateBillingProviderDto extends EnableableVisibilityDto {
    @StandardString({
        description: 'Name of the billing provider',
        example: 'Stripe',
        required: false,
        minLength: 2,
        maxLength: 255
    })
    name?: string;

    @ApiProperty({
        description: 'Type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
        enumName: 'BillingProviderType',
        required: false
    })
    @IsEnum(BillingProviderType, { message: 'Invalid billing provider type' })
    @IsOptional()
    type?: BillingProviderType;
}
