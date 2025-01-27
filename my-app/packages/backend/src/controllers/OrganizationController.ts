import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OrganizationService } from '../services/OrganizationService';
import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/UpdateOrganizationDto';
import { Organization } from '../models/Organization';

interface ServiceError {
    message: string;
    status?: number;
}

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    /**
     * GET /organizations
     * Retrieve a list of organizations
     */
    @Get()
    async findAll(): Promise<Organization[]> {
        try {
            return await this.organizationService.findAll();
        } catch (error) {
            const serviceError = error as ServiceError;
            throw new HttpException(
                serviceError.message || 'Internal server error',
                serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * POST /organizations
     * Create a new organization
     */
    @Post()
    async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        try {
            return await this.organizationService.create(createOrganizationDto);
        } catch (error) {
            const serviceError = error as ServiceError;
            throw new HttpException(
                serviceError.message || 'Internal server error',
                serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * GET /organizations/:id
     * Retrieve a single organization by ID
     */
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Organization> {
        try {
            const organization = await this.organizationService.findOne(id);
            if (!organization) {
                throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
            }
            return organization;
        } catch (error) {
            const serviceError = error as ServiceError;
            throw new HttpException(
                serviceError.message || 'Internal server error',
                serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * PUT /organizations/:id
     * Update an existing organization
     */
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
        try {
            const organization = await this.organizationService.update(id, updateOrganizationDto);
            if (!organization) {
                throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
            }
            return organization;
        } catch (error) {
            const serviceError = error as ServiceError;
            throw new HttpException(
                serviceError.message || 'Internal server error',
                serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * DELETE /organizations/:id
     * Delete an organization by ID
     */
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        try {
            const result = await this.organizationService.remove(id);
            if (!result) {
                throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
            }
            return { message: 'Organization deleted successfully' };
        } catch (error) {
            const serviceError = error as ServiceError;
            throw new HttpException(
                serviceError.message || 'Internal server error',
                serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
