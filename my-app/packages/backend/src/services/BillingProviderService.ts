import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BillingProvider } from '../models/BillingProvider';
import { CreateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/UpdateBillingProviderDto';
import { ResponseBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/ResponseBillingProviderDto';
import { handleError, createErrorContext } from '../utils/error-handling';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BillingProviderService {
    private readonly logger = new Logger(BillingProviderService.name);
    private readonly ENTITY_NAME = 'BillingProvider';

    constructor(
        @InjectRepository(BillingProvider)
        private readonly billingProviderRepository: Repository<BillingProvider>,
        private readonly dataSource: DataSource,
    ) {}

    private transformResponse(data: BillingProvider[]): ResponseBillingProviderDto[];
    private transformResponse(data: BillingProvider): ResponseBillingProviderDto;
    private transformResponse(data: BillingProvider | BillingProvider[]): ResponseBillingProviderDto | ResponseBillingProviderDto[] {
        if (Array.isArray(data)) {
            return data.map(item => plainToClass(ResponseBillingProviderDto, item, { excludeExtraneousValues: true }));
        }
        return plainToClass(ResponseBillingProviderDto, data, { excludeExtraneousValues: true });
    }

    private transformResponseOrNull(data: BillingProvider | null): ResponseBillingProviderDto | null {
        return data ? this.transformResponse(data) : null;
    }

    async findAll(): Promise<ResponseBillingProviderDto[]> {
        try {
            const providers = await this.billingProviderRepository.find();
            return this.transformResponse(providers);
        } catch (error) {
            const handled = handleError<BillingProvider[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return this.transformResponse(handled ?? []);
        }
    }

    async findOne(id: string): Promise<ResponseBillingProviderDto | null> {
        try {
            const provider = await this.billingProviderRepository.findOne({
                where: { id }
            });

            if (!provider) {
                throw new NotFoundException(`${this.ENTITY_NAME} with ID ${id} not found`);
            }

            return this.transformResponse(provider);
        } catch (error) {
            const handled = handleError<BillingProvider>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : this.transformResponseOrNull(handled);
        }
    }

    async create(createDto: CreateBillingProviderDto): Promise<ResponseBillingProviderDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateUnique(createDto.name);
            
            const provider = this.billingProviderRepository.create(createDto);
            const result = await queryRunner.manager.save(BillingProvider, provider);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return this.transformResponse(result);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<BillingProvider>(this.logger, error, createErrorContext(
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

    async update(id: string, updateDto: UpdateBillingProviderDto): Promise<ResponseBillingProviderDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const provider = await this.findOneOrFail(id);
            await this.validateUpdate(id, updateDto);
            
            this.logChanges(id, provider, updateDto);
            Object.assign(provider, updateDto);
            
            const result = await queryRunner.manager.save(BillingProvider, provider);
            await queryRunner.commitTransaction();
            
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return this.transformResponse(result);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<BillingProvider>(this.logger, error, createErrorContext(
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
            const provider = await this.findOneOrFail(id);
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

    private async findOneOrFail(id: string): Promise<BillingProvider> {
        const entity = await this.billingProviderRepository.findOne({
            where: { id }
        });
        if (!entity) {
            throw new NotFoundException(`${this.ENTITY_NAME} with ID ${id} not found`);
        }
        return entity;
    }

    private async validateUnique(name: string): Promise<void> {
        const existing = await this.billingProviderRepository.findOne({
            where: { name }
        });
        if (existing) {
            throw new ConflictException(`${this.ENTITY_NAME} with name ${name} already exists`);
        }
    }

    private async validateUpdate(id: string, updateDto: UpdateBillingProviderDto): Promise<void> {
        if (updateDto.name) {
            const existing = await this.billingProviderRepository.findOne({
                where: { name: updateDto.name }
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`${this.ENTITY_NAME} with name ${updateDto.name} already exists`);
            }
        }
    }

    private logChanges(id: string, entity: BillingProvider, updateDto: UpdateBillingProviderDto): void {
        if (updateDto.isEnabled !== undefined && updateDto.isEnabled !== entity.isEnabled) {
            this.logger.log(`${this.ENTITY_NAME} ${id} enabled status changed to: ${updateDto.isEnabled}`);
        }
        if (updateDto.visible !== undefined && updateDto.visible !== entity.visible) {
            this.logger.log(`${this.ENTITY_NAME} ${id} visibility changed to: ${updateDto.visible}`);
        }
    }
}
