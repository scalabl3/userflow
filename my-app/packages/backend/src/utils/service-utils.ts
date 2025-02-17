import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    InternalServerErrorException
} from '@nestjs/common';
import { Repository, QueryRunner, DeepPartial, ObjectLiteral } from 'typeorm';
import { plainToClass } from 'class-transformer';
import {
    OperationType,
    OperationResult,
    ServiceErrorCode,
    OperationLogContext,
    ServiceError
} from '../constants/service-operations';
import { createServiceLogger } from './logging';

/**
 * Base class for all services providing common functionality.
 * 
 * Core Features:
 * - Transaction management
 * - Error handling and logging
 * - Access control validation
 * - Entity CRUD operations
 * - Change tracking
 * - DTO transformation
 * 
 * Usage:
 * Extend this class to create service classes with standardized:
 * - Error handling
 * - Logging
 * - Transaction management
 * - Entity validation
 * - Access control
 * 
 * @template T - Entity type extending ObjectLiteral
 */
export abstract class ServiceBase<T extends ObjectLiteral> {
    protected abstract readonly ENTITY_NAME: string;
    protected abstract readonly repository: Repository<T>;
    protected abstract readonly defaultRelations: string[];
    private _serviceLogger?: ReturnType<typeof createServiceLogger>;

    /**
     * Get or create the service logger instance.
     * Lazy initialization of logger to ensure proper setup.
     * 
     * @returns Service logger instance
     */
    protected get serviceLogger() {
        if (!this._serviceLogger) {
            this._serviceLogger = createServiceLogger(this.ENTITY_NAME);
        }
        return this._serviceLogger;
    }

    /**
     * Initialize the service logger.
     * Should be called in service constructor.
     */
    protected initializeLogger(): void {
        // Initialize the logger by accessing the getter
        this.serviceLogger;
    }

    /**
     * Execute an operation within a transaction.
     * Handles transaction lifecycle and error logging.
     * 
     * @template R - Return type of the operation
     * @param operation - Function to execute within transaction
     * @param operationType - Type of operation being performed
     * @param operationName - Name of the operation for logging
     * @param context - Additional context for logging
     * @returns Result of the operation
     * @throws Various exceptions based on operation
     */
    protected async withTransaction<R>(
        operation: (queryRunner: QueryRunner) => Promise<R>,
        operationType: OperationType,
        operationName: string,
        context: OperationLogContext = {}
    ): Promise<R> {
        const queryRunner = this.repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await operation(queryRunner);
            await queryRunner.commitTransaction();

            this.logOperation(operationType, operationName, OperationResult.SUCCESS, context);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.handleError(error as Error, operationType, operationName, context);
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Standard error handling for service operations.
     * Logs errors and transforms them into appropriate HTTP exceptions.
     * 
     * @param error - Error that occurred
     * @param operationType - Type of operation that failed
     * @param operation - Name of the operation
     * @param context - Additional context for logging
     * @throws Appropriate HTTP exception
     */
    protected handleError(
        error: Error,
        operationType: OperationType,
        operation: string,
        context: Record<string, any>
    ): never {
        this.logOperation(operationType, operation, OperationResult.FAILURE, context);

        if (error instanceof BadRequestException ||
            error instanceof NotFoundException ||
            error instanceof UnauthorizedException) {
            throw error;
        }

        throw new InternalServerErrorException({
            code: ServiceErrorCode.SYSTEM_ERROR,
            message: 'An unexpected error occurred',
            details: { operation }
        });
    }

    /**
     * Standard logging for service operations.
     * Provides consistent logging format across services.
     * 
     * @param operationType - Type of operation being logged
     * @param operation - Name of the operation
     * @param result - Result of the operation
     * @param context - Additional context to log
     */
    protected logOperation(
        operationType: OperationType,
        operation: string,
        result: OperationResult,
        context: OperationLogContext
    ): void {
        this.serviceLogger.logOperation(operationType, operation, result, context);
    }

    /**
     * Validate operation access.
     * Base implementation for role-based access control.
     * 
     * @param operationType - Type of operation to validate
     * @param userId - ID of user making the request
     * @param organizationId - Optional organization context
     * @throws UnauthorizedException if access denied
     */
    protected async validateAccess(
        operationType: OperationType,
        userId: string,
        organizationId?: string
    ): Promise<void> {
        // This is a placeholder - actual implementation will be added
        // when we implement the authorization system
        this.logOperation(operationType, 'validateAccess', OperationResult.SUCCESS, {
            userId,
            organizationId
        });
    }

    /**
     * Standard existence validation.
     * Checks if entity exists with given ID.
     * 
     * @param id - Entity ID to check
     * @returns Entity if found
     * @throws NotFoundException if entity not found
     */
    protected async validateExists(id: string): Promise<T> {
        const entity = await this.repository.findOne({
            where: { id } as any,
            relations: this.defaultRelations
        });

        if (!entity) {
            throw new NotFoundException({
                code: ServiceErrorCode.NOT_FOUND,
                message: `${this.ENTITY_NAME} not found`,
                details: { id }
            });
        }

        return entity;
    }

    /**
     * Standard uniqueness validation.
     * Checks if field value is unique for entity type.
     * 
     * @param field - Field name to check
     * @param value - Value to validate
     * @param excludeId - Optional ID to exclude from check
     * @throws BadRequestException if value not unique
     */
    protected async validateUniqueness(
        field: string,
        value: string,
        excludeId?: string
    ): Promise<void> {
        const where: any = { [field]: value };
        if (excludeId) {
            where.id = { $ne: excludeId };
        }

        const exists = await this.repository.findOne({ where });
        if (exists) {
            throw new BadRequestException({
                code: ServiceErrorCode.ALREADY_EXISTS,
                message: `${this.ENTITY_NAME} with this ${field} already exists`,
                details: { field, value }
            });
        }
    }

    /**
     * Transform entity to response DTO.
     * Uses class-transformer to convert entity to DTO.
     * 
     * @template D - DTO type
     * @param entity - Entity to transform
     * @param dto - DTO class constructor
     * @returns Transformed DTO instance
     */
    protected toResponseDto<D>(entity: T, dto: new () => D): D {
        return plainToClass(dto, entity, {
            excludeExtraneousValues: true
        });
    }

    /**
     * Base create method.
     * Creates new entity with transaction support.
     * 
     * @param data - Entity data to create
     * @param queryRunner - Optional transaction query runner
     * @returns Created entity
     */
    protected async create(
        data: DeepPartial<T>,
        queryRunner?: QueryRunner
    ): Promise<T> {
        const repo = queryRunner?.manager.getRepository<T>(this.repository.target) || this.repository;
        const entity = repo.create(data);
        return repo.save(entity);
    }

    /**
     * Base update method.
     * Updates entity with transaction support.
     * 
     * @param id - Entity ID to update
     * @param data - Update data
     * @param queryRunner - Optional transaction query runner
     * @returns Updated entity
     * @throws NotFoundException if entity not found
     */
    protected async update(
        id: string,
        data: DeepPartial<T>,
        queryRunner?: QueryRunner
    ): Promise<T> {
        const repo = queryRunner?.manager.getRepository<T>(this.repository.target) || this.repository;
        await repo.update(id, data as any);
        return this.validateExists(id);
    }

    /**
     * Standard change tracking for entity updates.
     * Compares original and updated entities to track specific changes.
     * Handles nested objects and sensitive fields.
     * 
     * @param original - Original entity before update
     * @param updated - Updated entity data (partial)
     * @param operationType - Type of operation being performed
     * @param operationName - Name of the operation
     * @param requestingUserId - ID of the user making the request
     * @param targetId - ID of the entity being modified
     * @param additionalMetadata - Any additional metadata to include in the log
     */
    protected logEntityChanges(
        original: T,
        updated: DeepPartial<T>,
        operationType: OperationType,
        operationName: string,
        requestingUserId: string,
        targetId: string,
        additionalMetadata: Record<string, any> = {}
    ): void {
        const changes: string[] = [];
        const metadata: Record<string, any> = {
            ...additionalMetadata
        };

        // Track changes by comparing fields
        Object.keys(updated).forEach(field => {
            const newValue = (updated as any)[field];
            const oldValue = (original as any)[field];

            // Handle nested objects (like relations)
            if (typeof newValue === 'object' && newValue !== null) {
                if ('id' in newValue) {
                    // Compare IDs for related entities
                    const newId = newValue.id;
                    const oldId = oldValue?.id;
                    if (newId !== oldId) {
                        changes.push(field);
                        metadata[`${field}Changed`] = true;
                        metadata[`original${field.charAt(0).toUpperCase() + field.slice(1)}`] = oldId;
                        metadata[`new${field.charAt(0).toUpperCase() + field.slice(1)}`] = newId;
                    }
                }
            } else if (newValue !== oldValue) {
                changes.push(field);
                metadata[`${field}Changed`] = true;
                
                // Only include old/new values for non-sensitive fields
                if (!this.isSensitiveField(field)) {
                    metadata[`original${field.charAt(0).toUpperCase() + field.slice(1)}`] = oldValue;
                    metadata[`new${field.charAt(0).toUpperCase() + field.slice(1)}`] = newValue;
                }
            }
        });

        if (changes.length > 0) {
            this.logOperation(
                operationType,
                operationName,
                OperationResult.SUCCESS,
                {
                    userId: requestingUserId,
                    targetId,
                    changes,
                    metadata
                }
            );
        }
    }

    /**
     * Check if a field should be considered sensitive
     * Override in derived classes to specify sensitive fields
     */
    protected isSensitiveField(field: string): boolean {
        const sensitiveFields = [
            'password',
            'token',
            'secret',
            'key',
            'credential',
            'hash',
            'salt'
        ];
        return sensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive));
    }
} 
