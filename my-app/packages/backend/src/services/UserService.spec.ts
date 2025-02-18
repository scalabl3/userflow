import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './UserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '@my-app/shared/dist/dtos/User/CreateUserDto';
import { UpdateUserDto } from '@my-app/shared/dist/dtos/User/UpdateUserDto';
import { user as userMock } from '../__mocks__/models/user.mock';
import { mockRepository } from '../test/setup';

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));

        // Reset mocks
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user when username is unique', async () => {
            const createUserDto = userMock.dtos.create;

            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(userMock.standard);
            jest.spyOn(repository, 'save').mockResolvedValue(userMock.standard);

            const result = await service.create(createUserDto);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { username: createUserDto.username }
            });
            expect(repository.create).toHaveBeenCalledWith(createUserDto);
            expect(repository.save).toHaveBeenCalledWith(userMock.standard);
            expect(result).toEqual(userMock.standard);
        });

        it('should throw ConflictException when username already exists', async () => {
            const createUserDto = userMock.dtos.create;

            jest.spyOn(repository, 'findOne').mockResolvedValue(userMock.standard);

            await expect(service.create(createUserDto)).rejects.toThrow(
                new ConflictException(`Username ${createUserDto.username} is already taken`)
            );
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [userMock.standard];
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
            jest.spyOn(repository, 'findOne').mockResolvedValue(userMock.standard);

            const result = await service.findOne(userMock.standard.id);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: userMock.standard.id },
                relations: ['organization']
            });
            expect(result).toEqual(userMock.standard);
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
            jest.spyOn(repository, 'findOne').mockResolvedValue(userMock.standard);

            const result = await service.findByUsername(userMock.standard.username);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { username: userMock.standard.username },
                relations: ['organization']
            });
            expect(result).toEqual(userMock.standard);
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
            const updateUserDto = userMock.dtos.update;
            const updatedUser = new User();
            Object.assign(updatedUser, userMock.standard);
            if (updateUserDto.displayname) {
                updatedUser.displayname = updateUserDto.displayname;
            }
            if (updateUserDto.preferences) {
                updatedUser.preferences = updateUserDto.preferences;
            }
            
            jest.spyOn(repository, 'findOne')
                .mockResolvedValueOnce(userMock.standard) // First call for findOne
                .mockResolvedValueOnce(null);    // Second call for username check
            jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);

            const result = await service.update(userMock.standard.id, updateUserDto);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: userMock.standard.id },
                relations: ['organization']
            });
            expect(repository.save).toHaveBeenCalled();
            expect(result).toEqual(updatedUser);
        });

        it('should throw ConflictException when updating to existing username', async () => {
            const updateUserDto: UpdateUserDto = { username: 'existinguser' };

            jest.spyOn(repository, 'findOne')
                .mockResolvedValueOnce(userMock.standard) // First call for findOne
                .mockResolvedValueOnce(new User()); // Second call finding existing username

            await expect(service.update(userMock.standard.id, updateUserDto)).rejects.toThrow(
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
            jest.spyOn(repository, 'findOne').mockResolvedValue(userMock.standard);
            jest.spyOn(repository, 'remove').mockResolvedValue(userMock.standard);

            await service.remove(userMock.standard.id);

            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: userMock.standard.id },
                relations: ['organization']
            });
            expect(repository.remove).toHaveBeenCalledWith(userMock.standard);
        });

        it('should throw NotFoundException when removing non-existent user', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            await expect(service.remove('nonexistent')).rejects.toThrow(
                new NotFoundException('User with ID nonexistent not found')
            );
        });
    });
});
