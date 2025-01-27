import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/UpdateOrganizationDto';
import { Organization } from '../models/Organization';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
    ) {}

    async findAll(): Promise<Organization[]> {
        return await this.organizationRepository.find();
    }

    async findOne(id: string): Promise<Organization | null> {
        return await this.organizationRepository.findOneBy({ id });
    }

    async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        const organization = this.organizationRepository.create(createOrganizationDto);
        return await this.organizationRepository.save(organization);
    }

    async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
        const organization = await this.organizationRepository.findOneBy({ id });
        if (!organization) {
            return null;
        }
        
        Object.assign(organization, updateOrganizationDto);
        return await this.organizationRepository.save(organization);
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.organizationRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
