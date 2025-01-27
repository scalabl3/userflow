import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BaseUserService } from '../services/BaseUserService';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';
import { BaseUser } from '../models/BaseUser';

@Controller('base-users')
export class BaseUserController {
    constructor(private readonly baseUserService: BaseUserService) {}

    @Post()
    create(@Body() createBaseUserDto: CreateBaseUserDto): Promise<BaseUser> {
        return this.baseUserService.create(createBaseUserDto);
    }

    @Get()
    findAll(): Promise<BaseUser[]> {
        return this.baseUserService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<BaseUser | null> {
        return this.baseUserService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateBaseUserDto: UpdateBaseUserDto
    ): Promise<BaseUser | null> {
        return this.baseUserService.update(id, updateBaseUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.baseUserService.remove(id);
    }
} 