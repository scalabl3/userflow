import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './UserController';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto, ResponseUserDto, UserState } from '@my-app/shared';
import { HttpStatus } from '@nestjs/common';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { plainToClass } from 'class-transformer';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    let mockOrg = new Organization();
    mockOrg.id = 'org123';
    mockOrg.name = 'Test Org';
    mockOrg.visible = true;
    mockOrg.adminUser = 'admin123';
    mockOrg.createdAt = new Date();
    mockOrg.modifiedAt = new Date();

    let mockUser = new User();
    mockUser.id = 'user123';
    mockUser.firstname = 'John';
    mockUser.lastname = 'Doe';
    mockUser.displayname = 'John Doe';
    mockUser.contactEmail = 'john.doe@example.com';
    mockUser.organizationId = mockOrg.id;
    mockUser.state = UserState.ACTIVE;
    mockUser.preferences = {
        theme: 'light',
        notifications: {
            email: true,
            push: true
        }
    };
    mockUser.createdAt = new Date();
    mockUser.modifiedAt = new Date();

    let mockUserDto = plainToClass(ResponseUserDto, {
        ...mockUser,
        preferences: mockUser.preferences
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
            const createUserDto: CreateUserDto = {
                firstname: 'John',
                lastname: 'Doe',
                displayname: 'John Doe',
                contactEmail: 'john.doe@example.com',
                organizationId: 'org123',
                preferences: {
                    theme: 'light',
                    notifications: {
                        email: true,
                        push: true
                    }
                }
            };

            jest.spyOn(service, 'create').mockResolvedValue(mockUser);

            const result = await controller.create(createUserDto);

            expect(service.create).toHaveBeenCalledWith(createUserDto);
            expect(result).toEqual(mockUserDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([mockUser]);

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
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

            const result = await controller.findOne('user123');

            expect(service.findOne).toHaveBeenCalledWith('user123');
            expect(result).toEqual(mockUserDto);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = {
                firstname: 'Jane',
                preferences: {
                    theme: 'dark'
                }
            };

            const updatedUser = new User();
            Object.assign(updatedUser, mockUser, updateUserDto);
            const updatedUserDto = plainToClass(ResponseUserDto, {
                ...updatedUser,
                preferences: updatedUser.preferences
            }, { excludeExtraneousValues: true });

            jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

            const result = await controller.update('user123', updateUserDto);

            expect(service.update).toHaveBeenCalledWith('user123', updateUserDto);
            expect(result).toEqual(updatedUserDto);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(undefined);

            await controller.remove('user123');

            expect(service.remove).toHaveBeenCalledWith('user123');
        });
    });
});
