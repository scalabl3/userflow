import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { handleError, createErrorContext } from './error-handling';

export abstract class ControllerBase {
    protected abstract readonly RESOURCE_NAME: string;
    protected abstract readonly logger: Logger;

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

    protected handleNotFound(id: string, operation: string): never {
        const error = new NotFoundException(`${this.RESOURCE_NAME} with ID ${id} not found`);
        handleError(this.logger, error, createErrorContext(
            operation,
            this.RESOURCE_NAME,
            id
        ));
        throw error;
    }

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

    protected toResponseDto<T, R>(entity: T | null | undefined, dtoClass: ClassConstructor<R>): R | null {
        if (!entity) {
            return null;
        }
        return plainToClass(dtoClass, entity, { excludeExtraneousValues: true });
    }

    protected toResponseDtoArray<T, R>(entities: T[] | null | undefined, dtoClass: ClassConstructor<R>): R[] {
        if (!entities) {
            return [];
        }
        return entities.map(entity => this.toResponseDto(entity, dtoClass)!);
    }
} 