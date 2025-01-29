import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationService } from '../services/OrganizationService';
import { CreateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/CreateOrganizationDto';
import { UpdateOrganizationDto } from '@my-app/shared/dist/dtos/Organization/UpdateOrganizationDto';
import { ResponseOrganizationDto } from '@my-app/shared/dist/dtos/Organization/ResponseOrganizationDto';
import { ControllerBase } from '../utils/controller-utils';

@Controller('organizations')
@ApiTags('organizations')
export class OrganizationController extends ControllerBase {
    protected readonly RESOURCE_NAME = 'Organization';
    protected readonly logger = new Logger(OrganizationController.name);

    constructor(private readonly organizationService: OrganizationService) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Create new organization' })
    @ApiResponse({ status: 201, type: ResponseOrganizationDto })
    async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<ResponseOrganizationDto> {
        try {
            const organization = await this.organizationService.create(createOrganizationDto);
            const response = this.toResponseDto(organization, ResponseOrganizationDto);
            if (!response) {
                this.handleBadRequest('Failed to create organization', 'create', { dto: createOrganizationDto });
            }
            return response;
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createOrganizationDto });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all organizations' })
    @ApiResponse({ status: 200, type: [ResponseOrganizationDto] })
    async findAll(): Promise<ResponseOrganizationDto[]> {
        try {
            const organizations = await this.organizationService.findAll();
            return this.toResponseDtoArray(organizations, ResponseOrganizationDto);
        } catch (error) {
            this.handleError(error, 'findAll');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get organization by ID' })
    @ApiResponse({ status: 200, type: ResponseOrganizationDto })
    @ApiResponse({ status: 404, description: 'Organization not found' })
    async findOne(@Param('id') id: string): Promise<ResponseOrganizationDto> {
        try {
            const organization = await this.organizationService.findOne(id);
            const response = this.toResponseDto(organization, ResponseOrganizationDto);
            if (!response) {
                this.handleNotFound(id, 'findOne');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'findOne', id);
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update organization' })
    @ApiResponse({ status: 200, type: ResponseOrganizationDto })
    @ApiResponse({ status: 404, description: 'Organization not found' })
    async update(
        @Param('id') id: string,
        @Body() updateOrganizationDto: UpdateOrganizationDto
    ): Promise<ResponseOrganizationDto> {
        try {
            const organization = await this.organizationService.update(id, updateOrganizationDto);
            const response = this.toResponseDto(organization, ResponseOrganizationDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateOrganizationDto });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete organization' })
    @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
    @ApiResponse({ status: 404, description: 'Organization not found' })
    async remove(@Param('id') id: string): Promise<boolean> {
        try {
            const result = await this.organizationService.remove(id);
            if (!result) {
                this.handleNotFound(id, 'remove');
            }
            return result;
        } catch (error) {
            this.handleError(error, 'remove', id);
        }
    }
}
