import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { ResponseUserDto } from '@my-app/shared/dist/dtos/User/ResponseUserDto';
import { plainToClass } from 'class-transformer';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const user = await this.userService.create(createUserDto);
        return plainToClass(ResponseUserDto, {
            ...user,
            preferences: user.preferences || {
                theme: 'light',
                notifications: { email: true, push: true }
            }
        }, { excludeExtraneousValues: true });
    }

    @Get()
    async findAll(): Promise<ResponseUserDto[]> {
        const users = await this.userService.findAll();
        return users.map(user => plainToClass(ResponseUserDto, {
            ...user,
            preferences: user.preferences || {
                theme: 'light',
                notifications: { email: true, push: true }
            }
        }, { excludeExtraneousValues: true }));
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
        const user = await this.userService.findOne(id);
        return plainToClass(ResponseUserDto, {
            ...user,
            preferences: user.preferences || {
                theme: 'light',
                notifications: { email: true, push: true }
            }
        }, { excludeExtraneousValues: true });
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<ResponseUserDto> {
        const user = await this.userService.update(id, updateUserDto);
        return plainToClass(ResponseUserDto, {
            ...user,
            preferences: user.preferences || {
                theme: 'light',
                notifications: { email: true, push: true }
            }
        }, { excludeExtraneousValues: true });
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        await this.userService.remove(id);
    }
}
