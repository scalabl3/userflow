import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUser } from '../models/BaseUser';
import { CreateBaseUserDto } from '@shared/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@shared/dtos/BaseUser/UpdateBaseUserDto';

@Injectable()
export class BaseUserService {
    constructor(
        @InjectRepository(BaseUser)
        private readonly baseUserRepository: Repository<BaseUser>,
    ) {}

    async create(createBaseUserDto: CreateBaseUserDto): Promise<BaseUser> {
        const baseUser = this.baseUserRepository.create(createBaseUserDto);
        return await this.baseUserRepository.save(baseUser);
    }

    async findAll(): Promise<BaseUser[]> {
        return await this.baseUserRepository.find({
            relations: ['loginCredentials', 'primaryLoginCredential'],
        });
    }

    async findOne(id: string): Promise<BaseUser | undefined> {
        return await this.baseUserRepository.findOne(id, {
            relations: ['loginCredentials', 'primaryLoginCredential'],
        });
    }

    async update(id: string, updateBaseUserDto: UpdateBaseUserDto): Promise<BaseUser> {
        await this.baseUserRepository.update(id, updateBaseUserDto);
        return this.findOne(id) as Promise<BaseUser>;
    }

    async remove(id: string): Promise<void> {
        await this.baseUserRepository.delete(id);
    }
}
