import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    HttpException, 
    HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BillingProviderService } from '../services/BillingProviderService';
import { CreateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/UpdateBillingProviderDto';
import { ResponseBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/ResponseBillingProviderDto';

@Controller('billing-providers')
@ApiTags('billing-providers')
export class BillingProviderController {
    constructor(private readonly billingProviderService: BillingProviderService) {}

    @Get()
    @ApiOperation({ summary: 'Get all billing providers' })
    @ApiResponse({ 
        status: 200, 
        type: [ResponseBillingProviderDto],
        description: 'List of all billing providers'
    })
    async findAll(): Promise<ResponseBillingProviderDto[]> {
        try {
            const providers = await this.billingProviderService.findAll();
            return providers.map(provider => ({
                id: provider.id,
                name: provider.name,
                type: provider.type,
                isEnabled: provider.isEnabled,
                visible: provider.visible,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            }));
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get billing provider by ID' })
    @ApiResponse({ 
        status: 200, 
        type: ResponseBillingProviderDto,
        description: 'The billing provider'
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Billing provider not found'
    })
    async findOne(@Param('id') id: string): Promise<ResponseBillingProviderDto> {
        try {
            const provider = await this.billingProviderService.findOne(id);
            if (!provider) {
                throw new HttpException('BillingProvider not found', HttpStatus.NOT_FOUND);
            }
            return {
                id: provider.id,
                name: provider.name,
                type: provider.type,
                isEnabled: provider.isEnabled,
                visible: provider.visible,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create new billing provider' })
    @ApiResponse({ 
        status: 201, 
        type: ResponseBillingProviderDto,
        description: 'The created billing provider'
    })
    @ApiResponse({ 
        status: 409, 
        description: 'Billing provider with this name already exists'
    })
    async create(@Body() createBillingProviderDto: CreateBillingProviderDto): Promise<ResponseBillingProviderDto> {
        try {
            const provider = await this.billingProviderService.create(createBillingProviderDto);
            return {
                id: provider.id,
                name: provider.name,
                type: provider.type,
                isEnabled: provider.isEnabled,
                visible: provider.visible,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update billing provider' })
    @ApiResponse({ 
        status: 200, 
        type: ResponseBillingProviderDto,
        description: 'The updated billing provider'
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Billing provider not found'
    })
    @ApiResponse({ 
        status: 409, 
        description: 'Billing provider with this name already exists'
    })
    async update(
        @Param('id') id: string,
        @Body() updateBillingProviderDto: UpdateBillingProviderDto,
    ): Promise<ResponseBillingProviderDto> {
        try {
            const provider = await this.billingProviderService.update(id, updateBillingProviderDto);
            if (!provider) {
                throw new HttpException('BillingProvider not found', HttpStatus.NOT_FOUND);
            }
            return {
                id: provider.id,
                name: provider.name,
                type: provider.type,
                isEnabled: provider.isEnabled,
                visible: provider.visible,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete billing provider' })
    @ApiResponse({ 
        status: 204, 
        description: 'Billing provider successfully deleted'
    })
    @ApiResponse({ 
        status: 404, 
        description: 'Billing provider not found'
    })
    async remove(@Param('id') id: string): Promise<void> {
        try {
            const success = await this.billingProviderService.remove(id);
            if (!success) {
                throw new HttpException('BillingProvider not found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
