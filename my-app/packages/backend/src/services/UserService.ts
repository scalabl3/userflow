import { Injectable, Logger, BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial, Not, FindOptionsWhere, In, QueryRunner } from 'typeorm';
import { User } from '../models/User';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { ResponseUserDto } from '@my-app/shared/dist/dtos/User/ResponseUserDto';
import { ServiceBase } from '../utils/service-utils';
import { UserPreferences } from '@my-app/shared/dist/types/user';
import { UserState } from '@my-app/shared/dist/enums/UserState';
import { OperationType, ServiceErrorCode, OperationResult, OperationLogContext } from '../constants/service-operations';

/**
 * Service for managing user entities within organizations.
 * 
 * Core Features:
 * - User CRUD operations within organizations
 * - Organization-scoped user management
 * - User state and preferences management
 * - Batch operations for user status
 * - Organization membership control
 * 
 * Operation Types (Maps to Role-Based Access):
 * - ADMIN_OP:
 *   - findAllUsers: List org users (Org Admin)
 *   - createUser: Create users (Org Admin)
 *   - updateUser: Update users (Org Admin)
 *   - removeUser: Remove users (Org Admin)
 *   - findOrganizationAdmin: Find org admin (Org Admin)
 *   - updateUserState: Update user state (Org Admin)
 *   - batchUpdateStatus: Bulk status changes (Org Admin)
 *   - batchUpdateOrganization: Bulk org changes (Org Admin)
 * 
 * - USER_OP:
 *   - findOneUser: View own profile
 *   - findByUsername: Find users (elevated to ADMIN for org-wide)
 *   - updateUserPreferences: Update own preferences
 */
@Injectable()
export class UserService extends ServiceBase<User> {
    protected readonly ENTITY_NAME = 'User';
    protected readonly defaultRelations = ['organization', 'loginCredentials'];

    constructor(
        @InjectRepository(User)
        protected readonly repository: Repository<User>,
        protected readonly dataSource: DataSource,
    ) {
        super();
        this.initializeLogger();
    }

    /**
     * Find all users in an organization.
     * Requires Organization Administrator role (ADMIN_OP).
     * 
     * @param organizationId - Optional organization filter
     * @param requestingUserId - ID of the admin user making the request
     * @returns Array of users transformed to DTOs
     * @throws UnauthorizedException if user lacks admin access
     * @throws BadRequestException if organization filter is invalid
     */
    async findAllUsers(organizationId: string | undefined, requestingUserId: string): Promise<ResponseUserDto[]> {
        await this.validateAccess(OperationType.ADMIN, requestingUserId, organizationId);
        
        const users = await this.repository.find({
            where: { deleted: false, ...(organizationId ? { organizationId } : {}) },
            relations: this.defaultRelations
        });
        
        this.logOperation(
            OperationType.ADMIN,
            'findAllUsers',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                organizationId,
                metadata: { count: users.length }
            }
        );
        
        return users.map(user => this.toResponseDto(user, ResponseUserDto));
    }

    /**
     * Find a user by ID.
     * Regular users can only view themselves.
     * Organization admins can view users in their organization.
     * 
     * @param id - User ID to find
     * @param requestingUserId - ID of the user making the request
     * @returns User DTO if found and accessible
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if user not found
     */
    async findOneUser(id: string, requestingUserId: string): Promise<ResponseUserDto | null> {
        // Initial USER_OP access check
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        const user = await this.validateExists(id);
        
        // Elevate to ADMIN_OP check if viewing other user
        if (requestingUserId !== id) {
            await this.validateAccess(OperationType.ADMIN, requestingUserId, user.organizationId);
        }
        
        this.logOperation(
            requestingUserId === id ? OperationType.USER : OperationType.ADMIN,
            'findOneUser',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                targetId: id,
                metadata: { selfAccess: requestingUserId === id }
            }
        );
        
        return this.toResponseDto(user, ResponseUserDto);
    }

    /**
     * Find a user by username.
     * Regular users can only find themselves.
     * Organization admins can find users in their organization.
     * 
     * @param username - Username to search for
     * @param requestingUserId - ID of the user making the request
     * @returns User DTO if found and accessible
     * @throws UnauthorizedException if access denied
     */
    async findByUsername(username: string, requestingUserId: string): Promise<ResponseUserDto | null> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        const user = await this.repository.findOne({
            where: { username, deleted: false },
            relations: this.defaultRelations
        });
        
        if (user) {
            // Additional access check - users can only view themselves or their organization
            if (requestingUserId !== user.id) {
                await this.validateAccess(OperationType.ADMIN, requestingUserId, user.organizationId);
            }
        }
        
        this.logOperation(
            OperationType.USER,
            'findByUsername',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { username }
            }
        );
        
        return user ? this.toResponseDto(user, ResponseUserDto) : null;
    }

    /**
     * Create a new user in an organization.
     * Requires Organization Administrator role (ADMIN_OP).
     * 
     * @param dto - User creation data
     * @param requestingUserId - ID of the admin user making the request
     * @returns Created user DTO
     * @throws UnauthorizedException if user lacks admin access
     * @throws ConflictException if username already exists
     * @throws BadRequestException if organization validation fails
     */
    async createUser(dto: CreateUserDto, requestingUserId: string): Promise<ResponseUserDto> {
        await this.validateAccess(OperationType.ADMIN, requestingUserId, dto.organizationId);
        
        return this.withTransaction(
            async (queryRunner) => {
                await this.validateUniqueness('username', dto.username);
                
                const entity = await this.create(dto as DeepPartial<User>, queryRunner);
                
                return this.toResponseDto(entity, ResponseUserDto);
            },
            OperationType.ADMIN,
            'createUser',
            {
                userId: requestingUserId,
                organizationId: dto.organizationId,
                changes: Object.keys(dto)
            }
        );
    }

    /**
     * Update a user
     * @param id - User ID to update
     * @param dto - Update data
     * @param requestingUserId - ID of the user making the request
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if user not found
     * @throws ConflictException if username already exists
     * @returns Updated user DTO
     */
    async updateUser(id: string, dto: UpdateUserDto, requestingUserId: string): Promise<ResponseUserDto> {
        try {
            const user = await this.validateExists(id);
            await this.validateAccess(OperationType.ADMIN, requestingUserId, user.organizationId);
            
            return this.withTransaction(
                async (queryRunner) => {
                    if (dto.username && dto.username !== user.username) {
                        await this.validateUniqueness('username', dto.username, id);
                    }
                    
                    if (dto.organizationId && dto.organizationId !== user.organizationId) {
                        await this.validateOrganizationChange(user, dto.organizationId);
                    }
                    
                    const entityData = dto as DeepPartial<User>;
                    const entity = await this.update(id, entityData, queryRunner);
                    
                    this.logEntityChanges(
                        user,
                        entityData,
                        OperationType.ADMIN,
                        'updateUser',
                        requestingUserId,
                        id,
                        { organizationId: user.organizationId }
                    );
                    
                    return this.toResponseDto(entity!, ResponseUserDto)!;
                },
                OperationType.ADMIN,
                'updateUser',
                {
                    userId: requestingUserId,
                    targetId: id,
                    organizationId: user.organizationId
                }
            );
        } catch (error) {
            this.handleError(error as Error, OperationType.ADMIN, 'updateUser', {
                userId: requestingUserId,
                targetId: id,
                dto: Object.keys(dto)
            });
        }
    }

    /**
     * Remove a user
     * @param id - User ID to remove
     * @param requestingUserId - ID of the user making the request
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if user not found
     * @throws BadRequestException if user has active credentials or is org admin
     */
    async removeUser(id: string, requestingUserId: string): Promise<void> {
        try {
            const user = await this.validateExists(id);
            await this.validateAccess(OperationType.ADMIN, requestingUserId, user.organizationId);
            
            return this.withTransaction(
                async (queryRunner) => {
                    await this.validateNoActiveCredentials(user);
                    await this.validateNotOrganizationAdmin(user);
                    
                    await this.softDelete(id, queryRunner);
                    
                    this.logOperation(OperationType.ADMIN, 'removeUser', OperationResult.SUCCESS, {
                        userId: requestingUserId,
                        targetId: id,
                        organizationId: user.organizationId
                    });
                },
                OperationType.ADMIN,
                'removeUser',
                {
                    userId: requestingUserId,
                    targetId: id,
                    organizationId: user.organizationId
                }
            );
        } catch (error) {
            this.handleError(error as Error, OperationType.ADMIN, 'removeUser', {
                userId: requestingUserId,
                targetId: id
            });
        }
    }

    /**
     * Update user preferences.
     * Users can only update their own preferences.
     * 
     * @param id - User ID to update
     * @param preferences - New preferences
     * @param requestingUserId - ID of the user making the request
     * @returns Updated user DTO
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if user not found
     * @throws BadRequestException if trying to update another user's preferences
     */
    async updateUserPreferences(
        id: string,
        preferences: Partial<UserPreferences>,
        requestingUserId: string
    ): Promise<ResponseUserDto> {
        try {
            const user = await this.validateExists(id);
            
            // Users can only update their own preferences
            if (id !== requestingUserId) {
                throw new BadRequestException({
                    code: ServiceErrorCode.ACCESS_DENIED,
                    message: 'Cannot update preferences for another user',
                    details: { id, requestingUserId }
                });
            }
            
            await this.validateAccess(OperationType.USER, requestingUserId);
            
            return this.withTransaction(
                async (queryRunner) => {
                    const updatedPreferences = {
                        ...user.preferences,
                        ...preferences
                    };
                    
                    const entity = await this.update(
                        id,
                        { preferences: updatedPreferences } as DeepPartial<User>,
                        queryRunner
                    );
                    
                    this.logOperation(OperationType.USER, 'updateUserPreferences', OperationResult.SUCCESS, {
                        userId: requestingUserId,
                        targetId: id,
                        changes: Object.keys(preferences)
                    });
                    
                    return this.toResponseDto(entity!, ResponseUserDto)!;
                },
                OperationType.USER,
                'updateUserPreferences',
                {
                    userId: requestingUserId,
                    targetId: id,
                    changes: Object.keys(preferences)
                }
            );
        } catch (error) {
            this.handleError(error as Error, OperationType.USER, 'updateUserPreferences', {
                userId: requestingUserId,
                targetId: id,
                preferences: Object.keys(preferences)
            });
        }
    }

    /**
     * Find organization admin user.
     * Requires Organization Administrator role (ADMIN_OP).
     * Requestor must be in the same organization.
     * 
     * @param organizationId - Organization to find admin for
     * @param requestingUserId - ID of the admin user making the request
     * @returns Admin user DTO if found
     * @throws UnauthorizedException if user lacks admin access
     * @throws BadRequestException if user not in organization
     */
    async findOrganizationAdmin(organizationId: string, requestingUserId: string): Promise<ResponseUserDto | null> {
        try {
            await this.validateAccess(OperationType.ADMIN, requestingUserId, organizationId);
            
            const requestingUser = await this.validateExists(requestingUserId);
            if (requestingUser.organizationId !== organizationId) {
                throw new BadRequestException({
                    code: ServiceErrorCode.INVALID_INPUT,
                    message: 'User does not belong to the specified organization',
                    details: { organizationId, userId: requestingUserId }
                });
            }

            // Find user who is the admin of this organization
            const admin = await this.repository.findOne({
                where: { 
                    organizationId,
                    deleted: false,
                    id: this.repository
                        .createQueryBuilder('user')
                        .select('user.id')
                        .innerJoin('user.organization', 'org')
                        .where('org.adminUserId = user.id')
                        .andWhere('org.id = :organizationId', { organizationId })
                        .getQuery()
                },
                relations: this.defaultRelations
            });

            this.logOperation(OperationType.ADMIN, 'findOrganizationAdmin', OperationResult.SUCCESS, {
                userId: requestingUserId,
                organizationId
            });

            return admin ? this.toResponseDto(admin, ResponseUserDto) : null;
        } catch (error) {
            this.handleError(error as Error, OperationType.ADMIN, 'findOrganizationAdmin', {
                userId: requestingUserId,
                organizationId
            });
        }
    }

    /**
     * Update user state.
     * Requires Organization Administrator role (ADMIN_OP).
     * State transitions are validated.
     * 
     * @param id - User ID to update
     * @param state - New state
     * @param requestingUserId - ID of the admin user making the request
     * @returns Updated user DTO
     * @throws UnauthorizedException if user lacks admin access
     * @throws NotFoundException if user not found
     * @throws BadRequestException if state transition invalid
     */
    async updateUserState(id: string, state: UserState, requestingUserId: string): Promise<ResponseUserDto> {
        const user = await this.validateExists(id);
        await this.validateAccess(OperationType.ADMIN, requestingUserId, user.organizationId);
        
        return this.withTransaction(
            async (queryRunner) => {
                await this.validateStateTransition(user.state, state);
                
                const entity = await this.update(id, { state } as DeepPartial<User>, queryRunner);
                
                return this.toResponseDto(entity, ResponseUserDto);
            },
            OperationType.ADMIN,
            'updateUserState',
            {
                userId: requestingUserId,
                targetId: id,
                metadata: {
                    previousState: user.state,
                    newState: state
                }
            }
        );
    }

    /**
     * Batch update user status.
     * Requires Organization Administrator role (ADMIN_OP).
     * Cannot disable organization admin users.
     * 
     * @param ids - User IDs to update
     * @param isEnabled - New enabled status
     * @param requestingUserId - ID of the admin user making the request
     * @throws UnauthorizedException if user lacks admin access
     * @throws BadRequestException if users not found or admin users included
     */
    async batchUpdateStatus(ids: string[], isEnabled: boolean, requestingUserId: string): Promise<void> {
        try {
            await this.validateAccess(OperationType.ADMIN, requestingUserId);
            
            return this.withTransaction(
                async (queryRunner) => {
                    const users = await this.repository.find({
                        where: { id: In(ids) },
                        relations: this.defaultRelations
                    });

                    if (users.length !== ids.length) {
                        throw new BadRequestException({
                            code: ServiceErrorCode.NOT_FOUND,
                            message: 'Some users not found',
                            details: { providedCount: ids.length, foundCount: users.length }
                        });
                    }

                    const adminUsers = users.filter(user => 
                        user.organization?.adminUserId === user.id
                    );
                    if (adminUsers.length > 0 && !isEnabled) {
                        throw new BadRequestException({
                            code: ServiceErrorCode.INVALID_INPUT,
                            message: 'Cannot disable organization admin users',
                            details: { adminCount: adminUsers.length }
                        });
                    }

                    await Promise.all(
                        users.map(user => 
                            this.update(
                                user.id,
                                { isEnabled } as DeepPartial<User>,
                                queryRunner
                            )
                        )
                    );

                    this.logOperation(OperationType.ADMIN, 'batchUpdateStatus', OperationResult.SUCCESS, {
                        userId: requestingUserId,
                        metadata: { count: ids.length, isEnabled }
                    });
                },
                OperationType.ADMIN,
                'batchUpdateStatus',
                {
                    userId: requestingUserId,
                    metadata: { count: ids.length, isEnabled }
                }
            );
        } catch (error) {
            this.handleError(error as Error, OperationType.ADMIN, 'batchUpdateStatus', {
                userId: requestingUserId,
                metadata: { count: ids.length, isEnabled }
            });
        }
    }

    /**
     * Batch update user organization.
     * Requires Organization Administrator role (ADMIN_OP).
     * Cannot change organization for admin users.
     * 
     * @param ids - User IDs to update
     * @param organizationId - New organization ID
     * @param requestingUserId - ID of the admin user making the request
     * @throws UnauthorizedException if user lacks admin access
     * @throws BadRequestException if users not found or admin users included
     */
    async batchUpdateOrganization(ids: string[], organizationId: string, requestingUserId: string): Promise<void> {
        try {
            await this.validateAccess(OperationType.ADMIN, requestingUserId);
            
            return this.withTransaction(
                async (queryRunner) => {
                    const users = await this.repository.find({
                        where: { id: In(ids) },
                        relations: this.defaultRelations
                    });

                    if (users.length !== ids.length) {
                        throw new BadRequestException({
                            code: ServiceErrorCode.NOT_FOUND,
                            message: 'Some users not found',
                            details: { providedCount: ids.length, foundCount: users.length }
                        });
                    }

                    const adminUsers = users.filter(user => 
                        user.organization?.adminUserId === user.id
                    );
                    if (adminUsers.length > 0) {
                        throw new BadRequestException({
                            code: ServiceErrorCode.INVALID_INPUT,
                            message: 'Cannot change organization for admin users',
                            details: { adminCount: adminUsers.length }
                        });
                    }

                    await Promise.all(
                        users.map(user => 
                            this.update(
                                user.id,
                                { organizationId } as DeepPartial<User>,
                                queryRunner
                            )
                        )
                    );

                    this.logOperation(OperationType.ADMIN, 'batchUpdateOrganization', OperationResult.SUCCESS, {
                        userId: requestingUserId,
                        metadata: { count: ids.length },
                        organizationId
                    });
                },
                OperationType.ADMIN,
                'batchUpdateOrganization',
                {
                    userId: requestingUserId,
                    metadata: { count: ids.length },
                    organizationId
                }
            );
        } catch (error) {
            this.handleError(error as Error, OperationType.ADMIN, 'batchUpdateOrganization', {
                userId: requestingUserId,
                metadata: { count: ids.length },
                organizationId
            });
        }
    }

    /**
     * Validate uniqueness of a field value.
     * Checks against existing non-deleted users.
     * 
     * @param field - Field name to check
     * @param value - Value to validate
     * @param excludeId - Optional ID to exclude from check
     * @throws ConflictException if value is not unique
     */
    protected async validateUniqueness(
        field: string,
        value: string,
        excludeId?: string
    ): Promise<void> {
        const where: any = { [field]: value, deleted: false };
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
     * Validate organization change is allowed.
     * Prevents changing organization for admin users.
     * 
     * @param user - User to validate
     * @param newOrganizationId - New organization ID
     * @throws BadRequestException if user is an organization admin
     */
    protected async validateOrganizationChange(
        user: User,
        newOrganizationId: string
    ): Promise<void> {
        await this.validateNotOrganizationAdmin(user);
    }

    /**
     * Validate that user has no active credentials.
     * Required before user deletion.
     * 
     * @param user - User to validate
     * @throws BadRequestException if user has active credentials
     */
    protected async validateNoActiveCredentials(user: User): Promise<void> {
        const activeCredentials = user.loginCredentials?.filter(cred => cred.isEnabled);
        if (activeCredentials && activeCredentials.length > 0) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_STATE,
                message: `Cannot remove ${this.ENTITY_NAME} with active credentials`,
                details: { userId: user.id, activeCredentialCount: activeCredentials.length }
            });
        }
    }

    /**
     * Validate user is not an organization admin.
     * Required before certain user modifications.
     * 
     * @param user - User to validate
     * @throws BadRequestException if user is an organization admin
     */
    protected async validateNotOrganizationAdmin(user: User): Promise<void> {
        if (user.organization?.adminUserId === user.id) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_STATE,
                message: `Cannot modify organization admin ${this.ENTITY_NAME}`,
                details: { userId: user.id, organizationId: user.organizationId }
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
        // For now, all transitions are allowed
    }

    /**
     * Soft delete a user.
     * Disables the user and marks as deleted.
     * 
     * @param id - User ID to soft delete
     * @param queryRunner - Optional transaction query runner
     */
    protected async softDelete(id: string, queryRunner?: QueryRunner): Promise<void> {
        await this.update(
            id,
            { 
                deleted: true,
                deletedAt: new Date(),
                isEnabled: false
            } as DeepPartial<User>,
            queryRunner
        );
    }

    /**
     * Validate access for an operation.
     * Extends base validation with organization-specific checks.
     * 
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
        
        if (operationType === OperationType.ADMIN) {
            const user = await this.validateExists(userId);
            if (!user?.organization?.adminUserId || user.organization.adminUserId !== user.id) {
                throw new UnauthorizedException({
                    code: ServiceErrorCode.ACCESS_DENIED,
                    message: 'Only organization admins can perform this operation',
                    details: { userId, organizationId }
                });
            }
        }
    }

    /**
     * Find a user by ID with relations.
     * Internal method used by other service methods.
     * 
     * @param id - User ID to find
     * @returns User with relations loaded or null
     */
    protected async findOneInternal(id: string): Promise<User | null> {
        return this.repository.findOne({
            where: { id },
            relations: this.defaultRelations
        });
    }

    protected toResponseDtoArray<T>(entities: User[], dtoClass: new () => T): T[] {
        return entities.map(entity => this.toResponseDto(entity, dtoClass));
    }

    protected override logOperation(
        operationType: OperationType,
        operation: string,
        result: OperationResult,
        context: OperationLogContext
    ): void {
        super.logOperation(operationType, operation, result, context);
    }

    protected override handleError(
        error: Error,
        operationType: OperationType,
        operation: string,
        context: Record<string, any>
    ): never {
        super.handleError(error, operationType, operation, context);
    }

    /**
     * Check if a field contains sensitive information.
     * Extends base class sensitive fields with user-specific ones.
     * 
     * @param field - Field name to check
     * @returns True if field contains sensitive data
     */
    protected override isSensitiveField(field: string): boolean {
        const userSensitiveFields = [
            'loginCredentials',
            'preferences',
            ...super.isSensitiveField(field) ? [field] : []
        ];
        return userSensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive));
    }
}
