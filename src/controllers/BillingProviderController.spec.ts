import { Test, TestingModule } from '@nestjs/testing';
import { BillingProviderController } from './BillingProviderController';
import { BillingProviderService } from '../services/BillingProviderService';
import { CreateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/CreateBillingProviderDto';
import { UpdateBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/UpdateBillingProviderDto';
import { ResponseBillingProviderDto } from '@my-app/shared/dist/dtos/BillingProvider/ResponseBillingProviderDto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BillingProviderType } from '@my-app/shared/dist/enums/BillingProviderType';

describe('BillingProviderController', () => {
    let controller: BillingProviderController;
    let service: BillingProviderService;

    const mockBillingProvider = {
        id: 'test-id',
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
            ],
        }).compile();

        controller = module.get<BillingProviderController>(BillingProviderController);
        service = module.get<BillingProviderService>(BillingProviderService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of billing providers', async () => {
            const providers = [mockBillingProvider];
            jest.spyOn(service, 'findAll').mockResolvedValue(providers);
            
            const result = await controller.findAll();
            
            expect(result).toEqual(providers);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should return an empty array when no providers exist', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([]);
            
            const result = await controller.findAll();
            
            expect(result).toEqual([]);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new Error());
            
            await expect(controller.findAll()).rejects.toThrow(BadRequestException);
        });
    });

    describe('findOne', () => {
        it('should return a single billing provider', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockBillingProvider);
            
            const result = await controller.findOne(mockBillingProvider.id);
            
            expect(result).toEqual(mockBillingProvider);
            expect(service.findOne).toHaveBeenCalledWith(mockBillingProvider.id);
        });

        it('should throw NotFoundException when provider does not exist', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);
            
            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
            
            await expect(controller.findOne(mockBillingProvider.id)).rejects.toThrow(BadRequestException);
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

        it('should throw BadRequestException when creation fails', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(null);
            
            await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(new Error());
            
            await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
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

        it('should throw NotFoundException when provider does not exist', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);
            
            await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrow(NotFoundException);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new Error());
            
            await expect(controller.update(mockBillingProvider.id, updateDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should remove a billing provider', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);
            
            await controller.remove(mockBillingProvider.id);
            
            expect(service.remove).toHaveBeenCalledWith(mockBillingProvider.id);
        });

        it('should throw NotFoundException when provider does not exist', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);
            
            await expect(controller.remove('nonexistent-id')).rejects.toThrow(NotFoundException);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new Error());
            
            await expect(controller.remove(mockBillingProvider.id)).rejects.toThrow(BadRequestException);
        });
    });
}); 