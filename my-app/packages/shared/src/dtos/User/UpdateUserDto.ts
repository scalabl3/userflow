import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateBaseUserDto } from '../BaseUser/UpdateBaseUserDto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends UpdateBaseUserDto {
    @ApiProperty({
        description: 'User\'s unique username',
        example: 'johndoe',
        required: false
    })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({
        description: 'User\'s display name',
        example: 'John Doe',
        required: false
    })
    @IsOptional()
    @IsString()
    displayname?: string;

    @ApiProperty({
        description: 'ID of the associated organization',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @ApiProperty({
        description: 'User preferences',
        example: {
            theme: 'light',
            notifications: {
                email: true,
                push: true
            }
        },
        required: false
    })
    @IsOptional()
    @IsObject()
    @Type(() => Object)
    preferences?: {
        theme?: 'light' | 'dark';
        notifications?: {
            email?: boolean;
            push?: boolean;
        };
    };
}
