import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BillingProvider } from '../models/BillingProvider';
import { CreateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/UpdateBillingProviderDto';
import { handleError, createErrorContext } from '../utils/error-handling';

@Injectable()
export class BillingProviderService {
    private readonly logger = new Logger(BillingProviderService.name);
    private readonly ENTITY_NAME = 'BillingProvider';

    constructor(
        @InjectRepository(BillingProvider)
        private readonly billingProviderRepository: Repository<BillingProvider>,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(): Promise<BillingProvider[]> {
        try {
            return await this.billingProviderRepository.find();
        } catch (error) {
            const handled = handleError<BillingProvider[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return handled ?? [];
        }
    }

    async findOne(id: string): Promise<BillingProvider | null> {
        try {
            const provider = await this.billingProviderRepository.findOne({
                where: { id }
            });

            if (!provider) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return provider;
        } catch (error) {
            const handled = handleError<BillingProvider>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : handled;
        }
    }

    async create(createDto: CreateBillingProviderDto): Promise<BillingProvider> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Check for existing provider with same name
            const existing = await this.billingProviderRepository.findOne({
                where: { name: createDto.name }
            });
            if (existing) {
                throw new ConflictException(`${this.ENTITY_NAME} with name ${createDto.name} already exists`);
            }

            const provider = this.billingProviderRepository.create(createDto);
            const result = await queryRunner.manager.save(BillingProvider, provider);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<BillingProvider>(this.logger, error, createErrorContext(
                'create',
                this.ENTITY_NAME,
                undefined,
                { dto: createDto }
            ));
            if (handled === undefined || handled === null) {
                throw error;
            }
            return handled;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: string, updateDto: UpdateBillingProviderDto): Promise<BillingProvider | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const provider = await this.findOne(id);
            if (!provider) return null;

            // Check name uniqueness if name is being updated
            if (updateDto.name && updateDto.name !== provider.name) {
                const existing = await this.billingProviderRepository.findOne({
                    where: { name: updateDto.name }
                });
                if (existing) {
                    throw new ConflictException(`${this.ENTITY_NAME} with name ${updateDto.name} already exists`);
                }
            }

            // Log status changes
            if (updateDto.isEnabled !== undefined && updateDto.isEnabled !== provider.isEnabled) {
                this.logger.log(`${this.ENTITY_NAME} ${id} enabled status changed to: ${updateDto.isEnabled}`);
            }
            if (updateDto.visible !== undefined && updateDto.visible !== provider.visible) {
                this.logger.log(`${this.ENTITY_NAME} ${id} visibility changed to: ${updateDto.visible}`);
            }

            Object.assign(provider, updateDto);
            const result = await queryRunner.manager.save(BillingProvider, provider);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<BillingProvider>(this.logger, error, createErrorContext(
                'update',
                this.ENTITY_NAME,
                id,
                { dto: updateDto }
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

            await queryRunner.manager.remove(BillingProvider, provider);
            
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
