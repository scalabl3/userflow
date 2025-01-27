import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/UpdateOrganizationDto';
import { Organization } from '../models/Organization';
import { User } from '../models/User';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(Organization)
        private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<Organization[]> {
        return await this.organizationRepository.find({
            relations: ['users']
        });
    }

    async findOne(id: string): Promise<Organization | null> {
        return await this.organizationRepository.findOne({
            where: { id },
            relations: ['users']
        });
    }

    async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        // Check if admin user already has an organization
        const existingUser = await this.userRepository.findOne({
            where: { id: createOrganizationDto.adminUser }
        });

        if (!existingUser) {
            throw new BadRequestException('Admin user not found');
        }

        if (existingUser.organizationId) {
            throw new BadRequestException('User already belongs to an organization');
        }

        const organization = this.organizationRepository.create({
            ...createOrganizationDto,
            adminUser: createOrganizationDto.adminUser,
            visible: false // Default to hidden/shadow organization
        });

        const savedOrg = await this.organizationRepository.save(organization);

        // Update the user with the new organization
        await this.userRepository.update(existingUser.id, {
            organizationId: savedOrg.id
        });

        return savedOrg;
    }

    async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
        const organization = await this.organizationRepository.findOne({
            where: { id },
            relations: ['users']
        });

        if (!organization) {
            return null;
        }
        
        if (updateOrganizationDto.adminUser) {
            organization.adminUser = updateOrganizationDto.adminUser;
        }
        
        Object.assign(organization, {
            name: updateOrganizationDto.name,
            visible: updateOrganizationDto.visible
        });
        
        return await this.organizationRepository.save(organization);
    }

    async remove(id: string): Promise<boolean> {
        const organization = await this.organizationRepository.findOne({
            where: { id },
            relations: ['users']
        });

        if (!organization) {
            return false;
        }

        // Cannot delete organization if it has users
        if (organization.users.length > 0) {
            throw new BadRequestException('Cannot delete organization with active users');
        }

        const result = await this.organizationRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
