import { IsString, IsBoolean, IsUUID, IsDate, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from '../User/ResponseUserDto';

export class ResponseOrganizationDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'Organization name',
        example: 'Acme Corporation',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @Length(1, 255)
    name!: string;

    @Expose()
    @ApiProperty({
        description: 'Whether the organization is visible',
        example: true,
        default: false
    })
    @IsBoolean()
    visible!: boolean;

    @Expose()
    @ApiProperty({
        description: 'ID of the admin user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    adminUser!: string;

    @Expose()
    @Type(() => ResponseUserDto)
    @ApiProperty({
        description: 'Users belonging to this organization',
        type: [ResponseUserDto],
        required: false
    })
    users?: ResponseUserDto[];

    @Expose()
    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    @IsDate()
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'Last modification timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    @IsDate()
    modifiedAt!: Date;
}
