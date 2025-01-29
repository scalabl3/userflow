import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseBaseUserDto } from '../BaseUser/ResponseBaseUserDto';
import { ResponseOrganizationDto } from '../Organization/ResponseOrganizationDto';

export class ResponseUserDto extends ResponseBaseUserDto {
    @Expose()
    @ApiProperty({
        description: 'User\'s unique username',
        example: 'johndoe'
    })
    username!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s display name',
        example: 'John Doe'
    })
    displayname!: string;

    @Expose()
    @ApiProperty({
        description: 'ID of the associated organization',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    organizationId!: string;

    @Expose()
    @Type(() => ResponseOrganizationDto)
    @ApiProperty({
        description: 'Associated organization details',
        type: () => ResponseOrganizationDto
    })
    organization?: ResponseOrganizationDto;

    @Expose()
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
    preferences?: {
        theme?: 'light' | 'dark';
        notifications?: {
            email?: boolean;
            push?: boolean;
        };
    };
}
