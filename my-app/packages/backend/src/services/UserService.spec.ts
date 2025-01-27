import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './UserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { Organization } from '../models/Organization';
import { UserState } from '@my-app/shared/dist/enums/UserState';

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;

    let mockOrg: Organization;
    let mockUser: User;

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

        mockOrg = new Organization();
        mockOrg.id = 'org123';
        mockOrg.name = 'Test Org';
        mockOrg.visible = true;

        mockUser = new User();
        mockUser.id = 'user123';
        mockUser.firstname = 'John';
        mockUser.lastname = 'Doe';
        mockUser.username = 'johndoe';
        mockUser.displayname = 'John Doe';
        mockUser.contactEmail = 'john@example.com';
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
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user when username is unique', async () => {
            const createUserDto: CreateUserDto = {
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
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

            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(mockUser);
            jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

            const result = await service.create(createUserDto);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { username: createUserDto.username }
            });
            expect(repository.create).toHaveBeenCalledWith(createUserDto);
            expect(repository.save).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual(mockUser);
        });

        it('should throw ConflictException when username already exists', async () => {
            const createUserDto: CreateUserDto = {
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
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

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

            await expect(service.create(createUserDto)).rejects.toThrow(
                new ConflictException(`Username ${createUserDto.username} is already taken`)
            );
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

    describe('findByUsername', () => {
        it('should return a user by username', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

            const result = await service.findByUsername('johndoe');

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { username: 'johndoe' },
                relations: ['organization']
            });
            expect(result).toEqual(mockUser);
        });

        it('should return null when username not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.findByUsername('nonexistent');

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { username: 'nonexistent' },
                relations: ['organization']
            });
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update a user when username is not changed', async () => {
            const updateUserDto: UpdateUserDto = {
                firstname: 'Jane',
                preferences: {
                    theme: 'dark'
                }
            };

            const updatedUser = new User();
            Object.assign(updatedUser, mockUser, updateUserDto);
            
            jest.spyOn(repository, 'findOne')
                .mockResolvedValueOnce(mockUser) // First call for findOne
                .mockResolvedValueOnce(null);    // Second call for username check
            jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

            const result = await service.update('user123', updateUserDto);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: 'user123' },
                relations: ['organization']
            });
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual(updatedUser);
        });

        it('should throw ConflictException when updating to existing username', async () => {
            const updateUserDto: UpdateUserDto = {
                username: 'existinguser'
            };

            jest.spyOn(repository, 'findOne')
                .mockResolvedValueOnce(mockUser) // First call for findOne
                .mockResolvedValueOnce(new User()); // Second call finding existing username

            await expect(service.update('user123', updateUserDto)).rejects.toThrow(
                new ConflictException(`Username ${updateUserDto.username} is already taken`)
            );
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
