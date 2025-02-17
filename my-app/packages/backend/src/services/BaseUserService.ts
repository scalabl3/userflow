import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, DeepPartial } from 'typeorm';
import { BaseUser } from '../models/BaseUser';
import { ServiceBase } from '../utils/service-utils';
import { 
    CreateBaseUserDto, 
    UpdateBaseUserDto, 
    ResponseBaseUserDto 
} from '@my-app/shared';
import { UserState } from '@my-app/shared/dist/enums/UserState';
import { 
    OperationType, 
    OperationResult, 
    ServiceErrorCode,
    OperationLogContext 
} from '../constants/service-operations';
import { ValidationError } from 'class-validator';

/**
 * Service for managing base user entities.
 * 
 * Core Features:
 * - Base user CRUD operations
 * - State management and transitions
 * - Access control and validation
 * - Credential validation
 * - Contact information management
 * 
 * Operation Types (Maps to Role-Based Access):
 * - SYSTEM_OP:
 *   - validateAccess: System-level security checks
 *   - handleServiceError: System error processing
 *   (Reserved for automated system processes)
 * 
 * - ADMIN_OP:
 *   - findAllBaseUsers: List all users (System Admin)
 *   - removeBaseUser: Delete users (System Admin)
 *   - softDeleteBaseUser: Soft delete users (System Admin)
 * 
 * - USER_OP:
 *   - findOneBaseUser: View own or permitted user details
 *   - createBaseUser: Self-registration
 *   - updateBaseUser: Update own details
 *   - updateBaseUserState: Change own state
 */
@Injectable()
export class BaseUserService extends ServiceBase<BaseUser> {
    protected readonly ENTITY_NAME = 'BaseUser';
    protected readonly defaultRelations = ['loginCredentials'];

    constructor(
        @InjectRepository(BaseUser)
        protected readonly repository: Repository<BaseUser>,
        protected readonly dataSource: DataSource,
    ) {
        super();
        this.initializeLogger();
    }

    /**
     * Find all base users in the system.
     * Requires System Administrator role (ADMIN_OP).
     * 
     * @param requestingUserId - ID of the admin user making the request
     * @returns Array of base users transformed to DTOs
     * @throws UnauthorizedException if user lacks admin access
     */
    async findAllBaseUsers(requestingUserId: string): Promise<ResponseBaseUserDto[]> {
        await this.validateAccess(OperationType.ADMIN, requestingUserId);

        const users = await this.repository.find({
            relations: this.defaultRelations
        });

        this.logOperation(
            OperationType.ADMIN,
            'findAllBaseUsers',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { count: users.length }
            }
        );

        return users.map(user => this.toResponseDto(user, ResponseBaseUserDto));
    }

    /**
     * Find a specific base user by ID.
     * Users can only view themselves or users they have permission to access.
     * 
     * @param id - UUID of the base user to find
     * @param requestingUserId - ID of the user making the request
     * @returns Base user DTO if found and accessible
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if user not found
     */
    async findOneBaseUser(id: string, requestingUserId: string): Promise<ResponseBaseUserDto | null> {
        await this.validateAccess(OperationType.USER, requestingUserId);

        const user = await this.validateExists(id);
        
        this.logOperation(OperationType.USER, 'findOneBaseUser', OperationResult.SUCCESS, {
            userId: requestingUserId,
            targetId: id
        });

        return this.toResponseDto(user, ResponseBaseUserDto);
    }

    /**
     * Create a new base user.
     * Used for self-registration and system-initiated user creation.
     * 
     * @param createDto - Data for creating the base user
     * @param requestingUserId - ID of the user making the request
     * @returns Newly created base user as DTO
     * @throws UnauthorizedException if access denied
     * @throws BadRequestException if validation fails
     * @throws ConflictException if contact email already exists
     */
    async createBaseUser(createDto: CreateBaseUserDto, requestingUserId: string): Promise<ResponseBaseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            await this.validateAccess(OperationType.USER, requestingUserId);

            await this.validateUniqueness('contactEmail', createDto.contactEmail);

            const user = await this.create({
                ...createDto,
                state: createDto.state || UserState.PENDING
            }, queryRunner);

            this.logOperation(OperationType.USER, 'createBaseUser', OperationResult.SUCCESS, {
                userId: requestingUserId,
                targetId: user.id,
                changes: ['User created']
            });

            return this.toResponseDto(user, ResponseBaseUserDto);
        }, OperationType.USER, 'createBaseUser', { userId: requestingUserId });
    }

    /**
     * Update an existing base user.
     * Users can only update their own details unless they have elevated permissions.
     * 
     * @param id - UUID of the base user to update
     * @param updateDto - Data for updating the base user
     * @param requestingUserId - ID of the user making the request
     * @returns Updated base user as DTO
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if user not found
     * @throws BadRequestException if validation fails
     * @throws ConflictException if contact email already exists
     */
    async updateBaseUser(id: string, updateDto: UpdateBaseUserDto, requestingUserId: string): Promise<ResponseBaseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            await this.validateAccess(OperationType.USER, requestingUserId);

            const user = await this.validateExists(id);

            if (updateDto.contactEmail && updateDto.contactEmail !== user.contactEmail) {
                await this.validateUniqueness('contactEmail', updateDto.contactEmail, id);
            }

            if (updateDto.state && updateDto.state !== user.state) {
                await this.validateStateTransition(user.state, updateDto.state);
            }

            const entityData = updateDto as DeepPartial<BaseUser>;
            const updated = await this.update(id, entityData, queryRunner);
            
            this.logEntityChanges(
                user,
                entityData,
                OperationType.USER,
                'updateBaseUser',
                requestingUserId,
                id
            );

            return this.toResponseDto(updated, ResponseBaseUserDto);
        }, OperationType.USER, 'updateBaseUser', { 
            userId: requestingUserId,
            targetId: id
        });
    }

    /**
     * Remove a base user (hard delete).
     * Requires System Administrator role (ADMIN_OP).
     * User must have no active credentials.
     * 
     * @param id - UUID of the base user to remove
     * @param requestingUserId - ID of the admin user making the request
     * @returns True if deletion was successful
     * @throws UnauthorizedException if user lacks admin access
     * @throws NotFoundException if user not found
     * @throws BadRequestException if user has active credentials
     */
    async removeBaseUser(id: string, requestingUserId: string): Promise<boolean> {
        return this.withTransaction(async (queryRunner) => {
            await this.validateAccess(OperationType.ADMIN, requestingUserId);

            const user = await this.validateExists(id);
            await this.validateNoActiveCredentials(user);

            await queryRunner.manager.remove(user);

            this.logOperation(OperationType.ADMIN, 'removeBaseUser', OperationResult.SUCCESS, {
                userId: requestingUserId,
                targetId: id,
                changes: ['User permanently deleted']
            });

            return true;
        }, OperationType.ADMIN, 'removeBaseUser', { 
            userId: requestingUserId,
            targetId: id
        });
    }

    /**
     * Update a base user's state.
     * State transitions are validated against allowed state changes.
     * 
     * @param id - UUID of the base user
     * @param state - New state to set
     * @param requestingUserId - ID of the user making the request
     * @returns Updated base user as DTO
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if user not found
     * @throws BadRequestException if state transition is invalid
     */
    async updateBaseUserState(id: string, state: UserState, requestingUserId: string): Promise<ResponseBaseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            await this.validateAccess(OperationType.USER, requestingUserId);

            const user = await this.validateExists(id);
            await this.validateStateTransition(user.state, state);

            const entityData = { state } as DeepPartial<BaseUser>;
            const updated = await this.update(id, entityData, queryRunner);
            
            this.logEntityChanges(
                user,
                entityData,
                OperationType.USER,
                'updateBaseUserState',
                requestingUserId,
                id,
                {
                    previousState: user.state,
                    newState: state
                }
            );

            return this.toResponseDto(updated, ResponseBaseUserDto);
        }, OperationType.USER, 'updateBaseUserState', {
            userId: requestingUserId,
            targetId: id
        });
    }

    /**
     * Soft delete a base user.
     * Requires System Administrator role (ADMIN_OP).
     * User must have no active credentials.
     * 
     * @param id - UUID of the base user to soft delete
     * @param requestingUserId - ID of the admin user making the request
     * @throws UnauthorizedException if user lacks admin access
     * @throws NotFoundException if user not found
     * @throws BadRequestException if user has active credentials
     */
    async softDeleteBaseUser(id: string, requestingUserId: string): Promise<void> {
        return this.withTransaction(async (queryRunner) => {
            await this.validateAccess(OperationType.ADMIN, requestingUserId);

            const user = await this.validateExists(id);
            await this.validateNoActiveCredentials(user);

            user.deleted = true;
            user.deletedAt = new Date();
            await queryRunner.manager.save(user);

            this.logOperation(OperationType.ADMIN, 'softDeleteBaseUser', OperationResult.SUCCESS, {
                userId: requestingUserId,
                targetId: id,
                changes: ['User soft deleted']
            });
        }, OperationType.ADMIN, 'softDeleteBaseUser', {
            userId: requestingUserId,
            targetId: id
        });
    }

    /**
     * Validate uniqueness of a field value.
     * Checks against existing non-deleted users.
     * 
     * @param field - Name of the field to check
     * @param value - Value to validate
     * @param excludeId - Optional ID to exclude from check
     * @throws BadRequestException if value is not unique
     */
    protected async validateUniqueness(
        field: string,
        value: string,
        excludeId?: string
    ): Promise<void> {
        const query = this.repository.createQueryBuilder('user')
            .where(`user.${field} = :value`, { value });

        if (excludeId) {
            query.andWhere('user.id != :id', { id: excludeId });
        }

        const exists = await query.getOne();
        if (exists) {
            throw new BadRequestException({
                code: ServiceErrorCode.ALREADY_EXISTS,
                message: `${this.ENTITY_NAME} with this ${field} already exists`,
                details: { field, value }
            });
        }
    }

    /**
     * Validate state transition is allowed.
     * Enforces business rules for user state changes.
     * 
     * @param currentState - Current user state
     * @param newState - Target user state
     * @throws BadRequestException if transition is invalid
     */
    protected async validateStateTransition(
        currentState: UserState,
        newState: UserState
    ): Promise<void> {
        // Add state transition validation logic here
        const validTransitions: Record<UserState, UserState[]> = {
            [UserState.PENDING]: [UserState.ACTIVE, UserState.DEACTIVATED],
            [UserState.ACTIVE]: [UserState.SUSPENDED, UserState.DEACTIVATED],
            [UserState.SUSPENDED]: [UserState.ACTIVE, UserState.DEACTIVATED],
            [UserState.DEACTIVATED]: []
        };

        if (!validTransitions[currentState].includes(newState)) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_STATE,
                message: `Invalid state transition from ${currentState} to ${newState}`,
                details: { currentState, newState }
            });
        }
    }

    /**
     * Validate that user has no active credentials
     * @param user - Base user to validate
     * @throws BadRequestException if user has active credentials
     */
    protected async validateNoActiveCredentials(user: BaseUser): Promise<void> {
        if (user.loginCredentials?.some(cred => cred.isEnabled)) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_STATE,
                message: 'Cannot delete user with active credentials',
                details: { userId: user.id }
            });
        }
    }

    /**
     * Handle service errors with proper logging
     * @param error - Error that occurred
     * @param context - Operation context for logging
     * @throws Various exceptions based on error type
     */
    protected handleServiceError(error: Error, context: OperationLogContext): never {
        if (error instanceof ValidationError) {
            const validationError = error as ValidationError & { errors?: Record<string, string[]> };
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_INPUT,
                message: 'Validation failed',
                details: validationError.errors || {}
            });
        }
        if (error instanceof NotFoundException) {
            throw new NotFoundException({
                code: ServiceErrorCode.NOT_FOUND,
                message: `${this.ENTITY_NAME} not found`,
                details: { id: context.targetId }
            });
        }
        if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException({
                code: ServiceErrorCode.ACCESS_DENIED,
                message: 'Access denied',
                details: { userId: context.userId }
            });
        }

        // Log unexpected errors but don't expose details to client
        this.serviceLogger.logError(OperationType.SYSTEM, 'unexpectedError', error, context);
        throw new BadRequestException({
            code: ServiceErrorCode.SYSTEM_ERROR,
            message: 'An unexpected error occurred',
            details: {}
        });
    }

    /**
     * Validate access for an operation
     * @param operationType - Type of operation being performed
     * @param userId - ID of user making the request
     * @param organizationId - Optional organization context
     * @throws UnauthorizedException if access is denied
     */
    protected async validateAccess(
        operationType: OperationType,
        userId: string,
        organizationId?: string
    ): Promise<void> {
        await super.validateAccess(operationType, userId, organizationId);
        
        // Additional BaseUser-specific validations
        if (operationType === OperationType.ADMIN) {
            // Add admin validation logic here
            this.serviceLogger.logSecurity(operationType, 'validateAccess', {
                userId,
                securityEvent: 'admin_access_validation',
                result: 'granted'
            });
        }
    }

    protected override isSensitiveField(field: string): boolean {
        const baseUserSensitiveFields = [
            'loginCredentials',
            'contactEmail',
            ...super.isSensitiveField(field) ? [field] : []
        ];
        return baseUserSensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive));
    }
}

