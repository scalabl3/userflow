import { Test, TestingModule } from '@nestjs/testing';
import { LoginProviderController } from './LoginProviderController';
import { LoginProviderService } from '../services/LoginProviderService';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';
import { HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { auth } from '../test/__mocks__/auth.mock';
import { core } from '../test/__mocks__/core.mock';
import { DataSource } from 'typeorm';

describe('LoginProviderController', () => {
    let controller: LoginProviderController;
    let service: LoginProviderService;

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn()
        }
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
    };

    // Use shared mock data
    const mockLoginProvider = auth.providers.email;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginProviderController],
            providers: [
                {
                    provide: LoginProviderService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        controller = module.get<LoginProviderController>(LoginProviderController);
        service = module.get<LoginProviderService>(LoginProviderService);

        // Reset mocks between tests
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of login providers', async () => {
            const providers = [auth.providers.email, auth.providers.google];
            jest.spyOn(service, 'findAll').mockResolvedValue(providers);
            
            const result = await controller.findAll();
            
            expect(result).toEqual(providers);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new Error());
            
            await expect(controller.findAll()).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('findOne', () => {
        it('should return a single login provider', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockLoginProvider);
            
            const result = await controller.findOne(mockLoginProvider.id);
            
            expect(result).toEqual(mockLoginProvider);
            expect(service.findOne).toHaveBeenCalledWith(mockLoginProvider.id);
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);
            
            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
                new NotFoundException('LoginProvider with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
            
            await expect(controller.findOne(mockLoginProvider.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('create', () => {
        const createDto: CreateLoginProviderDto = {
            code: auth.providers.email.code,
            name: auth.providers.email.name,
            isEnabled: true,
        };

        it('should create a login provider', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(mockLoginProvider);
            
            const result = await controller.create(createDto);
            
            expect(result).toEqual(mockLoginProvider);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(new Error());
            
            await expect(controller.create(createDto)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('update', () => {
        const updateDto: UpdateLoginProviderDto = {
            name: 'Updated Email Provider',
            isEnabled: false,
        };

        it('should update a login provider', async () => {
            const updatedProvider = { 
                ...mockLoginProvider, 
                ...updateDto,
                modifiedAt: core.timestamps.now
            };
            jest.spyOn(service, 'update').mockResolvedValue(updatedProvider);
            
            const result = await controller.update(mockLoginProvider.id, updateDto);
            
            expect(result).toEqual(updatedProvider);
            expect(service.update).toHaveBeenCalledWith(mockLoginProvider.id, updateDto);
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);
            
            await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrow(
                new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND)
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new Error());
            
            await expect(controller.update(mockLoginProvider.id, updateDto)).rejects.toThrow(
                new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    describe('remove', () => {
        it('should remove a login provider', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);
            
            await controller.remove(mockLoginProvider.id);
            
            expect(service.remove).toHaveBeenCalledWith(mockLoginProvider.id);
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);
            
            await expect(controller.remove('nonexistent-id')).rejects.toThrow(
                new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND)
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new Error());
            
            await expect(controller.remove(mockLoginProvider.id)).rejects.toThrow(
                new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });
});
