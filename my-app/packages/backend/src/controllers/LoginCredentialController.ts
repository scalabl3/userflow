import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException } from '@nestjs/common';
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
        if (createLoginCredentialDto.credentialType === CredentialType.OAUTH) {
            return this.loginCredentialService.createOAuthCredential(createLoginCredentialDto as CreateOAuthCredentialDto);
        }
        if (createLoginCredentialDto.credentialType === CredentialType.PASSWORD) {
            return this.loginCredentialService.createPasswordCredential(createLoginCredentialDto as CreatePasswordCredentialDto);
        }
        throw new BadRequestException('Invalid credential type');
    }

    @Get()
    async findAll(): Promise<ResponseLoginCredentialDto[]> {
        return this.loginCredentialService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseLoginCredentialDto> {
        const credential = await this.loginCredentialService.findOne(id);
        if (!credential) {
            throw new BadRequestException('Login credential not found');
        }
        return credential;
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateLoginCredentialDto: UpdateLoginCredentialDto
    ): Promise<ResponseLoginCredentialDto> {
        const updated = await this.loginCredentialService.update(id, updateLoginCredentialDto);
        if (!updated) {
            throw new BadRequestException('Login credential not found');
        }
        return updated;
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<boolean> {
        return this.loginCredentialService.remove(id);
    }
}
