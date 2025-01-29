import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../services/UserService';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { ResponseUserDto } from '@my-app/shared/dist/dtos/User/ResponseUserDto';
import { ControllerBase } from '../utils/controller-utils';

@Controller('users')
@ApiTags('users')
export class UserController extends ControllerBase {
    protected readonly RESOURCE_NAME = 'User';
    protected readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: 201, type: ResponseUserDto })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        try {
            const user = await this.userService.create(createUserDto);
            const response = this.toResponseDto(user, ResponseUserDto);
            if (!response) {
                this.handleBadRequest('Failed to create user', 'create', { dto: createUserDto });
            }
            return {
                ...response,
                preferences: response.preferences || {
                    theme: 'light',
                    notifications: { email: true, push: true }
                }
            };
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createUserDto });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [ResponseUserDto] })
    async findAll(@Query('username') username?: string): Promise<ResponseUserDto[]> {
        try {
            let users;
            if (username) {
                const user = await this.userService.findByUsername(username);
                users = user ? [user] : [];
            } else {
                users = await this.userService.findAll();
            }
            const responses = this.toResponseDtoArray(users, ResponseUserDto);
            return responses.map(response => ({
                ...response,
                preferences: response.preferences || {
                    theme: 'light',
                    notifications: { email: true, push: true }
                }
            }));
        } catch (error) {
            this.handleError(error, 'findAll', undefined, { username });
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, type: ResponseUserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
        try {
            const user = await this.userService.findOne(id);
            const response = this.toResponseDto(user, ResponseUserDto);
            if (!response) {
                this.handleNotFound(id, 'findOne');
            }
            return {
                ...response,
                preferences: response.preferences || {
                    theme: 'light',
                    notifications: { email: true, push: true }
                }
            };
        } catch (error) {
            this.handleError(error, 'findOne', id);
        }
    }

    @Get('username/:username')
    @ApiOperation({ summary: 'Get user by username' })
    @ApiResponse({ status: 200, type: ResponseUserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findByUsername(@Param('username') username: string): Promise<ResponseUserDto> {
        try {
            const user = await this.userService.findByUsername(username);
            const response = this.toResponseDto(user, ResponseUserDto);
            if (!response) {
                this.handleNotFound(username, 'findByUsername');
            }
            return {
                ...response,
                preferences: response.preferences || {
                    theme: 'light',
                    notifications: { email: true, push: true }
                }
            };
        } catch (error) {
            this.handleError(error, 'findByUsername', username);
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, type: ResponseUserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<ResponseUserDto> {
        try {
            const user = await this.userService.update(id, updateUserDto);
            const response = this.toResponseDto(user, ResponseUserDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return {
                ...response,
                preferences: response.preferences || {
                    theme: 'light',
                    notifications: { email: true, push: true }
                }
            };
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateUserDto });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: 204, description: 'User deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        try {
            const result = await this.userService.remove(id);
            if (!result) {
                this.handleNotFound(id, 'remove');
            }
        } catch (error) {
            this.handleError(error, 'remove', id);
        }
    }
}
