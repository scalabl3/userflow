import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Organization } from '../models/Organization';
import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/UpdateOrganizationDto';
import { handleError, createErrorContext } from '../utils/error-handling';

@Injectable()
export class OrganizationService {
    private readonly logger = new Logger(OrganizationService.name);
    private readonly ENTITY_NAME = 'Organization';

    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        private readonly dataSource: DataSource,
    ) {}

    async findAll(): Promise<Organization[]> {
        try {
            return await this.organizationRepository.find({
                relations: ['users', 'adminUser']
            });
        } catch (error) {
            const handled = handleError<Organization[]>(this.logger, error, createErrorContext(
                'findAll',
                this.ENTITY_NAME
            ));
            if (handled === undefined) {
                throw error;
            }
            return handled ?? [];
        }
    }

    async findOne(id: string): Promise<Organization | null> {
        try {
            const organization = await this.organizationRepository.findOne({
                where: { id },
                relations: ['users', 'adminUser']
            });

            if (!organization) {
                throw new NotFoundException(`${this.ENTITY_NAME} not found`);
            }

            return organization;
        } catch (error) {
            const handled = handleError<Organization>(this.logger, error, createErrorContext(
                'findOne',
                this.ENTITY_NAME,
                id
            ));
            return handled === undefined ? null : handled;
        }
    }

    async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Check for existing organization with same name
            const existing = await this.organizationRepository.findOne({
                where: { name: createOrganizationDto.name }
            });
            if (existing) {
                throw new ConflictException(`${this.ENTITY_NAME} with name ${createOrganizationDto.name} already exists`);
            }

            const organization = this.organizationRepository.create(createOrganizationDto);
            const result = await queryRunner.manager.save(Organization, organization);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Created ${this.ENTITY_NAME}: ${result.id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<Organization>(this.logger, error, createErrorContext(
                'create',
                this.ENTITY_NAME,
                undefined,
                { dto: createOrganizationDto }
            ));
            if (handled === undefined || handled === null) {
                throw error;
            }
            return handled;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const organization = await this.findOne(id);
            if (!organization) return null;

            // Check name uniqueness if name is being updated
            if (updateOrganizationDto.name && updateOrganizationDto.name !== organization.name) {
                const existing = await this.organizationRepository.findOne({
                    where: { name: updateOrganizationDto.name }
                });
                if (existing) {
                    throw new ConflictException(`${this.ENTITY_NAME} with name ${updateOrganizationDto.name} already exists`);
                }
            }

            // Verify new admin user exists in organization if being updated
            if (updateOrganizationDto.adminUser && updateOrganizationDto.adminUser !== organization.adminUser) {
                const adminExists = organization.users.some(user => user.id === updateOrganizationDto.adminUser);
                if (!adminExists) {
                    throw new BadRequestException('Admin user must be a member of the organization');
                }
                this.logger.log(`${this.ENTITY_NAME} ${id} admin changed to user: ${updateOrganizationDto.adminUser}`);
            }

            // Log visibility changes
            if (updateOrganizationDto.visible !== undefined && updateOrganizationDto.visible !== organization.visible) {
                this.logger.log(`${this.ENTITY_NAME} ${id} visibility changed to: ${updateOrganizationDto.visible}`);
            }

            Object.assign(organization, updateOrganizationDto);
            const result = await queryRunner.manager.save(Organization, organization);
            
            await queryRunner.commitTransaction();
            this.logger.log(`Updated ${this.ENTITY_NAME}: ${id}`);
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const handled = handleError<Organization>(this.logger, error, createErrorContext(
                'update',
                this.ENTITY_NAME,
                id,
                { dto: updateOrganizationDto }
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
            const organization = await this.findOne(id);
            if (!organization) return false;

            // Check if organization has active users
            if (organization.users.length > 0) {
                throw new BadRequestException('Cannot delete organization with active users');
            }

            await queryRunner.manager.remove(Organization, organization);
            
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
