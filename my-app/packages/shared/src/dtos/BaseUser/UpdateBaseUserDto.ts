import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserState } from '../../enums/UserState';
import { EnableableDto } from '../base/BaseDto';
import { StandardString } from '../../utils/dto-utils';

export class UpdateBaseUserDto extends EnableableDto {
    @StandardString({
        description: 'User\'s first name',
        example: 'John',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    firstname?: string;

    @StandardString({
        description: 'User\'s last name',
        example: 'Doe',
        required: false,
        minLength: 1,
        maxLength: 255
    })
    lastname?: string;

    @ApiProperty({
        description: 'User\'s contact email',
        example: 'john.doe@example.com',
        required: false,
        format: 'email'
    })
    @IsEmail({}, { message: 'Must be a valid email address' })
    @IsOptional()
    contactEmail?: string;

    @ApiProperty({
        description: 'User\'s state',
        enum: UserState,
        example: UserState.ACTIVE,
        enumName: 'UserState',
        required: false
    })
    @IsEnum(UserState, { message: 'Must be a valid user state' })
    @IsOptional()
    state?: UserState;
}
