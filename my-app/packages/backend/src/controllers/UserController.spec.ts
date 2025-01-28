import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './UserController';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from '@my-app/shared';
import { NotFoundException } from '@nestjs/common';
import { User } from '../models/User';
import { plainToClass } from 'class-transformer';
import { user as userMock } from '../test/__mocks__/user.mock';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    const mockUserDto = plainToClass(ResponseUserDto, {
        ...userMock.standard,
        preferences: userMock.standard.preferences
    }, { excludeExtraneousValues: true });

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
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
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

        it('should create a user with default preferences when none provided', async () => {
            const createUserDto = { ...userMock.dtos.create };
            const userWithoutPrefs = new User();
            Object.assign(userWithoutPrefs, { ...userMock.standard, preferences: undefined });

            jest.spyOn(service, 'create').mockResolvedValue(userWithoutPrefs);

            const result = await controller.create(createUserDto);

            expect(service.create).toHaveBeenCalledWith(createUserDto);
            expect(result.preferences).toEqual({
                theme: 'light',
                notifications: { email: true, push: true }
            });
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

        it('should handle users with missing preferences when searching by username', async () => {
            const userWithoutPrefs = new User();
            Object.assign(userWithoutPrefs, { ...userMock.standard, preferences: undefined });

            jest.spyOn(service, 'findByUsername').mockResolvedValue(userWithoutPrefs);

            const result = await controller.findAll(userMock.standard.username);

            expect(service.findByUsername).toHaveBeenCalledWith(userMock.standard.username);
            expect(result[0].preferences).toEqual({
                theme: 'light',
                notifications: { email: true, push: true }
            });
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(userMock.standard);

            const result = await controller.findOne(userMock.standard.id);

            expect(service.findOne).toHaveBeenCalledWith(userMock.standard.id);
            expect(result).toEqual(mockUserDto);
        });

        it('should return user with default preferences when none exist', async () => {
            const userWithoutPrefs = new User();
            Object.assign(userWithoutPrefs, { ...userMock.standard, preferences: undefined });

            jest.spyOn(service, 'findOne').mockResolvedValue(userWithoutPrefs);

            const result = await controller.findOne(userMock.standard.id);

            expect(service.findOne).toHaveBeenCalledWith(userMock.standard.id);
            expect(result.preferences).toEqual({
                theme: 'light',
                notifications: { email: true, push: true }
            });
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

        it('should return user with default preferences when none exist', async () => {
            const userWithoutPrefs = new User();
            Object.assign(userWithoutPrefs, { ...userMock.standard, preferences: undefined });

            jest.spyOn(service, 'findByUsername').mockResolvedValue(userWithoutPrefs);

            const result = await controller.findByUsername(userMock.standard.username);

            expect(service.findByUsername).toHaveBeenCalledWith(userMock.standard.username);
            expect(result.preferences).toEqual({
                theme: 'light',
                notifications: { email: true, push: true }
            });
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
            if (updateUserDto.preferences) {
                updatedUser.preferences = updateUserDto.preferences;
            }

            const updatedUserDto = plainToClass(ResponseUserDto, {
                ...updatedUser,
                preferences: updatedUser.preferences
            }, { excludeExtraneousValues: true });

            jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

            const result = await controller.update(userMock.standard.id, updateUserDto);

            expect(service.update).toHaveBeenCalledWith(userMock.standard.id, updateUserDto);
            expect(result).toEqual(updatedUserDto);
        });

        it('should update a user and set default preferences when none exist', async () => {
            const updateUserDto = userMock.dtos.update;
            const userWithoutPrefs = new User();
            Object.assign(userWithoutPrefs, { ...userMock.standard, preferences: undefined });

            jest.spyOn(service, 'update').mockResolvedValue(userWithoutPrefs);

            const result = await controller.update(userMock.standard.id, updateUserDto);

            expect(service.update).toHaveBeenCalledWith(userMock.standard.id, updateUserDto);
            expect(result.preferences).toEqual({
                theme: 'light',
                notifications: { email: true, push: true }
            });
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            await controller.remove('test-id');

            expect(service.remove).toHaveBeenCalledWith('test-id');
        });

        it('should throw NotFoundException when user not found', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);

            await expect(controller.remove('nonexistent')).rejects.toThrow(
                new NotFoundException('User with ID nonexistent not found')
            );
        });
    });
}); 
