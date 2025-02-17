/**
 * Base Data Transfer Object (DTO) classes for standardized data transfer.
 * Provides foundational structures for all DTOs in the system.
 * 
 * Core Features:
 * - Common field definitions
 * - Swagger/OpenAPI documentation
 * - Class transformation decorators
 * - Standard property patterns
 * 
 * Categories:
 * 1. Response DTOs: Standard response structure
 * 2. Create DTOs: Creation operation base
 * 3. Update DTOs: Update operation base
 * 4. Feature DTOs: Enable/Disable and Visibility
 * 
 * Usage:
 * - API response standardization
 * - Request validation
 * - Documentation generation
 * - Type safety enforcement
 */

import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

/**
 * Base class for all Response DTOs.
 * Provides standard response fields with Swagger documentation.
 * 
 * Core Features:
 * - Unique identifier
 * - Timestamp tracking
 * - Class transformation control
 * 
 * Usage:
 * - API response objects
 * - Entity data transfer
 * - Response serialization
 * 
 * @class
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
 * Base class for all Create DTOs.
 * Provides structure for entity creation operations.
 * 
 * Core Features:
 * - Common creation fields
 * - Extensibility support
 * 
 * Usage:
 * - Entity creation requests
 * - Data validation
 * - Request standardization
 * 
 * @class
 */
export class BaseCreateDto {
    // Base class for common create fields
    // Currently empty as we don't have common create fields
    // but useful for future extensions
}

/**
 * Base class for all Update DTOs.
 * Provides structure for entity update operations.
 * 
 * Core Features:
 * - Common update fields
 * - Partial update support
 * 
 * Usage:
 * - Entity update requests
 * - Patch operations
 * - Field validation
 * 
 * @class
 */
export class BaseUpdateDto {
    // Base class for common update fields
    // Currently empty as we don't have common update fields
    // but useful for future extensions
}

/**
 * Base class for entities with enable/disable functionality.
 * Provides standard enabled state management.
 * 
 * Core Features:
 * - Enable/disable flag
 * - Default state control
 * - Swagger documentation
 * 
 * Usage:
 * - Feature toggles
 * - Access control
 * - State management
 * 
 * @class
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
 * Base class for entities with visibility control.
 * Provides standard visibility state management.
 * 
 * Core Features:
 * - Visibility flag
 * - Default state control
 * - Swagger documentation
 * 
 * Usage:
 * - Content visibility
 * - UI display control
 * - Access management
 * 
 * @class
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
 * Base class for entities with both enable and visibility control.
 * Combines enable/disable and visibility functionality.
 * 
 * Core Features:
 * - Combined state management
 * - Inherited enable/disable
 * - Independent visibility
 * 
 * Usage:
 * - Complex state management
 * - Feature visibility control
 * - Access and display management
 * 
 * @class
 */
export class EnableableVisibilityDto extends EnableableDto {
    @ApiProperty({
        description: 'Whether the entity is visible',
        example: true,
        default: false
    })
    visible?: boolean = false;
} 