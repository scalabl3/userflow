import { Injectable, BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial, Not, FindOptionsWhere } from 'typeorm';
import { Organization } from '../models/Organization';
import { CreateOrganizationDto } from '@my-app/shared/';
import { UpdateOrganizationDto } from '@my-app/shared/';
import { ResponseOrganizationDto } from '@my-app/shared/';
import { SubscriptionStatus } from '@my-app/shared/';
import { ServiceBase } from '../utils/service-utils';
import { User } from '../models/User';
import { OperationType, ServiceErrorCode, OperationResult, OperationLogContext } from '../constants/service-operations';

/**
 * Service for managing organization entities.
 * 
 * Core Features:
 * - Organization CRUD operations
 * - Admin user management
 * - Organization state control
 * - User membership management
 * - Organization visibility control
 * 
 * Operation Types (Maps to Role-Based Access):
 * - SYSTEM_OP:
 *   - findAllOrganizations: List all orgs (System Admin)
 *   - removeOrganization: Delete orgs (System Admin)
 *   - softDeleteOrganization: Soft delete orgs (System Admin)
 * 
 * - ADMIN_OP:
 *   - findOneOrganization: View org details (Org Admin)
 *   - createOrganization: Create new org (System Admin)
 *   - updateOrganization: Update org details (Org Admin)
 *   - updateAdminUser: Change org admin (Org Admin)
 * 
 * - USER_OP:
 *   - findByUser: View own org details
 */
@Injectable()
export class OrganizationService extends ServiceBase<Organization> {
    protected readonly ENTITY_NAME = 'Organization';
    protected readonly defaultRelations = ['users', 'adminUser'];

    constructor(
        @InjectRepository(Organization)
        protected readonly repository: Repository<Organization>,
        protected readonly dataSource: DataSource,
    ) {
        super();
        this.initializeLogger();
    }

    /**
     * Find all organizations in the system.
     * Requires System Administrator role (SYSTEM_OP).
     * 
     * @param requestingUserId - ID of the admin user making the request
     * @returns Array of organizations transformed to DTOs
     * @throws UnauthorizedException if user lacks system admin access
     */
    async findAllOrganizations(requestingUserId: string): Promise<ResponseOrganizationDto[]> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);

        const organizations = await this.repository.find({
            relations: this.defaultRelations
        });

        this.logOperation(
            OperationType.SYSTEM,
            'findAllOrganizations',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { 
                    count: organizations.length
                }
            }
        );

        return organizations.map(org => this.toResponseDto(org, ResponseOrganizationDto));
    }

    /**
     * Find a specific organization by ID.
     * Organization admins can only view their own organization.
     * 
     * @param id - Organization ID to find
     * @param requestingUserId - ID of the user making the request
     * @returns Organization DTO if found and accessible
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if organization not found
     */
    async findOneOrganization(id: string, requestingUserId: string): Promise<ResponseOrganizationDto> {
        const organization = await this.validateExists(id);

        // Check access based on visibility and membership
        if (!organization.visible) {
            const isMember = organization.users.some(user => user.id === requestingUserId);
            if (!isMember) {
                await this.validateAccess(OperationType.SYSTEM, requestingUserId);
            }
        } else {
            await this.validateAccess(OperationType.USER, requestingUserId);
        }

        this.logOperation(
            organization.visible ? OperationType.USER : OperationType.SYSTEM,
            'findOneOrganization',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                targetId: id,
                metadata: { visible: organization.visible }
            }
        );

        return this.toResponseDto(organization, ResponseOrganizationDto);
    }

    /**
     * Find organization by user ID.
     * Users can only view their own organization.
     * 
     * @param userId - User ID to find organization for
     * @param requestingUserId - ID of the user making the request
     * @returns Organization DTO if found
     * @throws UnauthorizedException if access denied
     */
    async findByUser(userId: string, requestingUserId: string): Promise<ResponseOrganizationDto | null> {
        await this.validateAccess(OperationType.USER, requestingUserId);

        const organization = await this.repository.findOne({
            where: {
                users: {
                    id: userId
                }
            },
            relations: this.defaultRelations
        });

        if (!organization) {
            throw new NotFoundException(`Organization with user ID ${userId} not found`);
        }

        this.logOperation(
            OperationType.USER,
            'findByUser',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                targetId: userId
            }
        );

        return this.toResponseDto(organization, ResponseOrganizationDto);
    }

    /**
     * Create a new organization.
     * Requires System Administrator role (SYSTEM_OP).
     * 
     * @param dto - Organization creation data
     * @param requestingUserId - ID of the admin user making the request
     * @returns Created organization DTO
     * @throws UnauthorizedException if user lacks system admin access
     * @throws ConflictException if organization name already exists
     * @throws BadRequestException if admin user validation fails
     */
    async createOrganization(dto: CreateOrganizationDto, requestingUserId: string): Promise<ResponseOrganizationDto> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                // Validate name uniqueness for visible organizations
                if (dto.visible) {
                    await this.validateUniqueness('name', dto.name);
                }

                // Validate admin user exists and has no organization
                await this.validateAdminUser(dto.adminUser);
                
                // Convert DTO to entity format
                const entityData: DeepPartial<Organization> = {
                    ...dto,
                    adminUser: { id: dto.adminUser } as DeepPartial<User>
                };
                
                const entity = await this.create(entityData, queryRunner);
                
                this.logOperation(
                    OperationType.SYSTEM,
                    'createOrganization',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: entity.id,
                        metadata: {
                            adminUserId: entity.adminUser.id,
                            visible: entity.visible
                        }
                    }
                );
                
                return this.toResponseDto(entity, ResponseOrganizationDto)!;
            },
            OperationType.SYSTEM,
            'createOrganization',
            {
                userId: requestingUserId,
                metadata: { adminUserId: dto.adminUser }
            }
        );
    }

    /**
     * Update an organization.
     * Organization admins can only update their own organization.
     * 
     * @param id - Organization ID to update
     * @param dto - Update data
     * @param requestingUserId - ID of the user making the request
     * @returns Updated organization DTO
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if organization not found
     * @throws ConflictException if name already exists
     */
    async updateOrganization(id: string, dto: UpdateOrganizationDto, requestingUserId: string): Promise<ResponseOrganizationDto> {
        const organization = await this.validateExists(id);
        await this.validateAccess(OperationType.ADMIN, requestingUserId, id);
        
        return this.withTransaction(
            async (queryRunner) => {
                // Validate name uniqueness if being updated and organization is visible
                if (dto.name && dto.name !== organization.name && (dto.visible || organization.visible)) {
                    await this.validateUniqueness('name', dto.name, id);
                }

                // Validate admin user if being updated
                if (dto.adminUser && dto.adminUser !== organization.adminUser.id) {
                    await this.validateAdminUserChange(organization, dto.adminUser);
                }

                // Convert DTO to entity format
                const entityData: DeepPartial<Organization> = {
                    ...dto,
                    adminUser: dto.adminUser ? { id: dto.adminUser } as DeepPartial<User> : undefined
                };

                const entity = await this.update(id, entityData, queryRunner);
                
                // Log changes using base class method
                this.logEntityChanges(
                    organization,
                    entityData,
                    OperationType.ADMIN,
                    'updateOrganization',
                    requestingUserId,
                    id
                );

                return this.toResponseDto(entity, ResponseOrganizationDto)!;
            },
            OperationType.ADMIN,
            'updateOrganization',
            {
                userId: requestingUserId,
                targetId: id,
                changes: Object.keys(dto)
            }
        );
    }

    /**
     * Update organization admin user.
     * Only current admin can change admin user.
     * New admin must be a member of the organization.
     * 
     * @param id - Organization ID to update
     * @param adminUserId - ID of new admin user
     * @param requestingUserId - ID of current admin making the request
     * @returns Updated organization DTO
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if organization not found
     * @throws BadRequestException if admin validation fails
     */
    async updateAdminUser(id: string, adminUserId: string, requestingUserId: string): Promise<ResponseOrganizationDto> {
        const organization = await this.validateExists(id);
        await this.validateAccess(OperationType.ADMIN, requestingUserId, id);
        
        return this.withTransaction(
            async (queryRunner) => {
                const isUserInOrg = organization.users.some(user => user.id === adminUserId);
                if (!isUserInOrg) {
                    throw new BadRequestException({
                        code: ServiceErrorCode.INVALID_INPUT,
                        message: 'Admin user must be a member of the organization',
                        details: { 
                            organizationId: organization.id,
                            newAdminId: adminUserId
                        }
                    });
                }

                await this.validateAdminUser(adminUserId);

                const entity = await this.update(
                    id,
                    { adminUser: { id: adminUserId } as DeepPartial<User> },
                    queryRunner
                );
                
                // Log changes using base class method
                this.logEntityChanges(
                    organization,
                    { adminUser: { id: adminUserId } },
                    OperationType.ADMIN,
                    'updateAdminUser',
                    requestingUserId,
                    id
                );

                return this.toResponseDto(entity, ResponseOrganizationDto)!;
            },
            OperationType.ADMIN,
            'updateAdminUser',
            {
                userId: requestingUserId,
                targetId: id,
                changes: ['adminUser']
            }
        );
    }

    /**
     * Soft delete an organization
     * Requires system-level access
     * Organization must have no active users
     * 
     * @param id - Organization ID to remove
     * @param requestingUserId - ID of the user making the request
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if organization not found
     * @throws BadRequestException if organization has active users
     */
    async removeOrganization(
        id: string,
        requestingUserId: string
    ): Promise<void> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const organization = await this.validateExists(id);
                await this.validateNoActiveUsers(organization);
                
                await this.update(
                    id,
                    { 
                        deleted: true,
                        deletedAt: new Date()
                    } as DeepPartial<Organization>,
                    queryRunner
                );
                
                this.logOperation(
                    OperationType.SYSTEM,
                    'removeOrganization',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id,
                        metadata: {
                            name: organization.name,
                            adminUserId: organization.adminUser.id
                        }
                    }
                );
            },
            OperationType.SYSTEM,
            'removeOrganization',
            {
                userId: requestingUserId,
                targetId: id
            }
        );
    }

    /**
     * Toggle organization visibility
     * Requires organization admin access
     * 
     * @param id - Organization ID to update
     * @param visible - New visibility state
     * @param requestingUserId - ID of the user making the request
     * @returns Updated organization DTO
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if organization not found
     * @throws ConflictException if name conflict when making visible
     */
    async toggleOrganizationVisibility(
        id: string,
        visible: boolean,
        requestingUserId: string
    ): Promise<ResponseOrganizationDto> {
        const organization = await this.validateExists(id);
        await this.validateAccess(OperationType.ADMIN, requestingUserId, id);
        
        return this.withTransaction(
            async (queryRunner) => {
                // If making visible, validate name uniqueness
                if (visible && !organization.visible) {
                    await this.validateUniqueness('name', organization.name, id);
                }

                const entity = await this.update(
                    id,
                    { visible } as DeepPartial<Organization>,
                    queryRunner
                );

                this.logOperation(
                    OperationType.ADMIN,
                    'toggleOrganizationVisibility',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id,
                        metadata: {
                            previousState: organization.visible,
                            newState: visible
                        }
                    }
                );

                return this.toResponseDto(entity, ResponseOrganizationDto)!;
            },
            OperationType.ADMIN,
            'toggleOrganizationVisibility',
            {
                userId: requestingUserId,
                targetId: id,
                metadata: { visible }
            }
        );
    }

    /**
     * Update organization subscription status
     * Requires system-level access
     * 
     * @param id - Organization ID to update
     * @param status - New subscription status
     * @param stripeCustomerId - Optional Stripe customer ID
     * @param requestingUserId - ID of the user making the request
     * @returns Updated organization DTO
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if organization not found
     */
    async updateSubscriptionStatus(
        id: string,
        status: SubscriptionStatus.ACTIVE,
        requestingUserId: string,
        stripeCustomerId?: string
    ): Promise<ResponseOrganizationDto> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const organization = await this.validateExists(id);
                
                const updateData: DeepPartial<Organization> = {
                    subscriptionStatus: status
                };

                if (stripeCustomerId) {
                    updateData.stripeCustomerId = stripeCustomerId;
                }

                const entity = await this.update(id, updateData, queryRunner);

                this.logOperation(
                    OperationType.SYSTEM,
                    'updateSubscriptionStatus',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id,
                        metadata: {
                            previousStatus: organization.subscriptionStatus,
                            newStatus: status,
                            stripeCustomerUpdated: !!stripeCustomerId
                        }
                    }
                );

                return this.toResponseDto(entity, ResponseOrganizationDto)!;
            },
            OperationType.SYSTEM,
            'updateSubscriptionStatus',
            {
                userId: requestingUserId,
                targetId: id,
                metadata: { status }
            }
        );
    }

    /**
     * Validate uniqueness of a field value.
     * Checks against existing visible organizations.
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
        const where: FindOptionsWhere<Organization> = {
            [field]: value,
            visible: true
        };

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
     * Validate admin user eligibility.
     * Checks that user is not already an admin of another organization.
     * 
     * @param userId - User ID to validate
     * @throws BadRequestException if user is already an admin
     */
    protected async validateAdminUser(userId: string): Promise<void> {
        const where: FindOptionsWhere<Organization> = {
            adminUser: { id: userId } as any
        };

        const existing = await this.repository.findOne({ where });

        if (existing) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_STATE,
                message: 'User is already an admin of another organization',
                details: { userId }
            });
        }
    }

    /**
     * Validate admin user change is allowed.
     * Checks that new admin is a member of the organization.
     * 
     * @param organization - Organization being modified
     * @param newAdminId - ID of proposed new admin
     * @throws BadRequestException if validation fails
     */
    protected async validateAdminUserChange(
        organization: Organization,
        newAdminId: string
    ): Promise<void> {
        const isUserInOrg = organization.users.some(user => user.id === newAdminId);
        if (!isUserInOrg) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_INPUT,
                message: 'Admin user must be a member of the organization',
                details: { 
                    organizationId: organization.id,
                    newAdminId
                }
            });
        }

        await this.validateAdminUser(newAdminId);
    }

    /**
     * Validate organization has no active users.
     * Required before organization deletion.
     * 
     * @param organization - Organization to validate
     * @throws BadRequestException if organization has active users
     */
    protected async validateNoActiveUsers(organization: Organization): Promise<void> {
        if (organization.users.length > 0) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_STATE,
                message: `Cannot delete ${this.ENTITY_NAME} with active users`,
                details: { 
                    organizationId: organization.id,
                    activeUserCount: organization.users.length
                }
            });
        }
    }

    /**
     * Check if a field contains sensitive information.
     * Extends base class sensitive fields with organization-specific ones.
     * 
     * @param field - Field name to check
     * @returns True if field contains sensitive data
     */
    protected override isSensitiveField(field: string): boolean {
        const orgSensitiveFields = [
            'stripeCustomerId',
            ...super.isSensitiveField(field) ? [field] : []
        ];
        return orgSensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive));
    }
}
   