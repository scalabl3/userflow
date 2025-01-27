import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OrganizationService } from '../services/OrganizationService';
import { CreateOrganizationDto } from '@my-app/shared/src/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/src/dtos/Organization/UpdateOrganizationDto';
import { Organization } from '../models/Organization';

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    /**
     * GET /organizations
     * Retrieve a list of organizations
     */
    @Get()
    async getAllOrganizations(): Promise<Organization[]> {
        return this.organizationService.getAllOrganizations();
    }

    /**
     * POST /organizations
     * Create a new organization
     */
    @Post()
    async createOrganization(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
        try {
            return await this.organizationService.createOrganization(createOrganizationDto);
        } catch (error) {
            throw new HttpException('Failed to create organization', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * GET /organizations/:id
     * Retrieve a single organization by ID
     */
    @Get(':id')
    async getOrganizationById(@Param('id') id: string): Promise<Organization> {
        try {
            return await this.organizationService.getOrganizationById(id);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * PUT /organizations/:id
     * Update an existing organization
     */
    @Put(':id')
    async updateOrganization(
        @Param('id') id: string,
        @Body() updateOrganizationDto: UpdateOrganizationDto,
    ): Promise<Organization> {
        try {
            return await this.organizationService.updateOrganization(id, updateOrganizationDto);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * DELETE /organizations/:id
     * Delete an organization by ID
     */
    @Delete(':id')
    async deleteOrganization(@Param('id') id: string): Promise<{ success: boolean }> {
        try {
            await this.organizationService.deleteOrganization(id);
            return { success: true };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
