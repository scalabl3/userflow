import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingProviderType } from '../../enums/BillingProviderType';
import { BaseCreateDto, EnableableVisibilityDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class CreateBillingProviderDto extends EnableableVisibilityDto {
    @StandardString({
        description: 'Name of the billing provider',
        example: 'Stripe',
        required: true,
        minLength: 2,
        maxLength: 255
    })
    name!: string;

    @ApiProperty({
        description: 'Type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
        enumName: 'BillingProviderType',
        required: true
    })
    @IsEnum(BillingProviderType, { message: 'Invalid billing provider type' })
    @IsNotEmpty({ message: 'Provider type is required' })
    type!: BillingProviderType;
}
