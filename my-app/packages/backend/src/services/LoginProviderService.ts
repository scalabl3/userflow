import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';
import { handleError, createErrorContext } from '../utils/error-handling';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LoginProviderService {
    private readonly logger = new Logger(LoginProviderService.name);
    private readonly ENTITY_NAME = 'LoginProvider';

    constructor(
        @InjectRepository(LoginProvider)
        private readonly loginProviderRepository: Repository<LoginProvider>,
        private readonly dataSource: DataSource,
    ) {}

    private transformResponse(data: LoginProvider[]): ResponseLoginProviderDto[];
    private transformResponse(data: LoginProvider): ResponseLoginProviderDto;
    private transformResponse(data: LoginProvider | LoginProvider[]): ResponseLoginProviderDto | ResponseLoginProviderDto[] {
        if (Array.isArray(data)) {
            return data.map(item => plainToClass(ResponseLoginProviderDto, item, { excludeExtraneousValues: true }));
        }
        return plainToClass(ResponseLoginProviderDto, data, { excludeExtraneousValues: true });
    }

    private transformResponseOrNull(data: LoginProvider | null): ResponseLoginProviderDto | null {
        return data ? this.transformResponse(data) : null;
    }

    async findAll(): Promise<ResponseLoginProviderDto[]> {
        try {
            const providers = await this.loginProviderRepository.find();
            return this.transformResponse(providers);
        } catch (error) {
            const handled = handleError<LoginProvider[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return this.transformResponse(handled ?? []);
        }
    }

    async findOne(id: string): Promise<ResponseLoginProviderDto | null> {
        try {
            const provider = await this.loginProviderRepository.findOne({
                where: { id }
            });

            if (!provider) {
                throw new NotFoundException(`${this.ENTITY_NAME} with ID ${id} not found`);
            }

            return this.transformResponse(provider);
        } catch (error) {
            const handled = handleError<LoginProvider>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : this.transformResponseOrNull(handled);
        }
    }

    async create(createDto: CreateLoginProviderDto): Promise<ResponseLoginProviderDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.validateUnique('code', createDto.code);
            
            const provider = this.loginProviderRepository.create(createDto);
            const result = await queryRunner.manager.save(LoginProvider, provider);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return this.transformResponse(result);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginProvider>(this.logger, error, createErrorContext(
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

    async update(id: string, updateDto: UpdateLoginProviderDto): Promise<ResponseLoginProviderDto | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const provider = await this.findOneOrFail(id);
            await this.validateUpdate(id, updateDto);
            
            this.logChanges(id, provider, updateDto);
            Object.assign(provider, updateDto);
            
            const result = await queryRunner.manager.save(LoginProvider, provider);
            await queryRunner.commitTransaction();
            
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return this.transformResponse(result);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<LoginProvider>(this.logger, error, createErrorContext(
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

    private async findOneOrFail(id: string): Promise<LoginProvider> {
        const entity = await this.loginProviderRepository.findOne({
            where: { id }
        });
        if (!entity) {
            throw new NotFoundException(`${this.ENTITY_NAME} with ID ${id} not found`);
        }
        return entity;
    }

    private async validateUnique(field: string, value: string): Promise<void> {
        const existing = await this.loginProviderRepository.findOne({
            where: { [field]: value }
        });
        if (existing) {
            throw new ConflictException(`${this.ENTITY_NAME} with ${field} ${value} already exists`);
        }
    }

    private async validateUpdate(id: string, updateDto: UpdateLoginProviderDto): Promise<void> {
        if (updateDto.code) {
            const existing = await this.loginProviderRepository.findOne({
                where: { code: updateDto.code }
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`${this.ENTITY_NAME} with code ${updateDto.code} already exists`);
            }
        }
    }

    private logChanges(id: string, entity: LoginProvider, updateDto: UpdateLoginProviderDto): void {
        if (updateDto.isEnabled !== undefined && updateDto.isEnabled !== entity.isEnabled) {
            this.logger.log(`${this.ENTITY_NAME} ${id} enabled status changed to: ${updateDto.isEnabled}`);
        }
    }
}
