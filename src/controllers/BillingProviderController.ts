import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BillingProviderService } from '../services/BillingProviderService';
import { CreateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/UpdateBillingProviderDto';
import { ResponseBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/ResponseBillingProviderDto';
import { ControllerBase } from '../utils/controller-utils';

@Controller('billing-providers')
@ApiTags('billing-providers')
export class BillingProviderController extends ControllerBase {
    protected readonly RESOURCE_NAME = 'BillingProvider';
    protected readonly logger = new Logger(BillingProviderController.name);

    constructor(private readonly billingProviderService: BillingProviderService) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Create new billing provider' })
    @ApiResponse({ status: 201, type: ResponseBillingProviderDto })
    @ApiResponse({ status: 409, description: 'Billing provider with this name already exists' })
    async create(@Body() createBillingProviderDto: CreateBillingProviderDto): Promise<ResponseBillingProviderDto> {
        try {
            const provider = await this.billingProviderService.create(createBillingProviderDto);
            const response = this.toResponseDto(provider, ResponseBillingProviderDto);
            if (!response) {
                this.handleBadRequest('Failed to create billing provider', 'create', { dto: createBillingProviderDto });
            }
            return response;
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createBillingProviderDto });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all billing providers' })
    @ApiResponse({ status: 200, type: [ResponseBillingProviderDto] })
    async findAll(): Promise<ResponseBillingProviderDto[]> {
        try {
            const providers = await this.billingProviderService.findAll();
            return this.toResponseDtoArray(providers, ResponseBillingProviderDto);
        } catch (error) {
            this.handleError(error, 'findAll');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get billing provider by ID' })
    @ApiResponse({ status: 200, type: ResponseBillingProviderDto })
    @ApiResponse({ status: 404, description: 'Billing provider not found' })
    async findOne(@Param('id') id: string): Promise<ResponseBillingProviderDto> {
        try {
            const provider = await this.billingProviderService.findOne(id);
            const response = this.toResponseDto(provider, ResponseBillingProviderDto);
            if (!response) {
                this.handleNotFound(id, 'findOne');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'findOne', id);
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update billing provider' })
    @ApiResponse({ status: 200, type: ResponseBillingProviderDto })
    @ApiResponse({ status: 404, description: 'Billing provider not found' })
    @ApiResponse({ status: 409, description: 'Billing provider with this name already exists' })
    async update(
        @Param('id') id: string,
        @Body() updateBillingProviderDto: UpdateBillingProviderDto
    ): Promise<ResponseBillingProviderDto> {
        try {
            const provider = await this.billingProviderService.update(id, updateBillingProviderDto);
            const response = this.toResponseDto(provider, ResponseBillingProviderDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateBillingProviderDto });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete billing provider' })
    @ApiResponse({ status: 204, description: 'Billing provider deleted successfully' })
    @ApiResponse({ status: 404, description: 'Billing provider not found' })
    async remove(@Param('id') id: string): Promise<void> {
        try {
            const result = await this.billingProviderService.remove(id);
            if (!result) {
                this.handleNotFound(id, 'remove');
            }
        } catch (error) {
            this.handleError(error, 'remove', id);
        }
    }
} 