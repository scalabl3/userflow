import { IsString, IsEmail, IsEnum, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserState } from '../../enums/UserState';

export class UpdateBaseUserDto {
    @ApiProperty({
        description: 'User\'s first name',
        example: 'John',
        required: false
    })
    @IsString()
    @IsOptional()
    firstname?: string;

    @ApiProperty({
        description: 'User\'s last name',
        example: 'Doe',
        required: false
    })
    @IsString()
    @IsOptional()
    lastname?: string;

    @ApiProperty({
        description: 'User\'s contact email',
        example: 'john.doe@example.com',
        required: false
    })
    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @ApiProperty({
        description: 'User\'s state',
        enum: UserState,
        example: UserState.ACTIVE,
        required: false
    })
    @IsEnum(UserState)
    @IsOptional()
    state?: UserState;

    @ApiProperty({
        description: 'Whether the user is enabled',
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
