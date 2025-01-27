import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginCredential } from '../models/LoginCredential';
import { CreateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/CreateLoginCredentialDto';
import { UpdateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/UpdateLoginCredentialDto';

@Injectable()
export class LoginCredentialService {
    constructor(
        @InjectRepository(LoginCredential)
        private readonly loginCredentialRepository: Repository<LoginCredential>,
    ) {}

    async findAll(): Promise<LoginCredential[]> {
        return await this.loginCredentialRepository.find({
            relations: ['loginProvider']
        });
    }

    async findOne(id: string): Promise<LoginCredential | null> {
        return await this.loginCredentialRepository.findOne({
            where: { id },
            relations: ['loginProvider']
        });
    }

    async findByIdentifierAndProvider(identifier: string, loginProviderId: string): Promise<LoginCredential | null> {
        return await this.loginCredentialRepository.findOne({
            where: { identifier, loginProviderId },
            relations: ['loginProvider']
        });
    }

    async create(dto: CreateLoginCredentialDto): Promise<LoginCredential> {
        const entity = this.loginCredentialRepository.create({
            identifier: dto.identifier,
            loginProviderId: dto.loginProviderId,
            credentials: dto.credentials,
            credentialType: dto.credentialType,
            expiresAt: dto.expiresAt,
            isEnabled: dto.isEnabled ?? true
        });
        return await this.loginCredentialRepository.save(entity);
    }

    async update(id: string, dto: UpdateLoginCredentialDto): Promise<LoginCredential | null> {
        const entity = await this.loginCredentialRepository.findOneBy({ id });
        if (!entity) {
            return null;
        }
        
        if (dto.identifier !== undefined) entity.identifier = dto.identifier;
        if (dto.loginProviderId !== undefined) entity.loginProviderId = dto.loginProviderId;
        if (dto.credentials !== undefined) entity.credentials = dto.credentials;
        if (dto.credentialType !== undefined) entity.credentialType = dto.credentialType;
        if (dto.expiresAt !== undefined) entity.expiresAt = dto.expiresAt;
        if (dto.isEnabled !== undefined) entity.isEnabled = dto.isEnabled;

        return await this.loginCredentialRepository.save(entity);
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.loginCredentialRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
