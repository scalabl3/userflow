import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { BaseUser } from '../models/BaseUser';
import { 
    CreateBaseUserDto,
    UpdateBaseUserDto,
    ResponseBaseUserDto
} from '@my-app/shared';
import { ServiceBase } from '../utils/service-utils';

@Injectable()
export class BaseUserService extends ServiceBase<BaseUser> {
    protected readonly ENTITY_NAME = 'BaseUser';
    protected readonly logger = new Logger(BaseUserService.name);

    constructor(
        @InjectRepository(BaseUser)
        protected readonly repository: Repository<BaseUser>,
        protected readonly dataSource: DataSource,
    ) {
        super();
    }

    async findAllBaseUsers(): Promise<ResponseBaseUserDto[]> {
        const users = await this.findAll();
        return this.toResponseDtoArray(users, ResponseBaseUserDto);
    }

    async findOneBaseUser(id: string): Promise<ResponseBaseUserDto | null> {
        const user = await this.findOne(id);
        return user ? this.toResponseDto(user, ResponseBaseUserDto)! : null;
    }

    async createBaseUser(createDto: CreateBaseUserDto): Promise<ResponseBaseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            const entity = await this.create(createDto as DeepPartial<BaseUser>, queryRunner);
            return this.toResponseDto(entity, ResponseBaseUserDto)!;
        }, 'create', undefined, { dto: createDto });
    }

    async updateBaseUser(id: string, updateDto: UpdateBaseUserDto): Promise<ResponseBaseUserDto | null> {
        return this.withTransaction(async (queryRunner) => {
            const entity = await this.update(id, updateDto as DeepPartial<BaseUser>, queryRunner);
            return entity ? this.toResponseDto(entity, ResponseBaseUserDto)! : null;
        }, 'update', id, { dto: updateDto });
    }

    async removeBaseUser(id: string): Promise<boolean> {
        return this.withTransaction(async (queryRunner) => {
            return this.remove(id, queryRunner);
        }, 'remove', id);
    }

    // Additional domain-specific methods can be added here
}
