import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * Base class for all Response DTOs
 */
@Exclude()
export class BaseResponseDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

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

/**
 * Base class for all Create DTOs
 */
export class BaseCreateDto {
    // Base class for common create fields
    // Currently empty as we don't have common create fields
    // but useful for future extensions
}

/**
 * Base class for all Update DTOs
 */
export class BaseUpdateDto {
    // Base class for common update fields
    // Currently empty as we don't have common update fields
    // but useful for future extensions
}

/**
 * Base class for entities with enable/disable functionality
 */
export class EnableableDto {
    @ApiProperty({
        description: 'Whether the entity is enabled',
        example: true,
        default: true
    })
    isEnabled?: boolean = true;
}

/**
 * Base class for entities with visibility control
 */
export class VisibilityDto {
    @ApiProperty({
        description: 'Whether the entity is visible',
        example: true,
        default: false
    })
    visible?: boolean = false;
}

/**
 * Base class for entities with both enable and visibility control
 */
export class EnableableVisibilityDto extends EnableableDto {
    @ApiProperty({
        description: 'Whether the entity is visible',
        example: true,
        default: false
    })
    visible?: boolean = false;
} 