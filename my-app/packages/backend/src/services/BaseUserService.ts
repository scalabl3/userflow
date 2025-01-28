import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BaseUser } from '../models/BaseUser';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';
import { handleError, createErrorContext } from '../utils/error-handling';

@Injectable()
export class BaseUserService {
    private readonly logger = new Logger(BaseUserService.name);
    private readonly ENTITY_NAME = 'BaseUser';

    constructor(
        @InjectRepository(BaseUser)
        private readonly baseUserRepository: Repository<BaseUser>,
        private readonly dataSource: DataSource,
    ) {}

    async create(createBaseUserDto: CreateBaseUserDto): Promise<BaseUser> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (!createBaseUserDto.primaryLoginCredentialId) {
                throw new BadRequestException('A user must have at least one login credential');
            }

            const baseUser = this.baseUserRepository.create(createBaseUserDto);
            const result = await queryRunner.manager.save(BaseUser, baseUser);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<BaseUser>(this.logger, error, createErrorContext(
                'create',
                this.ENTITY_NAME,
                undefined,
                { dto: createBaseUserDto }
            ));
            if (handled === undefined || handled === null) {
                throw error;
            }
            return handled;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<BaseUser[]> {
        try {
            return await this.baseUserRepository.find({
                relations: {
                    loginCredentials: true,
                    primaryLoginCredential: true
                }
            });
        } catch (error) {
            const handled = handleError<BaseUser[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return handled ?? [];
        }
    }

    async findOne(id: string): Promise<BaseUser | null> {
        try {
            const user = await this.baseUserRepository.findOne({
                where: { id },
                relations: {
                    loginCredentials: true,
                    primaryLoginCredential: true
                }
            });

            if (!user) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return user;
        } catch (error) {
            const handled = handleError<BaseUser>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : handled;
        }
    }

    async update(id: string, updateBaseUserDto: UpdateBaseUserDto): Promise<BaseUser | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.findOne(id);
            if (!user) return null;

            // Only check primaryLoginCredentialId if it's included in the update
            if ('primaryLoginCredentialId' in updateBaseUserDto) {
                if (updateBaseUserDto.primaryLoginCredentialId === null || updateBaseUserDto.primaryLoginCredentialId === undefined) {
                    throw new BadRequestException('A user must maintain at least one login credential');
                }
            }

            Object.assign(user, updateBaseUserDto);
            const result = await queryRunner.manager.save(BaseUser, user);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<BaseUser>(this.logger, error, createErrorContext(
                'update',
                this.ENTITY_NAME,
                id,
                { dto: updateBaseUserDto }
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

            await queryRunner.manager.remove(BaseUser, user);
            
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
}
