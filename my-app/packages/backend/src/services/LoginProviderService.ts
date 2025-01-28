import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { handleError, createErrorContext } from '../utils/error-handling';

@Injectable()
export class LoginProviderService {
    private readonly logger = new Logger(LoginProviderService.name);
    private readonly ENTITY_NAME = 'LoginProvider';

    constructor(
        @InjectRepository(LoginProvider)
        private readonly loginProviderRepository: Repository<LoginProvider>,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(): Promise<LoginProvider[]> {
        try {
            return await this.loginProviderRepository.find();
        } catch (error) {
            const handled = handleError<LoginProvider[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return handled ?? [];
        }
    }

    async findOne(id: string): Promise<LoginProvider | null> {
        try {
            const provider = await this.loginProviderRepository.findOne({
                where: { id }
            });

            if (!provider) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return provider;
        } catch (error) {
            const handled = handleError<LoginProvider>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : handled;
        }
    }

    async create(createLoginProviderDto: CreateLoginProviderDto): Promise<LoginProvider> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Check for existing provider with same name
            const existing = await this.loginProviderRepository.findOne({
                where: { name: createLoginProviderDto.name }
            });
            if (existing) {
                throw new ConflictException(`${this.ENTITY_NAME} with name ${createLoginProviderDto.name} already exists`);
            }

            const provider = this.loginProviderRepository.create(createLoginProviderDto);
            const result = await queryRunner.manager.save(LoginProvider, provider);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginProvider>(this.logger, error, createErrorContext(
                'create',
                this.ENTITY_NAME,
                undefined,
                { dto: createLoginProviderDto }
            ));
            if (handled === undefined || handled === null) {
                throw error;
            }
            return handled;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: string, updateLoginProviderDto: UpdateLoginProviderDto): Promise<LoginProvider | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const provider = await this.findOne(id);
            if (!provider) return null;

            // Check name uniqueness if name is being updated
            if (updateLoginProviderDto.name && updateLoginProviderDto.name !== provider.name) {
                const existing = await this.loginProviderRepository.findOne({
                    where: { name: updateLoginProviderDto.name }
                });
                if (existing) {
                    throw new ConflictException(`${this.ENTITY_NAME} with name ${updateLoginProviderDto.name} already exists`);
                }
            }

            // Log status changes
            if (updateLoginProviderDto.isEnabled !== undefined && updateLoginProviderDto.isEnabled !== provider.isEnabled) {
                this.logger.log(`${this.ENTITY_NAME} ${id} enabled status changed to: ${updateLoginProviderDto.isEnabled}`);
            }

            Object.assign(provider, updateLoginProviderDto);
            const result = await queryRunner.manager.save(LoginProvider, provider);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginProvider>(this.logger, error, createErrorContext(
                'update',
                this.ENTITY_NAME,
                id,
                { dto: updateLoginProviderDto }
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
            const provider = await this.findOne(id);
            if (!provider) return false;

            await queryRunner.manager.remove(LoginProvider, provider);
            
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
