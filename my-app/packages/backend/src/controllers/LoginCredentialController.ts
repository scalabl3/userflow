import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { CreateLoginCredentialDto } from '../../../shared/src/dtos/LoginCredential/CreateLoginCredentialDto';
import { UpdateLoginCredentialDto } from '../../../shared/src/dtos/LoginCredential/UpdateLoginCredentialDto';

@Controller('login-credentials')
export class LoginCredentialController {
    constructor(private readonly loginCredentialService: LoginCredentialService) {}

    @Post()
    create(@Body() createLoginCredentialDto: CreateLoginCredentialDto) {
        return this.loginCredentialService.create(createLoginCredentialDto);
    }

    @Get()
    findAll() {
        return this.loginCredentialService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.loginCredentialService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLoginCredentialDto: UpdateLoginCredentialDto) {
        return this.loginCredentialService.update(id, updateLoginCredentialDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.loginCredentialService.remove(id);
    }
}
