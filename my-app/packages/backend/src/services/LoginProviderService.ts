import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';
import { handleError, createErrorContext } from '../utils/error-handling';
import { plainToClass } from 'class-transformer';
import { ServiceBase } from '../utils/service-utils';

@Injectable()
export class LoginProviderService extends ServiceBase<LoginProvider> {
    protected readonly ENTITY_NAME = 'LoginProvider';
    protected readonly logger = new Logger(LoginProviderService.name);

    constructor(
        @InjectRepository(LoginProvider)
        protected readonly repository: Repository<LoginProvider>,
        protected readonly dataSource: DataSource,
    ) {
        super();
    }

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

    async createLoginProvider(createDto: CreateLoginProviderDto): Promise<ResponseLoginProviderDto> {
        return this.withTransaction(async (queryRunner) => {
            await this.validateUniqueness('code', createDto.code);
            
            const entity = await this.create(createDto as DeepPartial<LoginProvider>, queryRunner);
            return this.toResponseDto(entity, ResponseLoginProviderDto)!;
        }, 'create', undefined, { dto: createDto });
    }

    async findAllLoginProviders(): Promise<ResponseLoginProviderDto[]> {
        const providers = await this.findAll();
        return this.toResponseDtoArray(providers, ResponseLoginProviderDto);
    }

    async findOneLoginProvider(id: string): Promise<ResponseLoginProviderDto | null> {
        const provider = await this.findOne(id);
        return provider ? this.toResponseDto(provider, ResponseLoginProviderDto)! : null;
    }

    async updateLoginProvider(id: string, updateDto: UpdateLoginProviderDto): Promise<ResponseLoginProviderDto | null> {
        return this.withTransaction(async (queryRunner) => {
            const existing = await this.findOne(id);
            if (!existing) {
                return null;
            }

            // Validate code uniqueness if it's being updated
            if (updateDto.code) {
                await this.validateUniqueness('code', updateDto.code, id);
            }

            const entity = await this.update(id, updateDto as DeepPartial<LoginProvider>, queryRunner);
            if (!entity) {
                return null;
            }

            // Log enabled status change specifically
            if (updateDto.isEnabled !== undefined && updateDto.isEnabled !== existing.isEnabled) {
                this.logger.log(`${this.ENTITY_NAME} ${id} enabled status changed to: ${updateDto.isEnabled}`);
            }

            return this.toResponseDto(entity, ResponseLoginProviderDto)!;
        }, 'update', id, { dto: updateDto });
    }

    async removeLoginProvider(id: string): Promise<boolean> {
        return this.withTransaction(async (queryRunner) => {
            return this.remove(id, queryRunner);
        }, 'remove', id);
    }

    private async findOneOrFail(id: string): Promise<LoginProvider> {
        const entity = await this.repository.findOne({
            where: { id }
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

    private async validateUpdate(id: string, updateDto: UpdateLoginProviderDto): Promise<void> {
        if (updateDto.code) {
            const existing = await this.repository.findOne({
                where: { code: updateDto.code }
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(`${this.ENTITY_NAME} with code ${updateDto.code} already exists`);
            }
        }
    }

    protected logChanges(original: LoginProvider, updated: DeepPartial<LoginProvider>, context: string): void {
        if (updated.isEnabled !== undefined && updated.isEnabled !== original.isEnabled) {
            this.logger.log(`${this.ENTITY_NAME} ${original.id} enabled status changed to: ${updated.isEnabled}`);
        }
    }
}
