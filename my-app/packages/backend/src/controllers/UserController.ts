import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto } from '@my-app/shared/src/dtos/User';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.findUserById(id);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
