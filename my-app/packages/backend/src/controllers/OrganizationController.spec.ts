import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './OrganizationController';
import { OrganizationService } from '../services/OrganizationService';
import { CreateOrganizationDto, UpdateOrganizationDto, ResponseOrganizationDto } from '@my-app/shared';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Organization } from '../models/Organization';
import { plainToClass } from 'class-transformer';
import { organization as orgMock } from '../test/__mocks__/organization.mock';
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

    const mockOrgDto = plainToClass(ResponseOrganizationDto, {
        ...orgMock.standard
    }, { excludeExtraneousValues: true });

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

        // Reset mocks between tests
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new organization', async () => {
            const createOrganizationDto = orgMock.dtos.create;

            jest.spyOn(service, 'create').mockResolvedValue(orgMock.standard);

            const result = await controller.create(createOrganizationDto);

            expect(service.create).toHaveBeenCalledWith(createOrganizationDto);
            expect(result).toEqual(mockOrgDto);
        });

        it('should handle bad request errors during creation', async () => {
            const createOrganizationDto = orgMock.dtos.create;
            const error = new BadRequestException('Invalid organization data');

            jest.spyOn(service, 'create').mockRejectedValue(error);

            await expect(controller.create(createOrganizationDto))
                .rejects
                .toThrow(error);
        });

        it('should handle not found errors during creation', async () => {
            const createOrganizationDto = orgMock.dtos.create;
            const error = new NotFoundException('Referenced entity not found');

            jest.spyOn(service, 'create').mockRejectedValue(error);

            await expect(controller.create(createOrganizationDto))
                .rejects
                .toThrow(error);
        });

        it('should handle unexpected errors during creation', async () => {
            const createOrganizationDto = orgMock.dtos.create;
            const error = new Error('Unexpected error');

            jest.spyOn(service, 'create').mockRejectedValue(error);

            await expect(controller.create(createOrganizationDto))
                .rejects
                .toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should return all organizations', async () => {
            const organizations = [orgMock.standard];
            jest.spyOn(service, 'findAll').mockResolvedValue(organizations);

            const result = await controller.findAll();

            expect(result).toEqual([mockOrgDto]);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should handle empty organization list', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
        });

        it('should handle unexpected errors', async () => {
            const error = new Error('Database error');
            jest.spyOn(service, 'findAll').mockRejectedValue(error);

            await expect(controller.findAll())
                .rejects
                .toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return an organization by id', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(orgMock.standard);

            const result = await controller.findOne(orgMock.standard.id);

            expect(result).toEqual(mockOrgDto);
            expect(service.findOne).toHaveBeenCalledWith(orgMock.standard.id);
        });

        it('should handle organization not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);

            await expect(controller.findOne('nonexistent'))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should handle unexpected errors', async () => {
            const error = new Error('Database error');
            jest.spyOn(service, 'findOne').mockRejectedValue(error);

            await expect(controller.findOne(orgMock.standard.id))
                .rejects
                .toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update an organization', async () => {
            const updateOrganizationDto: UpdateOrganizationDto = {
                name: 'Updated Org',
                visible: false
            };

            const updatedOrg = { 
                ...orgMock.standard, 
                ...updateOrganizationDto 
            };

            jest.spyOn(service, 'update').mockResolvedValue(updatedOrg);

            const result = await controller.update(orgMock.standard.id, updateOrganizationDto);

            expect(result).toEqual(plainToClass(ResponseOrganizationDto, updatedOrg, { excludeExtraneousValues: true }));
            expect(service.update).toHaveBeenCalledWith(orgMock.standard.id, updateOrganizationDto);
        });

        it('should handle organization not found during update', async () => {
            const updateOrganizationDto: UpdateOrganizationDto = {
                name: 'Updated Org'
            };

            jest.spyOn(service, 'update').mockResolvedValue(null);

            await expect(controller.update('nonexistent', updateOrganizationDto))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should handle bad request errors during update', async () => {
            const updateOrganizationDto: UpdateOrganizationDto = {
                name: 'Updated Org'
            };
            const error = new BadRequestException('Invalid update data');

            jest.spyOn(service, 'update').mockRejectedValue(error);

            await expect(controller.update(orgMock.standard.id, updateOrganizationDto))
                .rejects
                .toThrow(error);
        });

        it('should handle unexpected errors during update', async () => {
            const updateOrganizationDto: UpdateOrganizationDto = {
                name: 'Updated Org'
            };
            const error = new Error('Database error');

            jest.spyOn(service, 'update').mockRejectedValue(error);

            await expect(controller.update(orgMock.standard.id, updateOrganizationDto))
                .rejects
                .toThrow(InternalServerErrorException);
        });
    });

    describe('remove', () => {
        it('should delete an organization', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            await controller.remove(orgMock.standard.id);

            expect(service.remove).toHaveBeenCalledWith(orgMock.standard.id);
        });

        it('should handle organization not found during deletion', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);

            await expect(controller.remove('nonexistent'))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should handle bad request errors during deletion', async () => {
            const error = new BadRequestException('Cannot delete organization with active users');

            jest.spyOn(service, 'remove').mockRejectedValue(error);

            await expect(controller.remove(orgMock.standard.id))
                .rejects
                .toThrow(error);
        });

        it('should handle unexpected errors during deletion', async () => {
            const error = new Error('Database error');
            jest.spyOn(service, 'remove').mockRejectedValue(error);

            await expect(controller.remove(orgMock.standard.id))
                .rejects
                .toThrow(InternalServerErrorException);
        });
    });
}); 
