import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './OrganizationController';
import { OrganizationService } from '../services/OrganizationService';
import { CreateOrganizationDto, UpdateOrganizationDto, ResponseOrganizationDto } from '@my-app/shared';
import { NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { Organization } from '../models/Organization';
import { plainToClass } from 'class-transformer';
import { organization as orgMock } from '../models/test/__mocks__/organization.mock';
import { DataSource } from 'typeorm';

describe('OrganizationController', () => {
    let controller: OrganizationController;
    let service: OrganizationService;

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

    const mockOrg: Organization = {
        ...orgMock.standard,
        users: []
    };

    const mockOrgDto = plainToClass(ResponseOrganizationDto, mockOrg, { excludeExtraneousValues: true });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrganizationController],
            providers: [
                {
                    provide: OrganizationService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
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

        controller = module.get<OrganizationController>(OrganizationController);
        service = module.get<OrganizationService>(OrganizationService);

        jest.clearAllMocks();
    });

    describe('Controller Setup', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
            expect(service).toBeDefined();
        });
    });

    describe('findAll', () => {
        it('should return an array of organizations', async () => {
            const organizations = [mockOrg];
            jest.spyOn(service, 'findAll').mockResolvedValue(organizations);
            
            const result = await controller.findAll();
            
            expect(result).toEqual([mockOrgDto]);
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
        it('should return a single organization', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockOrg);
            
            const result = await controller.findOne(mockOrg.id);
            
            expect(result).toEqual(mockOrgDto);
            expect(service.findOne).toHaveBeenCalledWith(mockOrg.id);
        });

        it('should throw not found exception when organization does not exist', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);
            
            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
                new NotFoundException('Organization with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
            
            await expect(controller.findOne(mockOrg.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('create', () => {
        const createDto: CreateOrganizationDto = orgMock.dtos.create;

        it('should create an organization', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(mockOrg);
            
            const result = await controller.create(createDto);
            
            expect(result).toEqual(mockOrgDto);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });

        it('should handle duplicate name error', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(
                new ConflictException('Organization with this name already exists')
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
        const updateDto: UpdateOrganizationDto = orgMock.dtos.update;

        it('should update an organization', async () => {
            const updatedOrg = { ...mockOrg, ...updateDto };
            jest.spyOn(service, 'update').mockResolvedValue(updatedOrg);
            
            const result = await controller.update(mockOrg.id, updateDto);
            
            expect(result).toEqual(plainToClass(ResponseOrganizationDto, updatedOrg, { excludeExtraneousValues: true }));
            expect(service.update).toHaveBeenCalledWith(mockOrg.id, updateDto);
        });

        it('should throw not found exception when organization does not exist', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);
            
            await expect(controller.update('nonexistent-id', updateDto)).rejects.toThrow(
                new NotFoundException('Organization with ID nonexistent-id not found')
            );
        });

        it('should handle duplicate name error', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(
                new ConflictException('Organization with this name already exists')
            );
            
            await expect(controller.update(mockOrg.id, updateDto)).rejects.toThrow(ConflictException);
        });

        it('should handle other errors', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new Error());
            
            await expect(controller.update(mockOrg.id, updateDto)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('remove', () => {
        it('should remove an organization', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);
            
            const result = await controller.remove(mockOrg.id);
            
            expect(result).toBe(true);
            expect(service.remove).toHaveBeenCalledWith(mockOrg.id);
        });

        it('should throw not found exception when organization does not exist', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);
            
            await expect(controller.remove('nonexistent-id')).rejects.toThrow(
                new NotFoundException('Organization with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new Error());
            
            await expect(controller.remove(mockOrg.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });
}); 
