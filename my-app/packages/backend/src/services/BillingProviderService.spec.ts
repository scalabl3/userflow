import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { BillingProviderService } from './BillingProviderService';
import { BillingProvider } from '../models/BillingProvider';
import { BillingProviderType } from '@my-app/shared/dist/enums/BillingProviderType';

describe('BillingProviderService', () => {
    let service: BillingProviderService;
    let repository: Repository<BillingProvider>;
    let dataSource: DataSource;

    const mockProvider = {
        id: '123',
        name: 'Stripe',
        type: BillingProviderType.STRIPE,
        isEnabled: true,
        visible: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn(),
            remove: jest.fn()
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BillingProviderService,
                {
                    provide: getRepositoryToken(BillingProvider),
                    useClass: Repository
                },
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
                    }
                }
            ],
        }).compile();

        service = module.get<BillingProviderService>(BillingProviderService);
        repository = module.get<Repository<BillingProvider>>(getRepositoryToken(BillingProvider));
        dataSource = module.get<DataSource>(DataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return an array of billing providers', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue([mockProvider]);
            
            const result = await service.findAll();
            
            expect(result).toEqual([mockProvider]);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a billing provider', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockProvider);
            
            const result = await service.findOne('123');
            
            expect(result).toEqual(mockProvider);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: '123' });
        });

        it('should throw NotFoundException when provider not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
            
            await expect(service.findOne('123')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        const createDto = {
            name: 'Stripe',
            type: BillingProviderType.STRIPE,
            isEnabled: true,
            visible: true
        };

        it('should create a billing provider', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(mockProvider);
            mockQueryRunner.manager.save.mockResolvedValue(mockProvider);

            const result = await service.create(createDto);

            expect(result).toEqual(mockProvider);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it('should throw ConflictException when name already exists', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockProvider);

            await expect(service.create(createDto)).rejects.toThrow(ConflictException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        const updateDto = {
            name: 'Updated Stripe',
            isEnabled: false
        };

        it('should update a billing provider', async () => {
            const updatedProvider = { ...mockProvider, ...updateDto };
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockProvider);
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            mockQueryRunner.manager.save.mockResolvedValue(updatedProvider);

            const result = await service.update('123', updateDto);

            expect(result).toEqual(updatedProvider);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it('should throw ConflictException when updating to existing name', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockProvider);
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockProvider);

            await expect(service.update('123', updateDto)).rejects.toThrow(ConflictException);
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('should remove a billing provider', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockProvider);
            mockQueryRunner.manager.remove.mockResolvedValue(mockProvider);

            const result = await service.remove('123');

            expect(result).toBe(true);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        });

        it('should throw NotFoundException when provider not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            await expect(service.remove('123')).rejects.toThrow(NotFoundException);
        });
    });
});
