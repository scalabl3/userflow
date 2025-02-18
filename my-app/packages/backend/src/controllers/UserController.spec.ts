import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './UserController';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from '@my-app/shared';
import { NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { User } from '../models/User';
import { plainToClass } from 'class-transformer';
import { user as userMock } from '../__mocks__/models/user.mock';
import { DataSource } from 'typeorm';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

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

    const mockUserDto = plainToClass(ResponseUserDto, userMock.standard, { excludeExtraneousValues: true });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        findByUsername: jest.fn(),
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

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto = userMock.dtos.create;

            jest.spyOn(service, 'create').mockResolvedValue(userMock.standard);

            const result = await controller.create(createUserDto);

            expect(service.create).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual(mockUserDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([userMock.standard]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockUserDto]);
        });

        it('should return empty array when no users exist', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it('should find users by username query', async () => {
            jest.spyOn(service, 'findByUsername').mockResolvedValue(userMock.standard);

            const result = await controller.findAll(userMock.standard.username);

            expect(service.findByUsername).toHaveBeenCalledWith(userMock.standard.username);
            expect(result).toEqual([mockUserDto]);
        });

        it('should return empty array when username not found', async () => {
            jest.spyOn(service, 'findByUsername').mockResolvedValue(null);

            const result = await controller.findAll('nonexistent');

            expect(service.findByUsername).toHaveBeenCalledWith('nonexistent');
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(userMock.standard);

            const result = await controller.findOne(userMock.standard.id);

            expect(service.findOne).toHaveBeenCalledWith(userMock.standard.id);
            expect(result).toEqual(mockUserDto);
        });
    });

    describe('findByUsername', () => {
        it('should return a user by username', async () => {
            jest.spyOn(service, 'findByUsername').mockResolvedValue(userMock.standard);

            const result = await controller.findByUsername(userMock.standard.username);

            expect(service.findByUsername).toHaveBeenCalledWith(userMock.standard.username);
            expect(result).toEqual(mockUserDto);
        });

        it('should throw NotFoundException when username not found', async () => {
            jest.spyOn(service, 'findByUsername').mockResolvedValue(null);

            await expect(controller.findByUsername('nonexistent')).rejects.toThrow(
                new NotFoundException('User with username nonexistent not found')
            );
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = userMock.dtos.update;
            const updatedUser = new User();
            Object.assign(updatedUser, userMock.standard);
            if (updateUserDto.displayname) {
                updatedUser.displayname = updateUserDto.displayname;
            }

            jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

            const result = await controller.update(userMock.standard.id, updateUserDto);

            expect(service.update).toHaveBeenCalledWith(userMock.standard.id, updateUserDto);
            expect(result).toEqual(plainToClass(ResponseUserDto, updatedUser, { excludeExtraneousValues: true }));
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            const result = await controller.remove(userMock.standard.id);

            expect(service.remove).toHaveBeenCalledWith(userMock.standard.id);
            expect(result).toBe(true);
        });

        it('should throw NotFoundException when user does not exist', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);

            await expect(controller.remove('nonexistent-id')).rejects.toThrow(
                new NotFoundException('User with ID nonexistent-id not found')
            );
        });

        it('should handle unexpected errors', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new Error());

            await expect(controller.remove(userMock.standard.id)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });
    });

    describe('error handling', () => {
        it('should handle ConflictException in create', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(
                new ConflictException('User with this username already exists')
            );

            await expect(controller.create(userMock.dtos.create)).rejects.toThrow(ConflictException);
        });

        it('should handle BadRequestException in create', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(null);

            await expect(controller.create(userMock.dtos.create)).rejects.toThrow(BadRequestException);
        });

        it('should handle NotFoundException in findOne', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);

            await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
                new NotFoundException('User with ID nonexistent-id not found')
            );
        });

        it('should handle unexpected errors in update', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new Error());

            await expect(controller.update(userMock.standard.id, userMock.dtos.update)).rejects.toThrow(
                new InternalServerErrorException('An unexpected error occurred')
            );
        });

        it('should handle ConflictException in update', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(
                new ConflictException('User with this username already exists')
            );

            await expect(controller.update(userMock.standard.id, userMock.dtos.update)).rejects.toThrow(ConflictException);
        });
    });
});
