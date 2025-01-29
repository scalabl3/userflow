import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../models/User';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { ResponseUserDto } from '@my-app/shared/dist/dtos/User/ResponseUserDto';
import { handleError, createErrorContext } from '../utils/error-handling';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    private readonly ENTITY_NAME = 'User';

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) {}

    private transformResponse(data: User[]): ResponseUserDto[];
    private transformResponse(data: User): ResponseUserDto;
    private transformResponse(data: User | User[]): ResponseUserDto | ResponseUserDto[] {
        if (Array.isArray(data)) {
            return data.map(item => plainToClass(ResponseUserDto, item, { excludeExtraneousValues: true }));
        }
        return plainToClass(ResponseUserDto, data, { excludeExtraneousValues: true });
    }

    private transformResponseOrNull(data: User | null): ResponseUserDto | null {
        return data ? this.transformResponse(data) : null;
    }

    async findAll(): Promise<ResponseUserDto[]> {
        try {
            const users = await this.userRepository.find({
                relations: ['organization']
            });
            return this.transformResponse(users);
        } catch (error) {
            const handled = handleError<User[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return this.transformResponse(handled ?? []);
        }
    }

    async findOne(id: string): Promise<ResponseUserDto | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ['organization']
            });

            if (!user) {
                throw new NotFoundException(`${this.ENTITY_NAME} with ID ${id} not found`);
            }

            return this.transformResponse(user);
        } catch (error) {
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : this.transformResponseOrNull(handled);
        }
    }

    async findByUsername(username: string): Promise<ResponseUserDto | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { username },
                relations: ['organization']
            });

            if (!user) {
                throw new NotFoundException(`${this.ENTITY_NAME} with username ${username} not found`);
            }

            return this.transformResponse(user);
        } catch (error) {
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'findByUsername',
                this.ENTITY_NAME,
                undefined,
                { username }
            ));
            return handled === undefined ? null : this.transformResponseOrNull(handled);
        }
    }

    async create(createDto: CreateUserDto): Promise<ResponseUserDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateUnique('username', createDto.username);
            
            const user = this.userRepository.create(createDto);
            const result = await queryRunner.manager.save(User, user);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return this.transformResponse(result);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'create',
                this.ENTITY_NAME,
                undefined,
                { dto: createDto }
            ));
            return handled === undefined ? null : this.transformResponseOrNull(handled);
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: string, updateDto: UpdateUserDto): Promise<ResponseUserDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.findOneOrFail(id);
            await this.validateUpdate(id, updateDto);
            
            this.logChanges(id, user, updateDto);
            Object.assign(user, updateDto);
            
            const result = await queryRunner.manager.save(User, user);
            await queryRunner.commitTransaction();
            
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return this.transformResponse(result);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<User>(this.logger, error, createErrorContext(
                'update',
                this.ENTITY_NAME,
                id,
                { dto: updateDto }
            ));
            return handled === undefined ? null : this.transformResponseOrNull(handled);
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.findOneOrFail(id);
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

    private async findOneOrFail(id: string): Promise<User> {
        const entity = await this.userRepository.findOne({
            where: { id },
            relations: ['organization']
        });
        if (!entity) {
            throw new NotFoundException(`${this.ENTITY_NAME} with ID ${id} not found`);
        }
        return entity;
    }

    private async validateUnique(field: string, value: string): Promise<void> {
        const existing = await this.userRepository.findOne({
            where: { [field]: value }
        });
        if (existing) {
            throw new ConflictException(`${this.ENTITY_NAME} with ${field} ${value} already exists`);
        }
    }

    private async validateUpdate(id: string, updateDto: UpdateUserDto): Promise<void> {
        if (updateDto.username) {
            const existing = await this.userRepository.findOne({
                where: { username: updateDto.username }
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`${this.ENTITY_NAME} with username ${updateDto.username} already exists`);
            }
        }
    }

    private logChanges(id: string, entity: User, updateDto: UpdateUserDto): void {
        if (updateDto.organizationId !== undefined && updateDto.organizationId !== entity.organizationId) {
            this.logger.log(`${this.ENTITY_NAME} ${id} organization changed to: ${updateDto.organizationId}`);
        }
    }
}
