import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { CreateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/CreateLoginCredentialDto';
import { UpdateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/UpdateLoginCredentialDto';
import { ResponseLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/ResponseLoginCredentialDto';

@Controller('login-credentials')
export class LoginCredentialController {
    constructor(private readonly loginCredentialService: LoginCredentialService) {}

    @Post()
    async create(@Body() createLoginCredentialDto: CreateLoginCredentialDto): Promise<ResponseLoginCredentialDto> {
        return this.loginCredentialService.create(createLoginCredentialDto);
    }

    @Get()
    async findAll(): Promise<ResponseLoginCredentialDto[]> {
        return this.loginCredentialService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseLoginCredentialDto> {
        const result = await this.loginCredentialService.findOne(id);
        if (!result) {
            throw new Error('LoginCredential not found');
        }
        return result;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateLoginCredentialDto: UpdateLoginCredentialDto
    ): Promise<ResponseLoginCredentialDto> {
        const result = await this.loginCredentialService.update(id, updateLoginCredentialDto);
        if (!result) {
            throw new Error('LoginCredential not found');
        }
        return result;
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<boolean> {
        return this.loginCredentialService.remove(id);
    }
}
