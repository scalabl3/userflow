import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial, QueryRunner } from 'typeorm';
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
import { plainToClass } from 'class-transformer';
import { handleError, createErrorContext } from '../utils/error-handling';
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

    async findAllLoginCredentials(): Promise<ResponseLoginCredentialDto[]> {
        const credentials = await this.findAll();
        return this.toResponseDtoArray(credentials, ResponseLoginCredentialDto);
    }

    async findOneLoginCredential(id: string): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.findOne(id);
        return credential ? this.toResponseDto(credential, ResponseLoginCredentialDto)! : null;
    }

    async findByIdentifierAndProvider(identifier: string, loginProviderId: string): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.repository.findOne({
            where: { identifier, loginProviderId },
            relations: ['loginProvider', 'baseUser']
        });

        if (!credential) {
            return null;
        }

        return this.toResponseDto(credential, ResponseLoginCredentialDto)!;
    }

    // Password-specific methods
    async createPasswordCredential(dto: CreatePasswordCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.withTransaction(async (queryRunner) => {
            if (dto.credentialType !== CredentialType.PASSWORD) {
                throw new BadRequestException('Invalid credential type for password creation');
            }

            const passwordHash = await bcrypt.hash(dto.password, 10);
            const createData = {
                ...dto,
                passwordHash,
            };

            const entity = await super.create(createData as DeepPartial<LoginCredential>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'create', undefined, { dto });
    }

    async validatePassword(credential: LoginCredential, password: string): Promise<boolean> {
        if (!credential.passwordHash) {
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

            // Validate current password
            if (!dto.currentPassword) {
                throw new BadRequestException('Current password is required');
            }
            const isValid = await this.validatePassword(credential, dto.currentPassword);
            if (!isValid) {
                throw new UnauthorizedException('Current password is incorrect');
            }

            // Update password
            if (!dto.newPassword) {
                throw new BadRequestException('New password is required');
            }
            const passwordHash = await bcrypt.hash(dto.newPassword, 10);
            const updateData = { ...dto, passwordHash };

            const entity = await super.update(id, updateData as DeepPartial<LoginCredential>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'update', id, { dto });
    }

    // OAuth-specific methods
    async createOAuthCredential(dto: CreateOAuthCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.withTransaction(async (queryRunner) => {
            if (dto.credentialType !== CredentialType.OAUTH) {
                throw new BadRequestException('Invalid credential type for OAuth creation');
            }

            const createData = {
                ...dto,
                // Handle Apple-specific fields
                identityToken: dto.provider === OAuthProvider.APPLE ? dto.identityToken : undefined,
                authorizationCode: dto.provider === OAuthProvider.APPLE ? dto.authorizationCode : undefined,
                realUserStatus: dto.provider === OAuthProvider.APPLE ? dto.realUserStatus : undefined,
                nonce: dto.provider === OAuthProvider.APPLE ? dto.nonce : undefined,
            };

            const entity = await super.create(createData as DeepPartial<LoginCredential>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'create', undefined, { dto });
    }

    async updateOAuthCredential(id: string, dto: UpdateOAuthCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.withTransaction(async (queryRunner) => {
            const credential = await this.validateExists(id);

            if (credential.credentialType !== CredentialType.OAUTH) {
                throw new BadRequestException('Invalid credential type for OAuth update');
            }

            const entity = await super.update(id, dto as DeepPartial<LoginCredential>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginCredentialDto)!;
        }, 'update', id, { dto });
    }

    async removeLoginCredential(id: string): Promise<void> {
        await this.withTransaction(async (queryRunner) => {
            await super.remove(id, queryRunner);
        }, 'remove', id);
    }
}
