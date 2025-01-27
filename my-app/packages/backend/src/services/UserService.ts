import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/User';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }

    async findUserById(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    async updateUser(id: string, updateData: Partial<User>): Promise<User> {
        await this.userRepository.update(id, updateData);
        return this.findUserById(id);
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
