import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUser } from '../models/BaseUser';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';

@Injectable()
export class BaseUserService {
    constructor(
        @InjectRepository(BaseUser)
        private readonly baseUserRepository: Repository<BaseUser>,
    ) {}

    async create(createBaseUserDto: CreateBaseUserDto): Promise<BaseUser> {
        const baseUser = this.baseUserRepository.create(createBaseUserDto);
        const savedUser = await this.baseUserRepository.save(baseUser);
        return savedUser;
    }

    async findAll(): Promise<BaseUser[]> {
        return await this.baseUserRepository.find({
            relations: {
                loginCredentials: true,
                primaryLoginCredential: true
            }
        });
    }

    async findOne(id: string): Promise<BaseUser | null> {
        return await this.baseUserRepository.findOne({
            where: { id },
            relations: {
                loginCredentials: true,
                primaryLoginCredential: true
            }
        });
    }

    async update(id: string, updateBaseUserDto: UpdateBaseUserDto): Promise<BaseUser | null> {
        await this.baseUserRepository.update(id, updateBaseUserDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.baseUserRepository.delete(id);
    }
}
