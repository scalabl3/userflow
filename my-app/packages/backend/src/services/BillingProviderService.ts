import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { BillingProvider } from '../models/BillingProvider';
import { CreateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/UpdateBillingProviderDto';
import { ResponseBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/ResponseBillingProviderDto';
import { ServiceBase } from '../utils/service-utils';

@Injectable()
export class BillingProviderService extends ServiceBase<BillingProvider> {
    protected readonly ENTITY_NAME = 'BillingProvider';
    protected readonly logger = new Logger(BillingProviderService.name);

    constructor(
        @InjectRepository(BillingProvider)
        protected readonly repository: Repository<BillingProvider>,
        protected readonly dataSource: DataSource,
    ) {
        super();
    }

    async findAllBillingProviders(): Promise<ResponseBillingProviderDto[]> {
        const providers = await this.repository.find();
        return this.toResponseDtoArray(providers, ResponseBillingProviderDto);
    }

    async findOneBillingProvider(id: string): Promise<ResponseBillingProviderDto> {
        const provider = await this.repository.findOne({
            where: { id }
        });
        
        await this.validateExists(id);
        return this.toResponseDto(provider, ResponseBillingProviderDto)!;
    }

    async createBillingProvider(createDto: CreateBillingProviderDto): Promise<ResponseBillingProviderDto> {
        return this.withTransaction(async (queryRunner) => {
            // Validate name uniqueness
            await this.validateUniqueness('name', createDto.name);
            
            const entity = await super.create(createDto as DeepPartial<BillingProvider>, queryRunner);
            return this.toResponseDto(entity, ResponseBillingProviderDto)!;
        }, 'create', undefined, { dto: createDto });
    }

    async updateBillingProvider(id: string, updateDto: UpdateBillingProviderDto): Promise<ResponseBillingProviderDto> {
        return this.withTransaction(async (queryRunner) => {
            const provider = await this.validateExists(id);

            // Check name uniqueness if name is being updated
            if (updateDto.name && updateDto.name !== provider.name) {
                await this.validateUniqueness('name', updateDto.name, id);
            }

            // Log status changes
            if (updateDto.isEnabled !== undefined && updateDto.isEnabled !== provider.isEnabled) {
                this.logger.log(`${this.ENTITY_NAME} ${id} enabled status changed to: ${updateDto.isEnabled}`);
            }
            if (updateDto.visible !== undefined && updateDto.visible !== provider.visible) {
                this.logger.log(`${this.ENTITY_NAME} ${id} visibility changed to: ${updateDto.visible}`);
            }

            const entity = await super.update(id, updateDto as DeepPartial<BillingProvider>, queryRunner);
            return this.toResponseDto(entity, ResponseBillingProviderDto)!;
        }, 'update', id, { dto: updateDto });
    }

    async removeBillingProvider(id: string): Promise<void> {
        await this.withTransaction(async (queryRunner) => {
            await super.remove(id, queryRunner);
        }, 'remove', id);
    }
}
