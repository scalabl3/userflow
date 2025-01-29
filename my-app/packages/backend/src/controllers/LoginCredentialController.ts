import { Controller, Get, Post, Body, Param, Put, Delete, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { 
    CreateLoginCredentialDto,
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdateLoginCredentialDto,
    ResponseLoginCredentialDto
} from '@my-app/shared/dist/dtos/LoginCredential';
import { CredentialType } from '@my-app/shared/dist/enums';
import { ControllerBase } from '../utils/controller-utils';

@Controller('login-credentials')
@ApiTags('login-credentials')
export class LoginCredentialController extends ControllerBase {
    protected readonly RESOURCE_NAME = 'LoginCredential';
    protected readonly logger = new Logger(LoginCredentialController.name);

    constructor(private readonly loginCredentialService: LoginCredentialService) {
        super();
    }

    @Post()
    @ApiOperation({ summary: 'Create new login credential' })
    @ApiResponse({ status: 201, type: ResponseLoginCredentialDto })
    async create(@Body() createLoginCredentialDto: CreateLoginCredentialDto): Promise<ResponseLoginCredentialDto> {
        try {
            let result;
            if (createLoginCredentialDto.credentialType === CredentialType.OAUTH) {
                result = await this.loginCredentialService.createOAuthCredential(
                    createLoginCredentialDto as CreateOAuthCredentialDto
                );
            } else if (createLoginCredentialDto.credentialType === CredentialType.PASSWORD) {
                result = await this.loginCredentialService.createPasswordCredential(
                    createLoginCredentialDto as CreatePasswordCredentialDto
                );
            } else {
                this.handleBadRequest('Invalid credential type', 'create', { dto: createLoginCredentialDto });
            }

            const response = this.toResponseDto(result, ResponseLoginCredentialDto);
            if (!response) {
                this.handleBadRequest('Failed to create login credential', 'create', { dto: createLoginCredentialDto });
            }
            return response;
        } catch (error) {
            this.handleError(error, 'create', undefined, { dto: createLoginCredentialDto });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all login credentials' })
    @ApiResponse({ status: 200, type: [ResponseLoginCredentialDto] })
    async findAll(): Promise<ResponseLoginCredentialDto[]> {
        try {
            const credentials = await this.loginCredentialService.findAll();
            return this.toResponseDtoArray(credentials, ResponseLoginCredentialDto);
        } catch (error) {
            this.handleError(error, 'findAll');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get login credential by ID' })
    @ApiResponse({ status: 200, type: ResponseLoginCredentialDto })
    @ApiResponse({ status: 404, description: 'Login credential not found' })
    async findOne(@Param('id') id: string): Promise<ResponseLoginCredentialDto> {
        try {
            const credential = await this.loginCredentialService.findOne(id);
            const response = this.toResponseDto(credential, ResponseLoginCredentialDto);
            if (!response) {
                this.handleNotFound(id, 'findOne');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'findOne', id);
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update login credential' })
    @ApiResponse({ status: 200, type: ResponseLoginCredentialDto })
    @ApiResponse({ status: 404, description: 'Login credential not found' })
    async update(
        @Param('id') id: string,
        @Body() updateLoginCredentialDto: UpdateLoginCredentialDto
    ): Promise<ResponseLoginCredentialDto> {
        try {
            const result = await this.loginCredentialService.update(id, updateLoginCredentialDto);
            const response = this.toResponseDto(result, ResponseLoginCredentialDto);
            if (!response) {
                this.handleNotFound(id, 'update');
            }
            return response;
        } catch (error) {
            this.handleError(error, 'update', id, { dto: updateLoginCredentialDto });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete login credential' })
    @ApiResponse({ status: 204, description: 'Login credential deleted successfully' })
    @ApiResponse({ status: 404, description: 'Login credential not found' })
    async remove(@Param('id') id: string): Promise<boolean> {
        try {
            const result = await this.loginCredentialService.remove(id);
            if (!result) {
                this.handleNotFound(id, 'remove');
            }
            return result;
        } catch (error) {
            this.handleError(error, 'remove', id);
        }
    }
}
