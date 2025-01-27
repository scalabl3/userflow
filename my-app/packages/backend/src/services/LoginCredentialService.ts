import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class LoginCredentialService {
    constructor(
        @InjectRepository(LoginCredential)
        private readonly loginCredentialRepository: Repository<LoginCredential>,
    ) {}

    async findAll(): Promise<ResponseLoginCredentialDto[]> {
        const credentials = await this.loginCredentialRepository.find({
            relations: ['loginProvider', 'baseUser']
        });
        return credentials.map(cred => plainToClass(ResponseLoginCredentialDto, cred, { excludeExtraneousValues: true }));
    }

    async findOne(id: string): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.loginCredentialRepository.findOne({
            where: { id },
            relations: ['loginProvider', 'baseUser']
        });
        return credential ? plainToClass(ResponseLoginCredentialDto, credential, { excludeExtraneousValues: true }) : null;
    }

    async findByIdentifierAndProvider(identifier: string, loginProviderId: string): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.loginCredentialRepository.findOne({
            where: { identifier, loginProviderId },
            relations: ['loginProvider', 'baseUser']
        });
        return credential ? plainToClass(ResponseLoginCredentialDto, credential, { excludeExtraneousValues: true }) : null;
    }

    // Password-specific methods
    async createPasswordCredential(dto: CreatePasswordCredentialDto): Promise<ResponseLoginCredentialDto> {
        if (dto.credentialType !== CredentialType.PASSWORD) {
            throw new BadRequestException('Invalid credential type for password creation');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const entity = this.loginCredentialRepository.create({
            ...dto,
            passwordHash,
        });

        const saved = await this.loginCredentialRepository.save(entity);
        return plainToClass(ResponseLoginCredentialDto, saved, { excludeExtraneousValues: true });
    }

    async validatePassword(credential: LoginCredential, password: string): Promise<boolean> {
        if (!credential.passwordHash) {
            return false;
        }
        return await bcrypt.compare(password, credential.passwordHash);
    }

    async updatePassword(id: string, dto: UpdatePasswordCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.loginCredentialRepository.findOne({
            where: { id },
            relations: ['loginProvider', 'baseUser']
        });
        if (!credential || credential.credentialType !== CredentialType.PASSWORD) {
            return null;
        }

        // Validate current password if provided
        if (dto.currentPassword) {
            const isValid = await this.validatePassword(credential, dto.currentPassword);
            if (!isValid) {
                throw new UnauthorizedException('Current password is incorrect');
            }
        }

        // Update password if new one provided
        if (dto.newPassword) {
            credential.passwordHash = await bcrypt.hash(dto.newPassword, 10);
        }

        const saved = await this.loginCredentialRepository.save(credential);
        return plainToClass(ResponseLoginCredentialDto, saved, { excludeExtraneousValues: true });
    }

    // OAuth-specific methods
    async createOAuthCredential(dto: CreateOAuthCredentialDto): Promise<ResponseLoginCredentialDto> {
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

        const saved = await this.loginCredentialRepository.save(entity);
        return plainToClass(ResponseLoginCredentialDto, saved, { excludeExtraneousValues: true });
    }

    async updateOAuthCredential(id: string, dto: UpdateOAuthCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.loginCredentialRepository.findOne({
            where: { id },
            relations: ['loginProvider', 'baseUser']
        });
        if (!credential || credential.credentialType !== CredentialType.OAUTH) {
            return null;
        }

        // Update OAuth fields
        Object.assign(credential, {
            ...dto,
            // Handle Apple-specific fields
            identityToken: dto.provider === OAuthProvider.APPLE ? dto.identityToken : credential.identityToken,
            authorizationCode: dto.provider === OAuthProvider.APPLE ? dto.authorizationCode : credential.authorizationCode,
            realUserStatus: dto.provider === OAuthProvider.APPLE ? dto.realUserStatus : credential.realUserStatus,
            nonce: dto.provider === OAuthProvider.APPLE ? dto.nonce : credential.nonce,
        });

        const saved = await this.loginCredentialRepository.save(credential);
        return plainToClass(ResponseLoginCredentialDto, saved, { excludeExtraneousValues: true });
    }

    // Generic update method
    async update(id: string, dto: UpdateLoginCredentialDto): Promise<ResponseLoginCredentialDto | null> {
        const credential = await this.loginCredentialRepository.findOne({
            where: { id },
            relations: ['loginProvider', 'baseUser']
        });
        if (!credential) {
            return null;
        }

        // Route to specific update methods based on credential type
        if (credential.credentialType === CredentialType.PASSWORD && 'currentPassword' in dto) {
            return this.updatePassword(id, dto as UpdatePasswordCredentialDto);
        }
        if (credential.credentialType === CredentialType.OAUTH && 'provider' in dto) {
            return this.updateOAuthCredential(id, dto as UpdateOAuthCredentialDto);
        }

        Object.assign(credential, dto);
        const saved = await this.loginCredentialRepository.save(credential);
        return plainToClass(ResponseLoginCredentialDto, saved, { excludeExtraneousValues: true });
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.loginCredentialRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
