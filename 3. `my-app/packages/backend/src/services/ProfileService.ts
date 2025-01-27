import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../models/Profile';
import { CreateProfileDto } from '@my-app/shared/dist/dtos/Profile/CreateProfileDto';
import { UpdateProfileDto } from '@my-app/shared/dist/dtos/Profile/UpdateProfileDto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) {}

    async findAll(): Promise<Profile[]> {
        return await this.profileRepository.find({ relations: ['user'] });
    }

    async findOne(id: string): Promise<Profile> {
        const profile = await this.profileRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!profile) {
            throw new NotFoundException(`Profile with ID ${id} not found`);
        }
        return profile;
    }

    async create(createProfileDto: CreateProfileDto): Promise<Profile> {
        const profile = this.profileRepository.create(createProfileDto);
        return await this.profileRepository.save(profile);
    }

    async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
        const profile = await this.profileRepository.preload({
            id: id,
            ...updateProfileDto,
        });
        if (!profile) {
            throw new NotFoundException(`Profile with ID ${id} not found`);
        }
        return await this.profileRepository.save(profile);
    }

    async remove(id: string): Promise<void> {
        const profile = await this.findOne(id);
        await this.profileRepository.remove(profile);
    }
}
