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
        description: 'Whether the user is enabled',
        example: true,
        default: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
