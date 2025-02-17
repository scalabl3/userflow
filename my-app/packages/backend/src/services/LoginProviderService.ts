import { Injectable, BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial, Not } from 'typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';
import { ServiceBase } from '../utils/service-utils';
import { OperationType, ServiceErrorCode, OperationResult } from '../constants/service-operations';

/**
 * Service for managing login provider entities.
 * 
 * Core Features:
 * - Provider CRUD operations
 * - Provider status management
 * - Provider visibility control
 * - Credential validation
 * - Provider code uniqueness
 * 
 * Operation Types (Maps to Role-Based Access):
 * - SYSTEM_OP:
 *   - createLoginProvider: Create new providers
 *   - removeLoginProvider: Remove providers
 *   - softDeleteLoginProvider: Soft delete providers
 *   - toggleProviderStatus: Enable/disable providers
 * 
 * - ADMIN_OP:
 *   - updateLoginProvider: Update provider settings
 *   - findAllLoginProviders: List all providers
 * 
 * - USER_OP:
 *   - findOneLoginProvider: View provider details
 *   - findByCode: Find provider by code
 */
@Injectable()
export class LoginProviderService extends ServiceBase<LoginProvider> {
    protected readonly ENTITY_NAME = 'LoginProvider';
    protected readonly defaultRelations = ['credentials'];

    constructor(
        @InjectRepository(LoginProvider)
        protected readonly repository: Repository<LoginProvider>,
        protected readonly dataSource: DataSource,
    ) {
        super();
        this.initializeLogger();
    }

    /**
     * Find all login providers in the system.
     * Requires Organization Administrator role (ADMIN_OP).
     * 
     * @param requestingUserId - ID of the admin user making the request
     * @returns Array of login providers transformed to DTOs
     * @throws UnauthorizedException if user lacks admin access
     */
    async findAllLoginProviders(requestingUserId: string): Promise<ResponseLoginProviderDto[]> {
        await this.validateAccess(OperationType.ADMIN, requestingUserId);
        
        const providers = await this.repository.find({
            relations: this.defaultRelations
        });
        
        this.logOperation(
            OperationType.ADMIN,
            'findAllLoginProviders',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { count: providers.length }
            }
        );
        
        return providers.map(provider => this.toResponseDto(provider, ResponseLoginProviderDto));
    }

    /**
     * Find a login provider by ID.
     * Regular users can view provider details.
     * 
     * @param id - Provider ID to find
     * @param requestingUserId - ID of the user making the request
     * @returns Provider DTO if found
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if provider not found
     */
    async findOneLoginProvider(id: string, requestingUserId: string): Promise<ResponseLoginProviderDto | null> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        const provider = await this.validateExists(id);
        
        this.logOperation(
            OperationType.USER,
            'findOneLoginProvider',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                targetId: id
            }
        );
        
        return this.toResponseDto(provider, ResponseLoginProviderDto);
    }

    /**
     * Create a new login provider.
     * Requires system-level access (SYSTEM_OP).
     * 
     * @param createDto - Provider creation data
     * @param requestingUserId - ID of the system user making the request
     * @returns Created provider DTO
     * @throws UnauthorizedException if user lacks system access
     * @throws ConflictException if provider code already exists
     */
    async createLoginProvider(createDto: CreateLoginProviderDto, requestingUserId: string): Promise<ResponseLoginProviderDto> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                await this.validateUniqueness('code', createDto.code);
                
                const entity = await this.create(createDto as DeepPartial<LoginProvider>, queryRunner);
                
                this.logOperation(
                    OperationType.SYSTEM,
                    'createLoginProvider',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: entity.id,
                        changes: Object.keys(createDto)
                    }
                );
                
                return this.toResponseDto(entity, ResponseLoginProviderDto);
            },
            OperationType.SYSTEM,
            'createLoginProvider',
            {
                userId: requestingUserId,
                changes: Object.keys(createDto)
            }
        );
    }

    /**
     * Update a login provider.
     * Requires organization admin access (ADMIN_OP).
     * 
     * @param id - Provider ID to update
     * @param updateDto - Update data
     * @param requestingUserId - ID of the admin user making the request
     * @returns Updated provider DTO
     * @throws UnauthorizedException if user lacks admin access
     * @throws NotFoundException if provider not found
     * @throws ConflictException if provider code already exists
     */
    async updateLoginProvider(
        id: string,
        updateDto: UpdateLoginProviderDto,
        requestingUserId: string
    ): Promise<ResponseLoginProviderDto> {
        await this.validateAccess(OperationType.ADMIN, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const provider = await this.validateExists(id);
                
                if (updateDto.code && updateDto.code !== provider.code) {
                    await this.validateUniqueness('code', updateDto.code, id);
                }
                
                const entityData = updateDto as DeepPartial<LoginProvider>;
                const entity = await this.update(id, entityData, queryRunner);
                
                this.logEntityChanges(
                    provider,
                    entityData,
                    OperationType.ADMIN,
                    'updateLoginProvider',
                    requestingUserId,
                    id
                );
                
                return this.toResponseDto(entity!, ResponseLoginProviderDto);
            },
            OperationType.ADMIN,
            'updateLoginProvider',
            {
                userId: requestingUserId,
                targetId: id,
                changes: Object.keys(updateDto)
            }
        );
    }

    /**
     * Remove a login provider.
     * Requires system-level access (SYSTEM_OP).
     * Provider must have no active credentials.
     * 
     * @param id - Provider ID to remove
     * @param requestingUserId - ID of the system user making the request
     * @throws UnauthorizedException if user lacks system access
     * @throws NotFoundException if provider not found
     * @throws BadRequestException if provider has active credentials
     */
    async removeLoginProvider(id: string, requestingUserId: string): Promise<void> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const provider = await this.validateExists(id);
                await this.validateNoActiveCredentials(provider);
                
                await queryRunner.manager.remove(provider);
                
                this.logOperation(
                    OperationType.SYSTEM,
                    'removeLoginProvider',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id,
                        metadata: { code: provider.code }
                    }
                );
            },
            OperationType.SYSTEM,
            'removeLoginProvider',
            {
                userId: requestingUserId,
                targetId: id
            }
        );
    }

    /**
     * Find a provider by code.
     * Regular users can view provider details.
     * 
     * @param code - Provider code to find
     * @param requestingUserId - ID of the user making the request
     * @returns Provider DTO if found
     * @throws UnauthorizedException if access denied
     */
    async findByCode(code: string, requestingUserId: string): Promise<ResponseLoginProviderDto | null> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        const provider = await this.repository.findOne({
            where: { code },
            relations: this.defaultRelations
        });
        
        this.logOperation(
            OperationType.USER,
            'findByCode',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { code }
            }
        );
        
        return provider ? this.toResponseDto(provider, ResponseLoginProviderDto) : null;
    }

    /**
     * Toggle provider enabled status.
     * Requires system-level access (SYSTEM_OP).
     * Cannot disable provider with active credentials.
     * 
     * @param id - Provider ID to update
     * @param isEnabled - New enabled status
     * @param requestingUserId - ID of the system user making the request
     * @returns Updated provider DTO
     * @throws UnauthorizedException if user lacks system access
     * @throws NotFoundException if provider not found
     * @throws BadRequestException if disabling with active credentials
     */
    async toggleProviderStatus(
        id: string,
        isEnabled: boolean,
        requestingUserId: string
    ): Promise<ResponseLoginProviderDto> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const provider = await this.validateExists(id);
                
                if (!isEnabled) {
                    await this.validateNoActiveCredentials(provider);
                }
                
                const entityData = { isEnabled } as DeepPartial<LoginProvider>;
                const entity = await this.update(id, entityData, queryRunner);
                
                this.logEntityChanges(
                    provider,
                    entityData,
                    OperationType.SYSTEM,
                    'toggleProviderStatus',
                    requestingUserId,
                    id,
                    { previousStatus: provider.isEnabled }
                );
                
                return this.toResponseDto(entity!, ResponseLoginProviderDto);
            },
            OperationType.SYSTEM,
            'toggleProviderStatus',
            {
                userId: requestingUserId,
                targetId: id,
                metadata: { isEnabled }
            }
        );
    }

    /**
     * Soft delete a login provider.
     * Requires system-level access (SYSTEM_OP).
     * Provider must have no active credentials.
     * 
     * @param id - Provider ID to soft delete
     * @param requestingUserId - ID of the system user making the request
     * @throws UnauthorizedException if user lacks system access
     * @throws NotFoundException if provider not found
     * @throws BadRequestException if provider has active credentials
     */
    async softDeleteLoginProvider(id: string, requestingUserId: string): Promise<void> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const provider = await this.validateExists(id);
                await this.validateNoActiveCredentials(provider);
                
                const entityData = {
                    deleted: true,
                    deletedAt: new Date(),
                    isEnabled: false
                } as DeepPartial<LoginProvider>;
                
                await this.update(id, entityData, queryRunner);
                
                this.logOperation(
                    OperationType.SYSTEM,
                    'softDeleteLoginProvider',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id,
                        metadata: { code: provider.code }
                    }
                );
            },
            OperationType.SYSTEM,
            'softDeleteLoginProvider',
            {
                userId: requestingUserId,
                targetId: id
            }
        );
    }

    /**
     * Validate that a field value is unique.
     * 
     * @param field - Field name to check
     * @param value - Field value to check
     * @param excludeId - Optional ID to exclude from check
     * @throws ConflictException if value is not unique
     */
    protected async validateUniqueness(
        field: string,
        value: string,
        excludeId?: string
    ): Promise<void> {
        const where: any = { [field]: value };
        if (excludeId) {
            where.id = Not(excludeId);
        }
        
        const existing = await this.repository.findOne({ where });
        if (existing) {
            throw new ConflictException({
                code: ServiceErrorCode.ALREADY_EXISTS,
                message: `${this.ENTITY_NAME} with ${field} '${value}' already exists`,
                details: { field, value }
            });
        }
    }

    /**
     * Validate that a provider has no active credentials.
     * 
     * @param provider - Provider to check
     * @throws BadRequestException if provider has active credentials
     */
    protected async validateNoActiveCredentials(provider: LoginProvider): Promise<void> {
        const activeCredentials = provider.credentials?.filter(cred => cred.isEnabled);
        if (activeCredentials && activeCredentials.length > 0) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_STATE,
                message: `Cannot modify ${this.ENTITY_NAME} with active credentials`,
                details: { 
                    providerId: provider.id,
                    activeCredentialCount: activeCredentials.length
                }
            });
        }
    }

    /**
     * Check if a field contains sensitive information.
     * Extends base class sensitive fields with provider-specific ones.
     * 
     * @param field - Field name to check
     * @returns True if field contains sensitive data
     */
    protected override isSensitiveField(field: string): boolean {
        const providerSensitiveFields = [
            'credentials',
            'secret',
            'apiKey',
            ...super.isSensitiveField(field) ? [field] : []
        ];
        return providerSensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive));
    }
}
