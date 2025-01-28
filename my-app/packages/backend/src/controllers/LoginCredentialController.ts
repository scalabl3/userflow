import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { 
    CreateLoginCredentialDto,
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdateLoginCredentialDto,
    ResponseLoginCredentialDto
} from '@my-app/shared/dist/dtos/LoginCredential';
import { CredentialType } from '@my-app/shared/dist/enums';

@Controller('login-credentials')
export class LoginCredentialController {
    constructor(private readonly loginCredentialService: LoginCredentialService) {}

    @Post()
    async create(@Body() createLoginCredentialDto: CreateLoginCredentialDto): Promise<ResponseLoginCredentialDto> {
        let result;
        if (createLoginCredentialDto.credentialType === CredentialType.OAUTH) {
            result = await this.loginCredentialService.createOAuthCredential(createLoginCredentialDto as CreateOAuthCredentialDto);
        } else if (createLoginCredentialDto.credentialType === CredentialType.PASSWORD) {
            result = await this.loginCredentialService.createPasswordCredential(createLoginCredentialDto as CreatePasswordCredentialDto);
        } else {
            throw new BadRequestException('Invalid credential type');
        }

        if (!result) {
            throw new BadRequestException('Failed to create login credential');
        }
        return result;
    }

    @Get()
    findAll(): Promise<ResponseLoginCredentialDto[]> {
        return this.loginCredentialService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseLoginCredentialDto> {
        const credential = await this.loginCredentialService.findOne(id);
        if (!credential) {
            throw new NotFoundException('Login credential not found');
        }
        return credential;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateLoginCredentialDto: UpdateLoginCredentialDto): Promise<ResponseLoginCredentialDto> {
        const result = await this.loginCredentialService.update(id, updateLoginCredentialDto);
        if (!result) {
            throw new NotFoundException('Login credential not found');
        }
        return result;
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        const result = await this.loginCredentialService.remove(id);
        if (!result) {
            throw new NotFoundException('Login credential not found');
        }
    }
}
