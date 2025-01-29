import { IsString, IsEmail, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserState } from '../../enums/UserState';

export class CreateBaseUserDto {
    @ApiProperty({
        description: 'User\'s first name',
        example: 'John'
    })
    @IsString()
    firstname!: string;

    @ApiProperty({
        description: 'User\'s last name',
        example: 'Doe'
    })
    @IsString()
    lastname!: string;

    @ApiProperty({
        description: 'User\'s contact email',
        example: 'john.doe@example.com'
    })
    @IsEmail()
    contactEmail!: string;

    @ApiProperty({
        description: 'User\'s state',
        enum: UserState,
        example: UserState.ACTIVE,
        default: UserState.PENDING,
        required: false
    })
    @IsEnum(UserState)
    @IsOptional()
    state?: UserState;

    @ApiProperty({
        description: 'ID of primary login credential',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    primaryLoginCredentialId?: string;

    @ApiProperty({
        description: 'Whether the user is enabled',
        example: true,
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
