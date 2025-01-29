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
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
