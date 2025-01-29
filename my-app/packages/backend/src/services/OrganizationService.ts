import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { Organization } from '../models/Organization';
import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/UpdateOrganizationDto';
import { ResponseOrganizationDto } from '@my-app/shared/dist/dtos/Organization/ResponseOrganizationDto';
import { ServiceBase } from '../utils/service-utils';

@Injectable()
export class OrganizationService extends ServiceBase<Organization> {
    protected readonly ENTITY_NAME = 'Organization';
    protected readonly logger = new Logger(OrganizationService.name);

    constructor(
        @InjectRepository(Organization)
        protected readonly repository: Repository<Organization>,
        protected readonly dataSource: DataSource,
    ) {
        super();
    }

    async findAllOrganizations(): Promise<ResponseOrganizationDto[]> {
        const organizations = await this.repository.find({
            relations: ['users', 'adminUser']
        });
        return this.toResponseDtoArray(organizations, ResponseOrganizationDto);
    }

    async findOneOrganization(id: string): Promise<ResponseOrganizationDto> {
        const organization = await this.repository.findOne({
            where: { id },
            relations: ['users', 'adminUser']
        });
        
        await this.validateExists(id);
        return this.toResponseDto(organization, ResponseOrganizationDto)!;
    }

    async createOrganization(createDto: CreateOrganizationDto): Promise<ResponseOrganizationDto> {
        return this.withTransaction(async (queryRunner) => {
            // Validate name uniqueness
            await this.validateUniqueness('name', createDto.name);
            
            const entity = await super.create(createDto as DeepPartial<Organization>, queryRunner);
            return this.toResponseDto(entity, ResponseOrganizationDto)!;
        }, 'create', undefined, { dto: createDto });
    }

    async updateOrganization(id: string, updateDto: UpdateOrganizationDto): Promise<ResponseOrganizationDto> {
        return this.withTransaction(async (queryRunner) => {
            const organization = await this.validateExists(id);

            // Check name uniqueness if name is being updated
            if (updateDto.name && updateDto.name !== organization.name) {
                await this.validateUniqueness('name', updateDto.name, id);
            }

            // Verify new admin user exists in organization if being updated
            if (updateDto.adminUser && updateDto.adminUser !== organization.adminUser) {
                const adminExists = organization.users.some(user => user.id === updateDto.adminUser);
                if (!adminExists) {
                    throw new BadRequestException('Admin user must be a member of the organization');
                }
                this.logger.log(`${this.ENTITY_NAME} ${id} admin changed to user: ${updateDto.adminUser}`);
            }

            // Log visibility changes
            if (updateDto.visible !== undefined && updateDto.visible !== organization.visible) {
                this.logger.log(`${this.ENTITY_NAME} ${id} visibility changed to: ${updateDto.visible}`);
            }

            const entity = await super.update(id, updateDto as DeepPartial<Organization>, queryRunner);
            return this.toResponseDto(entity, ResponseOrganizationDto)!;
        }, 'update', id, { dto: updateDto });
    }

    async removeOrganization(id: string): Promise<void> {
        await this.withTransaction(async (queryRunner) => {
            const organization = await this.validateExists(id);

            // Check if organization has active users
            if (organization.users.length > 0) {
                throw new BadRequestException('Cannot delete organization with active users');
            }

            await super.remove(id, queryRunner);
        }, 'remove', id);
    }
}
