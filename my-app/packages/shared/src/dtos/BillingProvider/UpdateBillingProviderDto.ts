import { IsOptional, IsString, IsEnum, IsBoolean, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingProviderType } from '../../enums/BillingProviderType';

export class UpdateBillingProviderDto {
    @ApiProperty({
        description: 'Name of the billing provider',
        example: 'Stripe',
        required: false,
        minLength: 2,
        maxLength: 255
    })
    @IsString()
    @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
        required: false
    })
    @IsEnum(BillingProviderType)
    @IsOptional()
    type?: BillingProviderType;

    @ApiProperty({
        description: 'Whether the provider is enabled',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;

    @ApiProperty({
        description: 'Whether the provider is visible to users',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    visible?: boolean;
}
