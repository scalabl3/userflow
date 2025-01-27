import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './UserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { Organization } from '../models/Organization';

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;

    const mockUser = new User();
    const mockOrg = new Organization();
    mockOrg.id = 'org123';
    mockOrg.name = 'Test Org';

    mockUser.id = 'user123';
    mockUser.firstname = 'John';
    mockUser.lastname = 'Doe';
    mockUser.displayname = 'John Doe';
    mockUser.contactEmail = 'john.doe@example.com';
    mockUser.organization = mockOrg;
    mockUser.organizationId = mockOrg.id;
    mockUser.preferences = {
        theme: 'light',
        notifications: {
            email: true,
            push: true
        }
    };
    mockUser.createdAt = new Date();
    mockUser.modifiedAt = new Date();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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

            jest.spyOn(repository, 'create').mockReturnValue(mockUser);
            jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

            const result = await service.create(createUserDto);

            expect(repository.create).toHaveBeenCalledWith(createUserDto);
            expect(repository.save).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUser);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [mockUser];
            jest.spyOn(repository, 'find').mockResolvedValue(users);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalledWith({
                relations: ['organization']
            });
            expect(result).toEqual(users);
        });

        it('should return empty array when no users exist', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue([]);

            const result = await service.findAll();

            expect(repository.find).toHaveBeenCalledWith({
                relations: ['organization']
            });
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

            const result = await service.findOne('user123');

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: 'user123' },
                relations: ['organization']
            });
            expect(result).toEqual(mockUser);
        });

        it('should throw NotFoundException when user not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne('nonexistent')).rejects.toThrow(
                new NotFoundException('User with ID nonexistent not found')
            );
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
            
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

            const result = await service.update('user123', updateUserDto);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: 'user123' },
                relations: ['organization']
            });
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual(updatedUser);
        });

        it('should throw NotFoundException when updating non-existent user', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.update('nonexistent', {})).rejects.toThrow(
                new NotFoundException('User with ID nonexistent not found')
            );
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(repository, 'remove').mockResolvedValue(mockUser);

            await service.remove('user123');

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: 'user123' },
                relations: ['organization']
            });
            expect(repository.remove).toHaveBeenCalledWith(mockUser);
        });

        it('should throw NotFoundException when removing non-existent user', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.remove('nonexistent')).rejects.toThrow(
                new NotFoundException('User with ID nonexistent not found')
            );
        });
    });
});
