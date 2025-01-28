import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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

@Injectable()
export class LoginCredentialService {
    private readonly logger = new Logger(LoginCredentialService.name);
    private readonly ENTITY_NAME = 'LoginCredential';

    constructor(
        @InjectRepository(LoginCredential)
        private readonly loginCredentialRepository: Repository<LoginCredential>,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(): Promise<ResponseLoginCredentialDto[]> {
        try {
            const credentials = await this.loginCredentialRepository.find({
                relations: ['loginProvider', 'baseUser']
            });
            return credentials.map(cred => plainToClass(ResponseLoginCredentialDto, cred, { excludeExtraneousValues: true }));
        } catch (error) {
            const handled = handleError<LoginCredential[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return (handled ?? []).map(cred => plainToClass(ResponseLoginCredentialDto, cred, { excludeExtraneousValues: true }));
        }
    }

    private async findOneEntity(id: string): Promise<LoginCredential | null> {
        try {
            const credential = await this.loginCredentialRepository.findOne({
                where: { id },
                relations: ['loginProvider', 'baseUser']
            });

            if (!credential) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return credential;
        } catch (error) {
            const handled = handleError<LoginCredential>(this.logger, error, createErrorContext(
                'findOneEntity',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : handled;
        }
    }

    async findOne(id: string): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.findOneEntity(id);
        return credential ? plainToClass(ResponseLoginCredentialDto, credential, { excludeExtraneousValues: true }) : null;
    }

    async findByIdentifierAndProvider(identifier: string, loginProviderId: string): Promise<ResponseLoginCredentialDto | null> {
        try {
            const credential = await this.loginCredentialRepository.findOne({
                where: { identifier, loginProviderId },
                relations: ['loginProvider', 'baseUser']
            });

            if (!credential) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return plainToClass(ResponseLoginCredentialDto, credential, { excludeExtraneousValues: true });
        } catch (error) {
            const handled = handleError<LoginCredential>(this.logger, error, createErrorContext(
                'findByIdentifierAndProvider',
                this.ENTITY_NAME,
                undefined,
                { identifier, loginProviderId }
            ));
            return handled === undefined ? null : handled ? plainToClass(ResponseLoginCredentialDto, handled, { excludeExtraneousValues: true }) : null;
        }
    }

    // Password-specific methods
    async createPasswordCredential(dto: CreatePasswordCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (dto.credentialType !== CredentialType.PASSWORD) {
                throw new BadRequestException('Invalid credential type for password creation');
            }

            const passwordHash = await bcrypt.hash(dto.password, 10);
            const entity = this.loginCredentialRepository.create({
                ...dto,
                passwordHash,
            });

            const result = await queryRunner.manager.save(LoginCredential, entity);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created password ${this.ENTITY_NAME}: ${result.id}`);
            return plainToClass(ResponseLoginCredentialDto, result, { excludeExtraneousValues: true });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginCredential>(this.logger, error, createErrorContext(
                'createPasswordCredential',
                this.ENTITY_NAME,
                undefined,
                { dto }
            ));
            if (handled === undefined || handled === null) {
                throw error;
            }
            return handled ? plainToClass(ResponseLoginCredentialDto, handled, { excludeExtraneousValues: true }) : null;
        } finally {
            await queryRunner.release();
        }
    }

    async validatePassword(credential: LoginCredential, password: string): Promise<boolean> {
        try {
            if (!credential.passwordHash) {
                return false;
            }
            return await bcrypt.compare(password, credential.passwordHash);
        } catch (error) {
            const handled = handleError<boolean>(this.logger, error, createErrorContext(
                'validatePassword',
                this.ENTITY_NAME,
                credential.id
            ));
            return handled ?? false;
        }
    }

    async updatePassword(id: string, dto: UpdatePasswordCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const credential = await this.findOneEntity(id);
            if (!credential) return null;

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
            const updatedCredential = { ...credential, passwordHash };

            const result = await queryRunner.manager.save(LoginCredential, updatedCredential);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated password for ${this.ENTITY_NAME}: ${id}`);
            return plainToClass(ResponseLoginCredentialDto, result, { excludeExtraneousValues: true });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginCredential>(this.logger, error, createErrorContext(
                'updatePassword',
                this.ENTITY_NAME,
                id,
                { dto }
            ));
            return handled === undefined ? null : handled ? plainToClass(ResponseLoginCredentialDto, handled, { excludeExtraneousValues: true }) : null;
        } finally {
            await queryRunner.release();
        }
    }

    // OAuth-specific methods
    async createOAuthCredential(dto: CreateOAuthCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (dto.credentialType !== CredentialType.OAUTH) {
                throw new BadRequestException('Invalid credential type for OAuth creation');
            }

            const entity = this.loginCredentialRepository.create({
                ...dto,
                // Handle Apple-specific fields
                identityToken: dto.provider === OAuthProvider.APPLE ? dto.identityToken : undefined,
                authorizationCode: dto.provider === OAuthProvider.APPLE ? dto.authorizationCode : undefined,
                realUserStatus: dto.provider === OAuthProvider.APPLE ? dto.realUserStatus : undefined,
                nonce: dto.provider === OAuthProvider.APPLE ? dto.nonce : undefined,
            });

            const result = await queryRunner.manager.save(LoginCredential, entity);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created OAuth ${this.ENTITY_NAME}: ${result.id}`);
            return plainToClass(ResponseLoginCredentialDto, result, { excludeExtraneousValues: true });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginCredential>(this.logger, error, createErrorContext(
                'createOAuthCredential',
                this.ENTITY_NAME,
                undefined,
                { dto }
            ));
            if (handled === undefined || handled === null) {
                throw error;
            }
            return handled ? plainToClass(ResponseLoginCredentialDto, handled, { excludeExtraneousValues: true }) : null;
        } finally {
            await queryRunner.release();
        }
    }

    async updateOAuthCredential(id: string, dto: UpdateOAuthCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const credential = await this.findOneEntity(id);
            if (!credential) return null;

            if (credential.credentialType !== CredentialType.OAUTH) {
                throw new BadRequestException('Invalid credential type for OAuth update');
            }

            // Update OAuth fields
            Object.assign(credential, dto);

            const result = await queryRunner.manager.save(LoginCredential, credential);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated OAuth ${this.ENTITY_NAME}: ${id}`);
            return plainToClass(ResponseLoginCredentialDto, result, { excludeExtraneousValues: true });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginCredential>(this.logger, error, createErrorContext(
                'updateOAuthCredential',
                this.ENTITY_NAME,
                id,
                { dto }
            ));
            return handled === undefined ? null : handled ? plainToClass(ResponseLoginCredentialDto, handled, { excludeExtraneousValues: true }) : null;
        } finally {
            await queryRunner.release();
        }
    }

    // Generic update method
    async update(id: string, dto: UpdateLoginCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const credential = await this.findOneEntity(id);
            if (!credential) return null;

            // Route to specific update methods based on credential type
            if (credential.credentialType === CredentialType.PASSWORD && 'currentPassword' in dto) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                return this.updatePassword(id, dto as UpdatePasswordCredentialDto);
            }
            if (credential.credentialType === CredentialType.OAUTH && 'provider' in dto) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                return this.updateOAuthCredential(id, dto as UpdateOAuthCredentialDto);
            }

            Object.assign(credential, dto);
            const result = await queryRunner.manager.save(LoginCredential, credential);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return plainToClass(ResponseLoginCredentialDto, result, { excludeExtraneousValues: true });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginCredential>(this.logger, error, createErrorContext(
                'update',
                this.ENTITY_NAME,
                id,
                { dto }
            ));
            return handled === undefined ? null : handled ? plainToClass(ResponseLoginCredentialDto, handled, { excludeExtraneousValues: true }) : null;
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const credential = await this.findOneEntity(id);
            if (!credential) return false;

            await queryRunner.manager.remove(LoginCredential, credential);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Removed ${this.ENTITY_NAME}: ${id}`);
            return true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<boolean>(this.logger, error, createErrorContext(
                'remove',
                this.ENTITY_NAME,
                id
            ));
            return handled ?? false;
        } finally {
            await queryRunner.release();
        }
    }
}
