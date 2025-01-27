import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Body, 
    Param, 
    HttpException, 
    HttpStatus 
} from '@nestjs/common';
import { LoginProviderService } from '../services/LoginProviderService';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';

@Controller('login-providers')
export class LoginProviderController {
    constructor(private readonly loginProviderService: LoginProviderService) {}

    @Get()
    async findAll(): Promise<ResponseLoginProviderDto[]> {
        try {
            const providers = await this.loginProviderService.findAll();
            return providers.map(provider => ({
                id: provider.id,
                code: provider.code,
                name: provider.name,
                isEnabled: provider.isEnabled,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            }));
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ResponseLoginProviderDto> {
        try {
            const provider = await this.loginProviderService.findOne(id);
            if (!provider) {
                throw new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND);
            }
            return {
                id: provider.id,
                code: provider.code,
                name: provider.name,
                isEnabled: provider.isEnabled,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    async create(@Body() createLoginProviderDto: CreateLoginProviderDto): Promise<ResponseLoginProviderDto> {
        try {
            const provider = await this.loginProviderService.create(createLoginProviderDto);
            return {
                id: provider.id,
                code: provider.code,
                name: provider.name,
                isEnabled: provider.isEnabled,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            };
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateLoginProviderDto: UpdateLoginProviderDto,
    ): Promise<ResponseLoginProviderDto> {
        try {
            const provider = await this.loginProviderService.update(id, updateLoginProviderDto);
            if (!provider) {
                throw new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND);
            }
            return {
                id: provider.id,
                code: provider.code,
                name: provider.name,
                isEnabled: provider.isEnabled,
                createdAt: provider.createdAt,
                modifiedAt: provider.modifiedAt,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        try {
            const success = await this.loginProviderService.remove(id);
            if (!success) {
                throw new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
