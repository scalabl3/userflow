import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingProviderType } from '../../enums/BillingProviderType';

export class CreateBillingProviderDto {
    @ApiProperty({
        description: 'Name of the billing provider',
        example: 'Stripe',
        minLength: 2,
        maxLength: 255
    })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    @Length(2, 255, { message: 'Name must be between 2 and 255 characters' })
    name!: string;

    @ApiProperty({
        description: 'Type of billing provider',
        enum: BillingProviderType,
        example: BillingProviderType.STRIPE,
        required: true
    })
    @IsEnum(BillingProviderType, { message: 'Invalid billing provider type' })
    @IsNotEmpty({ message: 'Provider type is required' })
    type!: BillingProviderType;

    @ApiProperty({
        description: 'Whether the provider is enabled for system use',
        default: true,
        required: false
    })
    @IsBoolean({ message: 'isEnabled must be a boolean value' })
    @IsOptional()
    isEnabled?: boolean;

    @ApiProperty({
        description: 'Whether the provider is visible to users in the system',
        default: true,
        required: false
    })
    @IsBoolean({ message: 'visible must be a boolean value' })
    @IsOptional()
    visible?: boolean;
}
