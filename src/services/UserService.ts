import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../models/User';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { handleError, createErrorContext } from '../utils/error-handling';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private readonly ENTITY_NAME = 'User';

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(): Promise<User[]> {
        try {
            return await this.userRepository.find({
                relations: ['organization']
            });
        } catch (error) {
            const handled = handleError<User[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return handled ?? [];
        }
    }

    async findOne(id: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ['organization']
            });

            if (!user) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return user;
        } catch (error) {
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : handled;
        }
    }

    async create(createUserDto: CreateUserDto): Promise<User | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Check username uniqueness
            const existingUser = await this.userRepository.findOne({
                where: { username: createUserDto.username }
            });
            if (existingUser) {
                throw new ConflictException(`${this.ENTITY_NAME} with username ${createUserDto.username} already exists`);
            }

            const user = this.userRepository.create(createUserDto);
            const result = await queryRunner.manager.save(User, user);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'create',
                this.ENTITY_NAME,
                undefined,
                { dto: createUserDto }
            ));
            if (handled === undefined || handled === null) {
                throw error;
            }
            return handled;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.findOne(id);
            if (!user) return null;
            
            // Check username uniqueness if it's being updated
            if (updateUserDto.username && updateUserDto.username !== user.username) {
                const existingUser = await this.userRepository.findOne({
                    where: { username: updateUserDto.username }
                });
                if (existingUser) {
                    throw new ConflictException(`${this.ENTITY_NAME} with username ${updateUserDto.username} already exists`);
                }
            }
            
            Object.assign(user, updateUserDto);
            const result = await queryRunner.manager.save(User, user);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'update',
                this.ENTITY_NAME,
                id,
                { dto: updateUserDto }
            ));
            return handled === undefined ? null : handled;
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.findOne(id);
            if (!user) return false;

            await queryRunner.manager.remove(User, user);
            
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

    async findByUsername(username: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { username },
                relations: ['organization']
            });

            if (!user) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return user;
        } catch (error) {
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'findByUsername',
                this.ENTITY_NAME,
                undefined,
                { username }
            ));
            return handled === undefined ? null : handled;
        }
    }
} 