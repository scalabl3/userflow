import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizationDto } from '@my-app/shared/src/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/src/dtos/Organization/UpdateOrganizationDto';
import { Organization } from '../models/Organization';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { IOrganizationService } from './OrganizationService.spec';

@Injectable()
export class OrganizationService implements IOrganizationService {
    constructor(
        @InjectRepository(OrganizationRepository)
        private readonly organizationRepository: OrganizationRepository,
    ) {}

    async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        const organization = this.organizationRepository.create(createOrganizationDto);
        return await this.organizationRepository.save(organization);
    }

    async getOrganizationById(id: string): Promise<Organization | null> {
        const organization = await this.organizationRepository.findOne({ where: { id } });
        if (!organization) {
            throw new NotFoundException(`Organization with id ${id} not found`);
        }
        return organization;
    }

    async updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
        const organization = await this.getOrganizationById(id);
        Object.assign(organization, updateOrganizationDto);
        return await this.organizationRepository.save(organization);
    }

    async deleteOrganization(id: string): Promise<boolean> {
        const result = await this.organizationRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Organization with id ${id} not found`);
        }
        return true;
    }

    async getAllOrganizations(): Promise<Organization[]> {
        return await this.organizationRepository.find();
    }
}
