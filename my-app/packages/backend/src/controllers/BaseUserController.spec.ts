import { Test, TestingModule } from '@nestjs/testing';
import { BaseUserController } from './BaseUserController';
import { BaseUserService } from '../services/BaseUserService';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';
import { user as userMock } from '../models/test/__mocks__/user.mock';
import { auth as authMock } from '../models/test/__mocks__/auth.mock';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('BaseUserController', () => {
    let controller: BaseUserController;
    let service: BaseUserService;

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BaseUserController],
            providers: [
                {
                    provide: BaseUserService,
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

        controller = module.get<BaseUserController>(BaseUserController);
        service = module.get<BaseUserService>(BaseUserService);

        // Reset mocks between tests
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a base user', async () => {
            const createBaseUserDto: CreateBaseUserDto = {
                firstname: userMock.base.firstname,
                lastname: userMock.base.lastname,
                contactEmail: userMock.base.contactEmail
            };

            jest.spyOn(service, 'create').mockResolvedValue(userMock.base);

            const result = await controller.create(createBaseUserDto);

            expect(result).toEqual(userMock.base);
            expect(service.create).toHaveBeenCalledWith(createBaseUserDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of base users', async () => {
            const baseUsers = [userMock.base];
            jest.spyOn(service, 'findAll').mockResolvedValue(baseUsers);

            const result = await controller.findAll();

            expect(result).toEqual(baseUsers);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no users exist', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
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
        it('should return a base user by id', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(userMock.base);

            const result = await controller.findOne(userMock.base.id);

            expect(result).toEqual(userMock.base);
            expect(service.findOne).toHaveBeenCalledWith(userMock.base.id);
        });

        it('should throw NotFoundException when user not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);

            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
                new NotFoundException('BaseUser with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
            
            await expect(controller.findOne(userMock.base.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('update', () => {
        it('should update a base user', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated',
                lastname: 'Name'
            };

            const updatedUser = {
                ...userMock.base,
                ...updateBaseUserDto
            };

            jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

            const result = await controller.update(userMock.base.id, updateBaseUserDto);

            expect(result).toEqual(updatedUser);
            expect(service.update).toHaveBeenCalledWith(userMock.base.id, updateBaseUserDto);
        });

        it('should throw NotFoundException when user not found', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated'
            };

            jest.spyOn(service, 'update').mockResolvedValue(null);

            await expect(controller.update('nonexistent-id', updateBaseUserDto)).rejects.toThrow(
                new NotFoundException('BaseUser with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated'
            };

            jest.spyOn(service, 'update').mockRejectedValue(new Error());
            
            await expect(controller.update(userMock.base.id, updateBaseUserDto)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            await controller.remove('test-id');

            expect(service.remove).toHaveBeenCalledWith('test-id');
        });

        it('should throw NotFoundException when user not found', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);

            await expect(controller.remove('nonexistent')).rejects.toThrow(
                new NotFoundException('BaseUser with ID nonexistent not found')
            );
import { Test, TestingModule } from '@nestjs/testing';
import { BaseUserController } from './BaseUserController';
import { BaseUserService } from '../services/BaseUserService';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';
import { user as userMock } from '../test/__mocks__/user.mock';
import { auth as authMock } from '../test/__mocks__/auth.mock';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('BaseUserController', () => {
    let controller: BaseUserController;
    let service: BaseUserService;

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BaseUserController],
            providers: [
                {
                    provide: BaseUserService,
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

        controller = module.get<BaseUserController>(BaseUserController);
        service = module.get<BaseUserService>(BaseUserService);

        // Reset mocks between tests
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a base user', async () => {
            const createBaseUserDto: CreateBaseUserDto = {
                firstname: userMock.base.firstname,
                lastname: userMock.base.lastname,
                contactEmail: userMock.base.contactEmail
            };

            jest.spyOn(service, 'create').mockResolvedValue(userMock.base);

            const result = await controller.create(createBaseUserDto);

            expect(result).toEqual(userMock.base);
            expect(service.create).toHaveBeenCalledWith(createBaseUserDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of base users', async () => {
            const baseUsers = [userMock.base];
            jest.spyOn(service, 'findAll').mockResolvedValue(baseUsers);

            const result = await controller.findAll();

            expect(result).toEqual(baseUsers);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no users exist', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
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
        it('should return a base user by id', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(userMock.base);

            const result = await controller.findOne(userMock.base.id);

            expect(result).toEqual(userMock.base);
            expect(service.findOne).toHaveBeenCalledWith(userMock.base.id);
        });

        it('should throw NotFoundException when user not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);

            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
                new NotFoundException('BaseUser with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
            
            await expect(controller.findOne(userMock.base.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('update', () => {
        it('should update a base user', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated',
                lastname: 'Name'
            };

            const updatedUser = {
                ...userMock.base,
                ...updateBaseUserDto
            };

            jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

            const result = await controller.update(userMock.base.id, updateBaseUserDto);

            expect(result).toEqual(updatedUser);
            expect(service.update).toHaveBeenCalledWith(userMock.base.id, updateBaseUserDto);
        });

        it('should throw NotFoundException when user not found', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated'
            };

            jest.spyOn(service, 'update').mockResolvedValue(null);

            await expect(controller.update('nonexistent-id', updateBaseUserDto)).rejects.toThrow(
                new NotFoundException('BaseUser with ID nonexistent-id not found')
            );
        });

        it('should handle errors', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated'
            };

            jest.spyOn(service, 'update').mockRejectedValue(new Error());
            
            await expect(controller.update(userMock.base.id, updateBaseUserDto)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            await controller.remove('test-id');

            expect(service.remove).toHaveBeenCalledWith('test-id');
        });

        it('should throw NotFoundException when user not found', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);

            await expect(controller.remove('nonexistent')).rejects.toThrow(
                new NotFoundException('BaseUser with ID nonexistent not found')
            );
        });
    });
}); 