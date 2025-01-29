import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginProviderService } from '../services/LoginProviderService';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';
import { ControllerBase } from '../utils/controller-utils';

@Controller('login-providers')
@ApiTags('login-providers')
export class LoginProviderController extends ControllerBase {
    protected readonly RESOURCE_NAME = 'LoginProvider';
    protected readonly logger = new Logger(LoginProviderController.name);

    constructor(private readonly loginProviderService: LoginProviderService) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Create new login provider' })
    @ApiResponse({ status: 201, type: ResponseLoginProviderDto })
    async create(@Body() createLoginProviderDto: CreateLoginProviderDto): Promise<ResponseLoginProviderDto> {
        try {
            const provider = await this.loginProviderService.create(createLoginProviderDto);
            const response = this.toResponseDto(provider, ResponseLoginProviderDto);
            if (!response) {
                this.handleBadRequest('Failed to create login provider', 'create', { dto: createLoginProviderDto });
            }
            return response;
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createLoginProviderDto });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all login providers' })
    @ApiResponse({ status: 200, type: [ResponseLoginProviderDto] })
    async findAll(): Promise<ResponseLoginProviderDto[]> {
        try {
            const providers = await this.loginProviderService.findAll();
            return this.toResponseDtoArray(providers, ResponseLoginProviderDto);
        } catch (error) {
            this.handleError(error, 'findAll');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get login provider by ID' })
    @ApiResponse({ status: 200, type: ResponseLoginProviderDto })
    @ApiResponse({ status: 404, description: 'Login provider not found' })
    async findOne(@Param('id') id: string): Promise<ResponseLoginProviderDto> {
        try {
            const provider = await this.loginProviderService.findOne(id);
            const response = this.toResponseDto(provider, ResponseLoginProviderDto);
            if (!response) {
                this.handleNotFound(id, 'findOne');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'findOne', id);
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update login provider' })
    @ApiResponse({ status: 200, type: ResponseLoginProviderDto })
    @ApiResponse({ status: 404, description: 'Login provider not found' })
    async update(
        @Param('id') id: string,
        @Body() updateLoginProviderDto: UpdateLoginProviderDto
    ): Promise<ResponseLoginProviderDto> {
        try {
            const provider = await this.loginProviderService.update(id, updateLoginProviderDto);
            const response = this.toResponseDto(provider, ResponseLoginProviderDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateLoginProviderDto });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete login provider' })
    @ApiResponse({ status: 204, description: 'Login provider deleted successfully' })
    @ApiResponse({ status: 404, description: 'Login provider not found' })
    async remove(@Param('id') id: string): Promise<void> {
        try {
            const result = await this.loginProviderService.remove(id);
            if (!result) {
                this.handleNotFound(id, 'remove');
            }
        } catch (error) {
            this.handleError(error, 'remove', id);
        }
    }
}
