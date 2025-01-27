import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginCredential } from '../models/LoginCredential';
import { CreateLoginCredentialDto } from '../../../shared/src/dtos/LoginCredential/CreateLoginCredentialDto';
import { UpdateLoginCredentialDto } from '../../../shared/src/dtos/LoginCredential/UpdateLoginCredentialDto';

@Injectable()
export class LoginCredentialService {
    constructor(
        @InjectRepository(LoginCredential)
        private loginCredentialRepository: Repository<LoginCredential>,
    ) {}

    async create(createLoginCredentialDto: CreateLoginCredentialDto): Promise<LoginCredential> {
        const loginCredential = this.loginCredentialRepository.create(createLoginCredentialDto);
        return this.loginCredentialRepository.save(loginCredential);
    }

    async update(id: string, updateLoginCredentialDto: UpdateLoginCredentialDto): Promise<LoginCredential> {
        await this.loginCredentialRepository.update(id, updateLoginCredentialDto);
        return this.loginCredentialRepository.findOneBy({ id });
    }

    async findAll(): Promise<LoginCredential[]> {
        return this.loginCredentialRepository.find();
    }

    async findOne(id: string): Promise<LoginCredential | null> {
        return this.loginCredentialRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.loginCredentialRepository.delete(id);
    }
}
