import { Test, TestingModule } from '@nestjs/testing';
import { BillingProviderController } from './BillingProviderController';
import { BillingProviderService } from '../services/BillingProviderService';
import { CreateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/UpdateBillingProviderDto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BillingProviderType } from '@my-app/shared/dist/enums/BillingProviderType';
import { InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('BillingProviderController', () => {
    let controller: BillingProviderController;
    let service: BillingProviderService;

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

    const mockBillingProvider = {
        id: '123',
        name: 'Stripe',
        type: BillingProviderType.STRIPE,
        isEnabled: true,
        visible: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BillingProviderController],
            providers: [
                {
                    provide: BillingProviderService,
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

        controller = module.get<BillingProviderController>(BillingProviderController);
        service = module.get<BillingProviderService>(BillingProviderService);

        // Reset mocks between tests
        jest.clearAllMocks();
    });

    describe('Controller Setup', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
            expect(service).toBeDefined();
        });
    });

    describe('findAll', () => {
        it('should return an array of billing providers', async () => {
            const providers = [mockBillingProvider];
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
        it('should return a single billing provider', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockBillingProvider);
            
            const result = await controller.findOne(mockBillingProvider.id);
            
            expect(result).toEqual(mockBillingProvider);
            expect(service.findOne).toHaveBeenCalledWith(mockBillingProvider.id);
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);
            
            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
                new NotFoundException('BillingProvider with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
            
            await expect(controller.findOne(mockBillingProvider.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('create', () => {
        const createDto: CreateBillingProviderDto = {
            name: 'Stripe',
            type: BillingProviderType.STRIPE,
            isEnabled: true,
            visible: true
        };

        it('should create a billing provider', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(mockBillingProvider);
            
            const result = await controller.create(createDto);
            
            expect(result).toEqual(mockBillingProvider);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });

        it('should handle duplicate name error', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(
                new ConflictException('BillingProvider with this name already exists')
            );
            
            await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
        });

        it('should handle other errors', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(new Error());
            
            await expect(controller.create(createDto)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('update', () => {
        const updateDto: UpdateBillingProviderDto = {
            name: 'Updated Stripe',
            isEnabled: false
        };

        it('should update a billing provider', async () => {
            const updatedProvider = { ...mockBillingProvider, ...updateDto };
            jest.spyOn(service, 'update').mockResolvedValue(updatedProvider);
            
            const result = await controller.update(mockBillingProvider.id, updateDto);
            
            expect(result).toEqual(updatedProvider);
            expect(service.update).toHaveBeenCalledWith(mockBillingProvider.id, updateDto);
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);
            
            await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrow(
                new NotFoundException('BillingProvider with ID nonexistent-id not found')
            );
        });

        it('should handle duplicate name error', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(
                new ConflictException('BillingProvider with this name already exists')
            );
            
            await expect(controller.update(mockBillingProvider.id, updateDto)).rejects.toThrow(ConflictException);
        });

        it('should handle other errors', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new Error());
            
            await expect(controller.update(mockBillingProvider.id, updateDto)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('remove', () => {
        it('should remove a billing provider', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);
            
            await controller.remove(mockBillingProvider.id);
            
            expect(service.remove).toHaveBeenCalledWith(mockBillingProvider.id);
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);
            
            await expect(controller.remove('nonexistent-id')).rejects.toThrow(
                new NotFoundException('BillingProvider with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new Error());
            
            await expect(controller.remove(mockBillingProvider.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });
});
