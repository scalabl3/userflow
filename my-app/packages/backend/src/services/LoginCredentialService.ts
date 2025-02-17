import { Injectable, Logger, BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial, Not, In } from 'typeorm';
import { LoginCredential } from '../models/LoginCredential';
import { LoginProvider } from '../models/LoginProvider';
import { 
    CreateLoginCredentialDto,
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdateLoginCredentialDto,
    UpdatePasswordCredentialDto,
    UpdateOAuthCredentialDto,
    ResponseLoginCredentialDto
} from '@my-app/shared/dist/dtos/LoginCredential';
import { CredentialType, OAuthProvider } from '@my-app/shared/dist/enums/CredentialType';
import * as bcrypt from 'bcrypt';
import { ServiceBase } from '../utils/service-utils';
import { OperationType, ServiceErrorCode, OperationResult } from '../constants/service-operations';

/**
 * Service for managing login credentials and authentication.
 * 
 * Core Features:
 * - Credential CRUD operations
 * - Password credential management
 * - OAuth credential management
 * - Credential validation and verification
 * - Token management
 * 
 * Operation Types (Maps to Role-Based Access):
 * - SYSTEM_OP:
 *   - findAllLoginCredentials: List all credentials
 *   - batchUpdateStatus: Bulk status updates
 * 
 * - ADMIN_OP:
 *   - findByProvider: List provider credentials
 *   - removeLoginCredential: Remove credentials
 * 
 * - USER_OP:
 *   - findOneLoginCredential: View own credentials
 *   - findByBaseUser: View own credentials
 *   - createPasswordCredential: Create password login
 *   - createOAuthCredential: Create OAuth login
 *   - updatePassword: Change password
 *   - updateOAuthCredential: Update OAuth tokens
 *   - refreshOAuthTokens: Refresh OAuth access
 */
@Injectable()
export class LoginCredentialService extends ServiceBase<LoginCredential> {
    protected readonly ENTITY_NAME = 'LoginCredential';
    protected readonly defaultRelations = ['loginProvider', 'baseUser'];

    constructor(
        @InjectRepository(LoginCredential)
        protected readonly repository: Repository<LoginCredential>,
        protected readonly dataSource: DataSource,
    ) {
        super();
        this.initializeLogger();
    }

    /**
     * Find all login credentials in the system.
     * Requires System Administrator role (SYSTEM_OP).
     * 
     * @param requestingUserId - ID of the system user making the request
     * @returns Array of login credentials transformed to DTOs
     * @throws UnauthorizedException if user lacks system access
     */
    async findAllLoginCredentials(requestingUserId: string): Promise<ResponseLoginCredentialDto[]> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        const credentials = await this.repository.find({
            relations: this.defaultRelations
        });
        
        this.logOperation(
            OperationType.SYSTEM,
            'findAllLoginCredentials',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { count: credentials.length }
            }
        );
        
        return credentials.map(cred => this.toResponseDto(cred, ResponseLoginCredentialDto));
    }

    /**
     * Find a login credential by ID.
     * Regular users can only view their own credentials.
     * Administrators can view any credential.
     * 
     * @param id - Credential ID to find
     * @param requestingUserId - ID of the user making the request
     * @returns Credential DTO if found and accessible
     * @throws UnauthorizedException if access denied
     * @throws NotFoundException if credential not found
     */
    async findOneLoginCredential(id: string, requestingUserId: string): Promise<ResponseLoginCredentialDto | null> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        const credential = await this.validateExists(id);
        
        // Users can only view their own credentials
        if (credential.baseUser.id !== requestingUserId) {
            await this.validateAccess(OperationType.ADMIN, requestingUserId);
        }
        
        this.logOperation(
            OperationType.USER,
            'findOneLoginCredential',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                targetId: id
            }
        );
        
        return this.toResponseDto(credential, ResponseLoginCredentialDto);
    }

    /**
     * Find all credentials for a base user.
     * Users can only view their own credentials.
     * 
     * @param baseUserId - Base user ID to find credentials for
     * @param requestingUserId - ID of the user making the request
     * @returns Array of credential DTOs
     * @throws UnauthorizedException if access denied
     */
    async findByBaseUser(baseUserId: string, requestingUserId: string): Promise<ResponseLoginCredentialDto[]> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        const credentials = await this.repository.find({
            where: { 
                baseUserId,
                deleted: false
            },
            relations: this.defaultRelations
        });
        
        this.logOperation(
            OperationType.USER,
            'findByBaseUser',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                targetId: baseUserId,
                metadata: { count: credentials.length }
            }
        );
        
        return credentials.map(cred => this.toResponseDto(cred, ResponseLoginCredentialDto));
    }

    /**
     * Find all credentials for a login provider.
     * Requires Organization Administrator role (ADMIN_OP).
     * 
     * @param loginProviderId - Provider ID to find credentials for
     * @param requestingUserId - ID of the admin user making the request
     * @returns Array of credential DTOs
     * @throws UnauthorizedException if user lacks admin access
     */
    async findByProvider(loginProviderId: string, requestingUserId: string): Promise<ResponseLoginCredentialDto[]> {
        await this.validateAccess(OperationType.ADMIN, requestingUserId);
        
        const credentials = await this.repository.find({
            where: { 
                loginProviderId,
                deleted: false
            },
            relations: this.defaultRelations
        });
        
        this.logOperation(
            OperationType.ADMIN,
            'findByProvider',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { 
                    providerId: loginProviderId,
                    count: credentials.length
                }
            }
        );
        
        return credentials.map(cred => this.toResponseDto(cred, ResponseLoginCredentialDto));
    }

    /**
     * Find a credential by identifier and provider
     * Used for authentication, requires system access
     * 
     * @param identifier - Credential identifier
     * @param loginProviderId - Provider ID
     * @param requestingUserId - ID of the user making the request
     * @returns Credential DTO if found
     * @throws UnauthorizedException if access denied
     */
    async findByIdentifierAndProvider(
        identifier: string,
        loginProviderId: string,
        requestingUserId: string
    ): Promise<ResponseLoginCredentialDto | null> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        const credential = await this.repository.findOne({
            where: { 
                identifier, 
                loginProviderId,
                deleted: false
            },
            relations: this.defaultRelations
        });
        
        this.logOperation(
            OperationType.SYSTEM,
            'findByIdentifierAndProvider',
            OperationResult.SUCCESS,
            {
                userId: requestingUserId,
                metadata: { 
                    identifier,
                    loginProviderId
                }
            }
        );
        
        return credential ? this.toResponseDto(credential, ResponseLoginCredentialDto) : null;
    }

    /**
     * Create a new password credential.
     * Users can only create credentials for themselves.
     * 
     * @param dto - Password credential creation data
     * @param requestingUserId - ID of the user making the request
     * @returns Created credential DTO
     * @throws UnauthorizedException if access denied
     * @throws BadRequestException if password validation fails
     * @throws ConflictException if credential already exists
     */
    async createPasswordCredential(dto: CreatePasswordCredentialDto, requestingUserId: string): Promise<ResponseLoginCredentialDto> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                if (dto.credentialType !== CredentialType.PASSWORD) {
                    throw new BadRequestException('Invalid credential type for password creation');
                }

                await this.validateUniqueness('identifier', dto.identifier, dto.loginProviderId);
                
                await this.validateNoExistingCredentialType(
                    dto.baseUserId,
                    dto.loginProviderId,
                    CredentialType.PASSWORD
                );

                if ('password' in dto) {
                    this.validatePasswordStrength(dto.password);

                    const passwordHash = await bcrypt.hash(dto.password, 10);
                    const entity = await this.create({
                        ...dto,
                        passwordHash
                    } as DeepPartial<LoginCredential>, queryRunner);

                    this.logOperation(
                        OperationType.USER,
                        'createPasswordCredential',
                        OperationResult.SUCCESS,
                        {
                            userId: requestingUserId,
                            targetId: entity.id,
                            metadata: { baseUserId: dto.baseUserId }
                        }
                    );
                    
                    return this.toResponseDto(entity, ResponseLoginCredentialDto);
                }

                throw new BadRequestException('Password is required for password credential');
            },
            OperationType.USER,
            'createPasswordCredential',
            {
                userId: requestingUserId,
                metadata: { baseUserId: dto.baseUserId }
            }
        );
    }

    /**
     * Validate a password against a credential.
     * Used during authentication process.
     * 
     * @param credential - Credential to validate against
     * @param password - Password to validate
     * @returns True if password is valid
     * @throws BadRequestException if credential type is not password
     * @throws UnauthorizedException if credential is disabled or deleted
     */
    async validatePassword(credential: LoginCredential, password: string): Promise<boolean> {
        if (credential.credentialType !== CredentialType.PASSWORD || !credential.passwordHash) {
            throw new BadRequestException('Invalid credential type for password validation');
        }

        if (!credential.isEnabled) {
            throw new UnauthorizedException('Credential is disabled');
        }

        if (credential.deleted) {
            throw new UnauthorizedException('Credential has been deleted');
        }

        return bcrypt.compare(password, credential.passwordHash);
    }

    /**
     * Update a password credential.
     * Users can only update their own passwords.
     * 
     * @param id - Credential ID to update
     * @param password - New password
     * @param currentPassword - Current password (required for user-initiated changes)
     * @param requestingUserId - ID of the user making the request
     * @returns Updated credential DTO
     * @throws UnauthorizedException if access denied or current password invalid
     * @throws BadRequestException if password validation fails
     * @throws NotFoundException if credential not found
     */
    async updatePassword(
        id: string,
        password: string,
        currentPassword: string | undefined,
        requestingUserId: string
    ): Promise<ResponseLoginCredentialDto> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const credential = await this.validateExists(id);
                
                if (credential.credentialType !== CredentialType.PASSWORD) {
                    throw new BadRequestException('Invalid credential type for password update');
                }

                if (currentPassword) {
                    const isValid = await this.validatePassword(credential, currentPassword);
                    if (!isValid) {
                        throw new UnauthorizedException('Current password is incorrect');
                    }
                }

                this.validatePasswordStrength(password);

                const passwordHash = await bcrypt.hash(password, 10);
                const entity = await this.update(
                    id,
                    { passwordHash } as DeepPartial<LoginCredential>,
                    queryRunner
                );

                this.logOperation(
                    OperationType.USER,
                    'updatePassword',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id
                    }
                );
                
                return this.toResponseDto(entity!, ResponseLoginCredentialDto);
            },
            OperationType.USER,
            'updatePassword',
            {
                userId: requestingUserId,
                targetId: id
            }
        );
    }

    /**
     * Create a new OAuth credential.
     * Users can only create credentials for themselves.
     * 
     * @param dto - OAuth credential creation data
     * @param requestingUserId - ID of the user making the request
     * @returns Created credential DTO
     * @throws UnauthorizedException if access denied
     * @throws BadRequestException if OAuth validation fails
     * @throws ConflictException if credential already exists
     */
    async createOAuthCredential(dto: CreateOAuthCredentialDto, requestingUserId: string): Promise<ResponseLoginCredentialDto> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                if (dto.credentialType !== CredentialType.OAUTH) {
                    throw new BadRequestException('Invalid credential type for OAuth creation');
                }

                await this.validateUniqueness('identifier', dto.identifier, dto.loginProviderId);
                
                await this.validateNoExistingOAuthProvider(
                    dto.baseUserId,
                    dto.loginProviderId,
                    dto.provider
                );

                this.validateOAuthFields(dto);

                const entity = await this.create(dto as DeepPartial<LoginCredential>, queryRunner);

                this.logOperation(
                    OperationType.USER,
                    'createOAuthCredential',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: entity.id,
                        metadata: {
                            baseUserId: dto.baseUserId,
                            provider: dto.provider
                        }
                    }
                );
                
                return this.toResponseDto(entity, ResponseLoginCredentialDto);
            },
            OperationType.USER,
            'createOAuthCredential',
            {
                userId: requestingUserId,
                metadata: {
                    baseUserId: dto.baseUserId,
                    provider: dto.provider
                }
            }
        );
    }

    /**
     * Update an OAuth credential's tokens and metadata.
     * Users can only update their own credentials.
     * 
     * @param id - Credential ID to update
     * @param dto - OAuth credential update data
     * @param requestingUserId - ID of the user making the request
     * @returns Updated credential DTO
     * @throws UnauthorizedException if access denied
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if credential not found
     */
    async updateOAuthCredential(id: string, dto: UpdateOAuthCredentialDto, requestingUserId: string): Promise<ResponseLoginCredentialDto> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const credential = await this.validateExists(id);
                
                if (credential.credentialType !== CredentialType.OAUTH) {
                    throw new BadRequestException('Invalid credential type for OAuth update');
                }

                if (dto.accessToken && dto.accessTokenExpiresAt) {
                    this.validateTokenExpiration(dto.accessTokenExpiresAt);
                }
                if (dto.refreshToken && dto.refreshTokenExpiresAt) {
                    this.validateTokenExpiration(dto.refreshTokenExpiresAt);
                }

                const entity = await this.update(id, dto as DeepPartial<LoginCredential>, queryRunner);
                
                this.logEntityChanges(
                    credential,
                    dto as DeepPartial<LoginCredential>,
                    OperationType.USER,
                    'updateOAuthCredential',
                    requestingUserId,
                    id
                );
                
                return this.toResponseDto(entity!, ResponseLoginCredentialDto);
            },
            OperationType.USER,
            'updateOAuthCredential',
            {
                userId: requestingUserId,
                targetId: id
            }
        );
    }

    /**
     * Refresh OAuth tokens for a credential.
     * Users can only refresh their own tokens.
     * 
     * @param id - Credential ID to refresh
     * @param accessToken - New access token
     * @param refreshToken - New refresh token (optional)
     * @param accessTokenExpiresAt - Access token expiration date
     * @param refreshTokenExpiresAt - Refresh token expiration date (optional)
     * @param requestingUserId - ID of the user making the request
     * @returns Updated credential DTO
     * @throws UnauthorizedException if access denied or credential disabled
     * @throws BadRequestException if validation fails
     * @throws NotFoundException if credential not found
     */
    async refreshOAuthTokens(
        id: string,
        accessToken: string,
        refreshToken: string | undefined,
        accessTokenExpiresAt: Date | undefined,
        refreshTokenExpiresAt: Date | undefined,
        requestingUserId: string
    ): Promise<ResponseLoginCredentialDto> {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const credential = await this.validateExists(id);

                if (credential.credentialType !== CredentialType.OAUTH) {
                    throw new BadRequestException('Invalid credential type for OAuth token refresh');
                }

                if (!credential.isEnabled) {
                    throw new UnauthorizedException('Credential is disabled');
                }

                if (accessTokenExpiresAt) {
                    this.validateTokenExpiration(accessTokenExpiresAt);
                }
                if (refreshTokenExpiresAt) {
                    this.validateTokenExpiration(refreshTokenExpiresAt);
                }

                const updateData: DeepPartial<LoginCredential> = {
                    accessToken,
                    accessTokenExpiresAt
                };

                if (refreshToken) {
                    updateData.refreshToken = refreshToken;
                    updateData.refreshTokenExpiresAt = refreshTokenExpiresAt;
                }

                const entity = await this.update(id, updateData, queryRunner);

                this.logOperation(
                    OperationType.USER,
                    'refreshOAuthTokens',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id
                    }
                );
                
                return this.toResponseDto(entity!, ResponseLoginCredentialDto);
            },
            OperationType.USER,
            'refreshOAuthTokens',
            {
                userId: requestingUserId,
                targetId: id
            }
        );
    }

    /**
     * Batch update credential status.
     * Requires System Administrator role (SYSTEM_OP).
     * 
     * @param ids - Array of credential IDs to update
     * @param isEnabled - New enabled status
     * @param requestingUserId - ID of the system user making the request
     * @throws UnauthorizedException if user lacks system access
     * @throws BadRequestException if any credential not found
     */
    async batchUpdateStatus(ids: string[], isEnabled: boolean, requestingUserId: string): Promise<void> {
        await this.validateAccess(OperationType.SYSTEM, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const credentials = await this.repository.find({
                    where: { id: In(ids) }
                });

                if (credentials.length !== ids.length) {
                    throw new BadRequestException('Some credentials were not found');
                }

                await Promise.all(
                    credentials.map(credential =>
                        this.update(
                            credential.id,
                            { isEnabled } as DeepPartial<LoginCredential>,
                            queryRunner
                        )
                    )
                );

                this.logOperation(
                    OperationType.SYSTEM,
                    'batchUpdateStatus',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        metadata: {
                            count: ids.length,
                            isEnabled
                        }
                    }
                );
            },
            OperationType.SYSTEM,
            'batchUpdateStatus',
            {
                userId: requestingUserId,
                metadata: { count: ids.length }
            }
        );
    }

    /**
     * Soft delete a login credential.
     * Requires Organization Administrator role (ADMIN_OP).
     * Clears sensitive data and disables the credential.
     * 
     * @param id - Credential ID to remove
     * @param requestingUserId - ID of the admin user making the request
     * @throws UnauthorizedException if user lacks admin access
     * @throws NotFoundException if credential not found
     */
    async removeLoginCredential(id: string, requestingUserId: string): Promise<void> {
        await this.validateAccess(OperationType.ADMIN, requestingUserId);
        
        return this.withTransaction(
            async (queryRunner) => {
                const credential = await this.validateExists(id);
                
                const updateData: DeepPartial<LoginCredential> = {
                    deleted: true,
                    deletedAt: new Date(),
                    isEnabled: false,
                    passwordHash: undefined,
                    accessToken: undefined,
                    refreshToken: undefined
                };

                await this.update(id, updateData, queryRunner);

                this.logOperation(
                    OperationType.ADMIN,
                    'removeLoginCredential',
                    OperationResult.SUCCESS,
                    {
                        userId: requestingUserId,
                        targetId: id
                    }
                );
            },
            OperationType.ADMIN,
            'removeLoginCredential',
            {
                userId: requestingUserId,
                targetId: id
            }
        );
    }

    /**
     * Base method to find a single credential.
     * Used internally by other methods.
     * 
     * @param id - Credential ID to find
     * @returns Credential with relations loaded
     */
    async findOne(id: string): Promise<LoginCredential | null> {
        return this.repository.findOne({
            where: { id },
            relations: this.defaultRelations
        });
    }

    /**
     * Base method to find all credentials.
     * Used internally by other methods.
     * 
     * @returns Array of credentials with relations loaded
     */
    async findAll(): Promise<LoginCredential[]> {
        return this.repository.find({
            relations: this.defaultRelations
        });
    }

    /**
     * Validate that a field value is unique for a provider.
     * 
     * @param field - Field name to check
     * @param value - Field value to check
     * @param loginProviderId - Provider ID context
     * @param excludeId - Optional ID to exclude from check
     * @throws ConflictException if value is not unique
     */
    protected async validateUniqueness(
        field: string,
        value: string,
        loginProviderId: string,
        excludeId?: string
    ): Promise<void> {
        const where: any = { 
            [field]: value,
            loginProviderId,
            deleted: false
        };
        
        if (excludeId) {
            where.id = Not(excludeId);
        }

        const existing = await this.repository.findOne({ where });
        if (existing) {
            throw new ConflictException({
                code: ServiceErrorCode.ALREADY_EXISTS,
                message: `${this.ENTITY_NAME} with ${field} '${value}' already exists for this provider`,
                details: { field, value, loginProviderId }
            });
        }
    }

    /**
     * Validate that a credential exists and return it.
     * 
     * @param id - Credential ID to check
     * @returns Credential if found
     * @throws NotFoundException if credential not found
     */
    protected async validateExists(id: string): Promise<LoginCredential> {
        const credential = await this.findOne(id);
        if (!credential) {
            throw new NotFoundException({
                code: ServiceErrorCode.NOT_FOUND,
                message: `${this.ENTITY_NAME} with ID ${id} not found`,
                details: { id }
            });
        }
        return credential;
    }

    /**
     * Validate no existing credential of type exists for user and provider.
     * 
     * @param baseUserId - User ID to check
     * @param loginProviderId - Provider ID to check
     * @param credentialType - Credential type to check
     * @throws ConflictException if credential already exists
     */
    protected async validateNoExistingCredentialType(
        baseUserId: string,
        loginProviderId: string,
        credentialType: CredentialType
    ): Promise<void> {
        const existing = await this.repository.findOne({
            where: {
                baseUserId,
                loginProviderId,
                credentialType,
                deleted: false
            }
        });

        if (existing) {
            throw new ConflictException({
                code: ServiceErrorCode.ALREADY_EXISTS,
                message: `User already has a ${credentialType} credential for this provider`,
                details: { 
                    baseUserId,
                    loginProviderId,
                    credentialType
                }
            });
        }
    }

    /**
     * Validate no existing OAuth provider credential exists for user.
     * 
     * @param baseUserId - User ID to check
     * @param loginProviderId - Provider ID to check
     * @param provider - OAuth provider to check
     * @throws ConflictException if credential already exists
     */
    protected async validateNoExistingOAuthProvider(
        baseUserId: string,
        loginProviderId: string,
        provider: OAuthProvider
    ): Promise<void> {
        const existing = await this.repository.findOne({
            where: {
                baseUserId,
                loginProviderId,
                credentialType: CredentialType.OAUTH,
                provider,
                deleted: false
            }
        });

        if (existing) {
            throw new ConflictException({
                code: ServiceErrorCode.ALREADY_EXISTS,
                message: `User already has a credential for ${provider}`,
                details: {
                    baseUserId,
                    loginProviderId,
                    provider
                }
            });
        }
    }

    /**
     * Validate password meets strength requirements.
     * Checks length, case, numbers, and special characters.
     * 
     * @param password - Password to validate
     * @throws BadRequestException if password is too weak
     */
    protected validatePasswordStrength(password: string): void {
        const errors: string[] = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        if (errors.length > 0) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_INPUT,
                message: 'Password validation failed',
                details: { errors }
            });
        }
    }

    /**
     * Validate required OAuth fields are present and valid.
     * Additional validation for Apple Sign In credentials.
     * 
     * @param dto - OAuth credential data to validate
     * @throws BadRequestException if validation fails
     */
    protected validateOAuthFields(dto: CreateOAuthCredentialDto): void {
        const errors: string[] = [];

        if (!dto.provider) {
            errors.push('OAuth provider is required');
        }
        if (!dto.accessToken) {
            errors.push('Access token is required');
        }
        if (!dto.accessTokenExpiresAt) {
            errors.push('Access token expiration is required');
        }
        if (dto.accessTokenExpiresAt && dto.accessTokenExpiresAt < new Date()) {
            errors.push('Access token expiration must be in the future');
        }
        if (dto.refreshToken && !dto.refreshTokenExpiresAt) {
            errors.push('Refresh token expiration is required when refresh token is provided');
        }
        if (dto.refreshTokenExpiresAt && dto.refreshTokenExpiresAt < new Date()) {
            errors.push('Refresh token expiration must be in the future');
        }
        if (dto.provider === OAuthProvider.APPLE) {
            if (!dto.identityToken) {
                errors.push('Identity token is required for Apple Sign In');
            }
            if (!dto.authorizationCode) {
                errors.push('Authorization code is required for Apple Sign In');
            }
        }

        if (errors.length > 0) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_INPUT,
                message: 'OAuth validation failed',
                details: { errors }
            });
        }
    }

    /**
     * Validate token expiration date is in the future.
     * 
     * @param expiresAt - Expiration date to validate
     * @throws BadRequestException if date is in the past
     */
    protected validateTokenExpiration(expiresAt: Date): void {
        if (expiresAt < new Date()) {
            throw new BadRequestException({
                code: ServiceErrorCode.INVALID_INPUT,
                message: 'Token expiration date must be in the future',
                details: { expiresAt }
            });
        }
    }

    /**
     * Check if a field contains sensitive information.
     * Extends base class sensitive fields with credential-specific ones.
     * 
     * @param field - Field name to check
     * @returns True if field contains sensitive data
     */
    protected override isSensitiveField(field: string): boolean {
        const credentialSensitiveFields = [
            'passwordHash',
            'accessToken',
            'refreshToken',
            'identityToken',
            'authorizationCode',
            ...super.isSensitiveField(field) ? [field] : []
        ];
        return credentialSensitiveFields.some(sensitive => field.toLowerCase().includes(sensitive));
    }
}
