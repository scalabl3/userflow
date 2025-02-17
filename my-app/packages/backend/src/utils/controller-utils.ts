import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { handleError, createErrorContext } from './error-handling';

/**
 * Base class for all controllers providing common functionality.
 * 
 * Core Features:
 * - Standardized error handling
 * - DTO transformation
 * - Resource-specific logging
 * - Common HTTP responses
 * 
 * Usage:
 * Extend this class to create controller classes with standardized:
 * - Error responses
 * - Response transformation
 * - Error logging
 * - Resource identification
 */
export abstract class ControllerBase {
    protected abstract readonly RESOURCE_NAME: string;
    protected abstract readonly logger: Logger;

    /**
     * Handle bad request errors with consistent format.
     * Logs error and throws BadRequestException.
     * 
     * @param message - Error message to display
     * @param operation - Name of the operation that failed
     * @param details - Optional additional error details
     * @throws BadRequestException with formatted message
     */
    protected handleBadRequest(message: string, operation: string, details?: Record<string, unknown>): never {
        const error = new BadRequestException(message);
        handleError(this.logger, error, createErrorContext(
            operation,
            this.RESOURCE_NAME,
            undefined,
            details
        ));
        throw error;
    }

    /**
     * Handle not found errors with consistent format.
     * Logs error and throws NotFoundException.
     * 
     * @param id - ID of the resource that wasn't found
     * @param operation - Name of the operation that failed
     * @throws NotFoundException with formatted message
     */
    protected handleNotFound(id: string, operation: string): never {
        const error = new NotFoundException(`${this.RESOURCE_NAME} with ID ${id} not found`);
        handleError(this.logger, error, createErrorContext(
            operation,
            this.RESOURCE_NAME,
            id
        ));
        throw error;
    }

    /**
     * Handle general errors with consistent format.
     * Logs error and throws appropriate exception.
     * 
     * @param error - Error that occurred
     * @param operation - Name of the operation that failed
     * @param entityId - Optional ID of related entity
     * @param details - Optional additional error details
     * @throws Appropriate exception based on error type
     */
    protected handleError(error: unknown, operation: string, entityId?: string, details?: Record<string, unknown>): never {
        handleError(this.logger, error, createErrorContext(
            operation,
            this.RESOURCE_NAME,
            entityId,
            details
        ));

        if (error instanceof NotFoundException ||
            error instanceof ConflictException ||
            error instanceof BadRequestException ||
            error instanceof InternalServerErrorException) {
            throw error;
        }

        throw new InternalServerErrorException('An unexpected error occurred');
    }

    /**
     * Transform entity to response DTO.
     * Uses class-transformer to convert entity to DTO.
     * 
     * @template T - Source entity type
     * @template R - Target DTO type
     * @param entity - Entity to transform
     * @param dtoClass - DTO class constructor
     * @returns Transformed DTO or null if entity is null/undefined
     */
    protected toResponseDto<T, R>(entity: T | null | undefined, dtoClass: ClassConstructor<R>): R | null {
        if (!entity) {
            return null;
        }
        return plainToClass(dtoClass, entity, { excludeExtraneousValues: true });
    }

    /**
     * Transform array of entities to response DTOs.
     * Uses class-transformer to convert entities to DTOs.
     * 
     * @template T - Source entity type
     * @template R - Target DTO type
     * @param entities - Array of entities to transform
     * @param dtoClass - DTO class constructor
     * @returns Array of transformed DTOs (empty array if input is null/undefined)
     */
    protected toResponseDtoArray<T, R>(entities: T[] | null | undefined, dtoClass: ClassConstructor<R>): R[] {
        if (!entities) {
            return [];
        }
        return entities.map(entity => this.toResponseDto(entity, dtoClass)!);
    }
} 