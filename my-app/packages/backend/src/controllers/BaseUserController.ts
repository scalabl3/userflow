import { Controller, Get, Post, Patch, Delete, Body, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseUserService } from '../services/BaseUserService';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';
import { ResponseBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/ResponseBaseUserDto';
import { ControllerBase } from '../utils/controller-utils';

@Controller('base-users')
@ApiTags('base-users')
export class BaseUserController extends ControllerBase {
    protected readonly RESOURCE_NAME = 'BaseUser';
    protected readonly logger = new Logger(BaseUserController.name);

    constructor(private readonly baseUserService: BaseUserService) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Create new base user' })
    @ApiResponse({ status: 201, type: ResponseBaseUserDto })
    async create(@Body() createBaseUserDto: CreateBaseUserDto): Promise<ResponseBaseUserDto> {
        try {
            const user = await this.baseUserService.create(createBaseUserDto);
            const response = this.toResponseDto(user, ResponseBaseUserDto);
            if (!response) {
                this.handleBadRequest('Failed to create base user', 'create', { dto: createBaseUserDto });
            }
            return response;
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createBaseUserDto });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all base users' })
    @ApiResponse({ status: 200, type: [ResponseBaseUserDto] })
    async findAll(): Promise<ResponseBaseUserDto[]> {
        try {
            const users = await this.baseUserService.findAll();
            return this.toResponseDtoArray(users, ResponseBaseUserDto);
        } catch (error) {
            this.handleError(error, 'findAll');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get base user by ID' })
    @ApiResponse({ status: 200, type: ResponseBaseUserDto })
    @ApiResponse({ status: 404, description: 'Base user not found' })
    async findOne(@Param('id') id: string): Promise<ResponseBaseUserDto> {
        try {
            const user = await this.baseUserService.findOne(id);
            const response = this.toResponseDto(user, ResponseBaseUserDto);
            if (!response) {
                this.handleNotFound(id, 'findOne');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'findOne', id);
        }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update base user' })
    @ApiResponse({ status: 200, type: ResponseBaseUserDto })
    @ApiResponse({ status: 404, description: 'Base user not found' })
    async update(
        @Param('id') id: string,
        @Body() updateBaseUserDto: UpdateBaseUserDto
    ): Promise<ResponseBaseUserDto> {
        try {
            const user = await this.baseUserService.update(id, updateBaseUserDto);
            const response = this.toResponseDto(user, ResponseBaseUserDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateBaseUserDto });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete base user' })
    @ApiResponse({ status: 200, description: 'Base user deleted successfully' })
    @ApiResponse({ status: 404, description: 'Base user not found' })
    async remove(@Param('id') id: string): Promise<boolean> {
        try {
            const result = await this.baseUserService.remove(id);
            if (!result) {
                this.handleNotFound(id, 'remove');
            }
            return result;
        } catch (error) {
            this.handleError(error, 'remove', id);
        }
    }
} 