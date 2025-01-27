import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { LoginProvider } from '../models/LoginProvider';

@Injectable()
export class LoginProviderService {
    constructor(
        @InjectRepository(LoginProvider)
        private readonly loginProviderRepository: Repository<LoginProvider>,
    ) {}

    async findAll(): Promise<LoginProvider[]> {
        return await this.loginProviderRepository.find();
    }

    async findOne(id: string): Promise<LoginProvider | null> {
        return await this.loginProviderRepository.findOneBy({ id });
    }

    async create(createLoginProviderDto: CreateLoginProviderDto): Promise<LoginProvider> {
        const loginProvider = this.loginProviderRepository.create(createLoginProviderDto);
        return await this.loginProviderRepository.save(loginProvider);
    }

    async update(id: string, updateLoginProviderDto: UpdateLoginProviderDto): Promise<LoginProvider | null> {
        const loginProvider = await this.loginProviderRepository.findOneBy({ id });
        if (!loginProvider) {
            return null;
        }
        
        Object.assign(loginProvider, updateLoginProviderDto);
        return await this.loginProviderRepository.save(loginProvider);
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.loginProviderRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
