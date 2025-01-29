import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
    // Base user fields
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
    @IsString()
    contactEmail!: string;

    // User fields
    @ApiProperty({
        description: 'User\'s unique username',
        example: 'johndoe'
    })
    @IsString()
    username!: string;

    @ApiProperty({
        description: 'User\'s display name',
        example: 'John Doe'
    })
    @IsString()
    displayname!: string;

    @ApiProperty({
        description: 'ID of the associated organization',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    organizationId!: string;

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
