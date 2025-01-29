import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { BaseUser } from '../models/BaseUser';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';
import { ResponseBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/ResponseBaseUserDto';
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

    async createBaseUser(createBaseUserDto: CreateBaseUserDto): Promise<ResponseBaseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            if (!createBaseUserDto.primaryLoginCredentialId) {
                throw new BadRequestException('A user must have at least one login credential');
            }

            const entity = await super.create(createBaseUserDto as DeepPartial<BaseUser>, queryRunner);
            return this.toResponseDto(entity, ResponseBaseUserDto)!;
        }, 'create', undefined, { dto: createBaseUserDto });
    }

    async findAllBaseUsers(): Promise<ResponseBaseUserDto[]> {
        const users = await this.repository.find({
            relations: {
                loginCredentials: true,
                primaryLoginCredential: true
            }
        });
        return this.toResponseDtoArray(users, ResponseBaseUserDto);
    }

    async findOneBaseUser(id: string): Promise<ResponseBaseUserDto> {
        const user = await this.repository.findOne({
            where: { id },
            relations: {
                loginCredentials: true,
                primaryLoginCredential: true
            }
        });
        
        await this.validateExists(id);
        return this.toResponseDto(user, ResponseBaseUserDto)!;
    }

    async updateBaseUser(id: string, updateBaseUserDto: UpdateBaseUserDto): Promise<ResponseBaseUserDto> {
        return this.withTransaction(async (queryRunner) => {
            await this.validateExists(id);

            // Only check primaryLoginCredentialId if it's included in the update
            if ('primaryLoginCredentialId' in updateBaseUserDto) {
                if (!updateBaseUserDto.primaryLoginCredentialId) {
                    throw new BadRequestException('A user must maintain at least one login credential');
                }
            }

            const entity = await super.update(id, updateBaseUserDto as DeepPartial<BaseUser>, queryRunner);
            return this.toResponseDto(entity, ResponseBaseUserDto)!;
        }, 'update', id, { dto: updateBaseUserDto });
    }

    async removeBaseUser(id: string): Promise<void> {
        await this.withTransaction(async (queryRunner) => {
            await super.remove(id, queryRunner);
        }, 'remove', id);
    }
}
