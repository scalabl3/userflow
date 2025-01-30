import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { LoginCredential } from '../models/LoginCredential';
import { LoginProvider } from '../models/LoginProvider';
import { 
    CreateLoginCredentialDto,
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdateLoginCredentialDto,
    UpdatePasswordCredentialDto,
    UpdateOAuthCredentialDto,
    ResponseLoginCredentialDto,
    CredentialType,
    OAuthProvider
} from '@my-app/shared';
import * as bcrypt from 'bcrypt';
import { ServiceBase } from '../utils/service-utils';

@Injectable()
export class LoginCredentialService extends ServiceBase<LoginCredential> {
    protected readonly ENTITY_NAME = 'LoginCredential';
    protected readonly logger = new Logger(LoginCredentialService.name);

    constructor(
        @InjectRepository(LoginCredential)
        protected readonly repository: Repository<LoginCredential>,
        protected readonly dataSource: DataSource,
    ) {
        super();
    }

    protected readonly defaultRelations = ['loginProvider', 'baseUser'];

    async findAllLoginCredentials(): Promise<ResponseLoginCredentialDto[]> {
        const credentials = await this.repository.find({
            relations: this.defaultRelations
        });
        return this.toResponseDtoArray(credentials, ResponseLoginCredentialDto);
    }

    async findOneLoginCredential(id: string): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.repository.findOne({
            where: { id },
            relations: this.defaultRelations
        });
        return credential ? this.toResponseDto(credential, ResponseLoginCredentialDto)! : null;
    }

    async findByIdentifierAndProvider(identifier: string, loginProviderId: string): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.repository.findOne({
            where: { identifier, loginProviderId },
            relations: this.defaultRelations
        });
        return credential ? this.toResponseDto(credential, ResponseLoginCredentialDto)! : null;
    }

    // Password-specific methods
    async createPasswordCredential(dto: CreatePasswordCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.withTransaction(async (queryRunner) => {
            if (dto.credentialType !== CredentialType.PASSWORD) {
                throw new BadRequestException('Invalid credential type for password creation');
            }

            // Validate password presence
            if (!dto.password) {
                throw new BadRequestException('Password is required');
            }

            const passwordHash = await bcrypt.hash(dto.password, 10);
            const createData = {
                ...dto,
                passwordHash,
            };

            const entity = await this.create(createData as DeepPartial<LoginCredential>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'createPassword', undefined, { identifier: dto.identifier });
    }

    async validatePassword(credential: LoginCredential, password: string): Promise<boolean> {
        if (!credential.passwordHash) {
            this.logger.warn(`Attempted to validate password for credential ${credential.id} without password hash`);
            return false;
        }
        return await bcrypt.compare(password, credential.passwordHash);
    }

    async updatePassword(id: string, dto: UpdatePasswordCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.withTransaction(async (queryRunner) => {
            const credential = await this.validateExists(id);

            if (credential.credentialType !== CredentialType.PASSWORD) {
                throw new BadRequestException('Invalid credential type for password update');
            }

            // Validate current password if provided
            if (dto.currentPassword) {
                const isValid = await this.validatePassword(credential, dto.currentPassword);
                if (!isValid) {
                    throw new UnauthorizedException('Current password is incorrect');
                }
            }

            // Update password if new password provided
            let updateData: DeepPartial<LoginCredential> = {};
            if (dto.newPassword) {
                updateData.passwordHash = await bcrypt.hash(dto.newPassword, 10);
            }

            // Include other updateable fields
            if (dto.isEnabled !== undefined) {
                updateData.isEnabled = dto.isEnabled;
            }

            const entity = await this.update(id, updateData, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'updatePassword', id);
    }

    // OAuth-specific methods
    async createOAuthCredential(dto: CreateOAuthCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.withTransaction(async (queryRunner) => {
            if (dto.credentialType !== CredentialType.OAUTH) {
                throw new BadRequestException('Invalid credential type for OAuth creation');
            }

            if (!dto.provider) {
                throw new BadRequestException('OAuth provider is required');
            }

            if (!dto.accessToken) {
                throw new BadRequestException('Access token is required');
            }

            const createData = {
                ...dto,
                // Handle Apple-specific fields
                identityToken: dto.provider === OAuthProvider.APPLE ? dto.identityToken : undefined,
                authorizationCode: dto.provider === OAuthProvider.APPLE ? dto.authorizationCode : undefined,
                realUserStatus: dto.provider === OAuthProvider.APPLE ? dto.realUserStatus : undefined,
                nonce: dto.provider === OAuthProvider.APPLE ? dto.nonce : undefined,
            };

            const entity = await this.create(createData as DeepPartial<LoginCredential>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'createOAuth', undefined, { provider: dto.provider, identifier: dto.identifier });
    }

    async updateOAuthCredential(id: string, dto: UpdateOAuthCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.withTransaction(async (queryRunner) => {
            const credential = await this.validateExists(id);

            if (credential.credentialType !== CredentialType.OAUTH) {
                throw new BadRequestException('Invalid credential type for OAuth update');
            }

            // Validate provider consistency if being updated
            if (dto.provider && dto.provider !== credential.provider) {
                throw new BadRequestException('Cannot change OAuth provider type');
            }

            const entity = await this.update(id, dto as DeepPartial<LoginCredential>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'updateOAuth', id);
    }

    async removeLoginCredential(id: string): Promise<void> {
        await this.withTransaction(async (queryRunner) => {
            const credential = await this.validateExists(id);
            await this.remove(id, queryRunner);
        }, 'remove', id);
    }

    // Override base class methods to ensure relations are always loaded
    async findOne(id: string): Promise<LoginCredential | null> {
        return this.repository.findOne({
            where: { id },
            relations: this.defaultRelations
        });
    }

    async findAll(): Promise<LoginCredential[]> {
        return this.repository.find({
            relations: this.defaultRelations
        });
    }
}
