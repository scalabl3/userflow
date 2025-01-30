import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserState } from '../../enums/UserState';

@Exclude()
export class ResponseBaseUserDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s first name',
        example: 'John'
    })
    firstname!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s last name',
        example: 'Doe'
    })
    lastname!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s contact email',
        example: 'john.doe@example.com'
    })
    contactEmail!: string;

    @Expose()
    @ApiProperty({
        description: 'User\'s current state',
        enum: UserState,
        example: UserState.ACTIVE
    })
    state!: UserState;

    @Expose()
    @ApiProperty({
        description: 'Last login timestamp',
        example: '2024-01-28T12:00:00.000Z',
        required: false
    })
    lastLoginAt?: Date;

    @Expose()
    @ApiProperty({
        description: 'Whether the user is enabled',
        example: true
    })
    isEnabled!: boolean;

    @Expose()
    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'Last modification timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    modifiedAt!: Date;
}
