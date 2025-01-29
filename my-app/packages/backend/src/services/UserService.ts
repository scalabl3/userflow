import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { User } from '../models/User';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { ResponseUserDto } from '@my-app/shared/dist/dtos/User/ResponseUserDto';
import { handleError, createErrorContext } from '../utils/error-handling';
import { plainToClass } from 'class-transformer';
import { ServiceBase } from '../utils/service-utils';

@Injectable()
export class UserService extends ServiceBase<User> {
    protected readonly ENTITY_NAME = 'User';
    protected readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        protected readonly repository: Repository<User>,
        protected readonly dataSource: DataSource,
    ) {
        super();
    }

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

    async findAllUsers(): Promise<ResponseUserDto[]> {
        const users = await this.repository.find({
            relations: ['organization']
        });
        return this.toResponseDtoArray(users, ResponseUserDto);
    }

    async findOneUser(id: string): Promise<ResponseUserDto> {
        const user = await this.repository.findOne({
            where: { id },
            relations: ['organization']
        });
        
        await this.validateExists(id);
        return this.toResponseDto(user, ResponseUserDto)!;
    }

    async findByUsername(username: string): Promise<ResponseUserDto> {
        const user = await this.repository.findOne({
            where: { username },
            relations: ['organization']
        });

        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        return this.toResponseDto(user, ResponseUserDto)!;
    }

    async createUser(createDto: CreateUserDto): Promise<ResponseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            // Validate username uniqueness
            await this.validateUniqueness('username', createDto.username);
            
            const entity = await super.create(createDto as DeepPartial<User>, queryRunner);
            return this.toResponseDto(entity, ResponseUserDto)!;
        }, 'create', undefined, { dto: createDto });
    }

    async updateUser(id: string, updateDto: UpdateUserDto): Promise<ResponseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            const user = await this.validateExists(id);

            // Check username uniqueness if username is being updated
            if (updateDto.username && updateDto.username !== user.username) {
                await this.validateUniqueness('username', updateDto.username, id);
            }

            const entity = await super.update(id, updateDto as DeepPartial<User>, queryRunner);

            // Log specific changes after update
            if (updateDto.organizationId !== undefined && updateDto.organizationId !== user.organizationId) {
                this.logger.log(`${this.ENTITY_NAME} ${id} organization changed to: ${updateDto.organizationId}`);
            }

            return this.toResponseDto(entity, ResponseUserDto)!;
        }, 'update', id, { dto: updateDto });
    }

    async removeUser(id: string): Promise<void> {
        await this.withTransaction(async (queryRunner) => {
            await super.remove(id, queryRunner);
        }, 'remove', id);
    }

    private async findOneOrFail(id: string): Promise<User> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['organization']
        });
        if (!entity) {
            throw new NotFoundException(`${this.ENTITY_NAME} with ID ${id} not found`);
        }
        return entity;
    }

    private async validateUnique(field: string, value: string): Promise<void> {
        const existing = await this.repository.findOne({
            where: { [field]: value }
        });
        if (existing) {
            throw new ConflictException(`${this.ENTITY_NAME} with ${field} ${value} already exists`);
        }
    }

    private async validateUpdate(id: string, updateDto: UpdateUserDto): Promise<void> {
        if (updateDto.username) {
            const existing = await this.repository.findOne({
                where: { username: updateDto.username }
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`${this.ENTITY_NAME} with username ${updateDto.username} already exists`);
            }
        }
    }
}
