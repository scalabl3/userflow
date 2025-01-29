import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository, DataSource, QueryRunner, Not, FindOptionsWhere, DeepPartial } from 'typeorm';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { handleError, createErrorContext } from './error-handling';

@Injectable()
export abstract class ServiceBase<T extends { id: string }> {
    protected abstract readonly ENTITY_NAME: string;
    protected abstract readonly logger: Logger;
    protected abstract readonly repository: Repository<T>;
    protected abstract readonly dataSource: DataSource;

    // Transaction Management
    protected async withTransaction<R>(
        operation: (queryRunner: QueryRunner) => Promise<R>,
        context: string,
        entityId?: string,
        details?: Record<string, unknown>
    ): Promise<R> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await operation(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<R>(
                this.logger,
                error,
                createErrorContext(context, this.ENTITY_NAME, entityId, details)
            );
            throw handled;
        } finally {
            await queryRunner.release();
        }
    }

    // Entity Validation
    protected async validateUniqueness(
        field: keyof T & string,
        value: any,
        id?: string,
        customMessage?: string
    ): Promise<void> {
        const where: FindOptionsWhere<T> = {
            [field]: value
        } as FindOptionsWhere<T>;

        if (id) {
            where.id = Not(id) as any;
        }

        const existing = await this.repository.findOne({ where });

        if (existing) {
            throw new ConflictException(
                customMessage || `${this.ENTITY_NAME} with ${String(field)} '${value}' already exists`
            );
        }
    }

    protected async validateExists(id: string, customMessage?: string): Promise<T> {
        const entity = await this.repository.findOne({ 
            where: { id: id } as FindOptionsWhere<T>
        });
        if (!entity) {
            throw new NotFoundException(
                customMessage || `${this.ENTITY_NAME} with ID ${id} not found`
            );
        }
        return entity;
    }

    // Change Tracking
    protected logChanges(
        original: T,
        updated: DeepPartial<T>,
        context: string
    ): void {
        const changes = Object.entries(updated as Record<string, any>)
            .filter(([key, value]) => (original as any)[key] !== value)
            .map(([key, value]) => `${key}: ${(original as any)[key]} -> ${value}`);
        
        if (changes.length > 0) {
            this.logger.debug(
                `${context} - Changes to ${this.ENTITY_NAME} ${original.id}:`,
                { changes }
            );
        }
    }

    // Response Transformation
    protected toResponseDto<R>(
        data: T | null | undefined,
        dtoClass: ClassConstructor<R>
    ): R | null {
        if (!data) {
            return null;
        }
        return plainToClass(dtoClass, data, { excludeExtraneousValues: true });
    }

    protected toResponseDtoArray<R>(
        data: T[] | null | undefined,
        dtoClass: ClassConstructor<R>
    ): R[] {
        if (!data) {
            return [];
        }
        return data.map(item => this.toResponseDto(item, dtoClass)!);
    }

    // Standard CRUD Operations
    public async findOneById(id: string): Promise<T | null> {
        try {
            const entity = await this.validateExists(id);
            this.logger.debug(`Retrieved ${this.ENTITY_NAME}`, { id });
            return entity;
        } catch (error) {
            if (error instanceof NotFoundException) {
                return null;
            }
            throw error;
        }
    }

    // Alias for findOneById for backward compatibility
    public async findOne(id: string): Promise<T | null> {
        return this.findOneById(id);
    }

    public async findAll(): Promise<T[]> {
        const entities = await this.repository.find();
        this.logger.debug(`Retrieved all ${this.ENTITY_NAME}s`, { count: entities.length });
        return entities;
    }

    public async create(data: DeepPartial<T>, queryRunner?: QueryRunner): Promise<T> {
        const repo = queryRunner?.manager.getRepository(this.repository.target) || this.repository;
        const entity = repo.create(data);
        const saved = await repo.save(entity);
        this.logger.debug(`Created ${this.ENTITY_NAME}`, { id: saved.id });
        return saved;
    }

    public async update(
        id: string,
        data: DeepPartial<T>,
        queryRunner?: QueryRunner
    ): Promise<T | null> {
        try {
            const repo = queryRunner?.manager.getRepository(this.repository.target) || this.repository;
            const existing = await this.validateExists(id);
            
            this.logChanges(existing, data, 'update');
            
            const updated = await repo.save({
                ...existing,
                ...data
            } as T);
            
            this.logger.debug(`Updated ${this.ENTITY_NAME}`, { id });
            return updated;
        } catch (error) {
            if (error instanceof NotFoundException) {
                return null;
            }
            throw error;
        }
    }

    public async remove(id: string, queryRunner?: QueryRunner): Promise<boolean> {
        try {
            const repo = queryRunner?.manager.getRepository(this.repository.target) || this.repository;
            const entity = await this.validateExists(id);
            await repo.remove(entity);
            this.logger.debug(`Removed ${this.ENTITY_NAME}`, { id });
            return true;
        } catch (error) {
            if (error instanceof NotFoundException) {
                return false;
            }
            throw error;
        }
    }
} 
