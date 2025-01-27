import { Test, TestingModule } from '@nestjs/testing';
import { BaseUserService } from './BaseUserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BaseUser } from '../models/BaseUser';
import { Repository, UpdateResult } from 'typeorm';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UserState } from '@my-app/shared/dist/enums/UserState';
import { BadRequestException } from '@nestjs/common';
import { LoginProvider } from '../models/LoginProvider';
import { LoginCredential, CredentialType } from '../models/LoginCredential';
import { mockRepository } from '../test/setup';

describe('BaseUserService', () => {
    let service: BaseUserService;
    let repository: Repository<BaseUser>;

    const mockLoginProvider: LoginProvider = {
        id: '123',
        code: 'email',
        name: 'Email and Password',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    } as LoginProvider;

    const mockLoginCredential: LoginCredential = {
        id: '456',
        identifier: 'test@example.com',
        credentials: 'hashedPassword',
        credentialType: CredentialType.PASSWORD,
        loginProvider: mockLoginProvider,
        loginProviderId: '123',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    } as LoginCredential;

    const mockUser: BaseUser = {
        id: '789',
        state: UserState.ACTIVE,
        primaryLoginCredentialId: '456',
        loginCredentials: [mockLoginCredential],
        createdAt: new Date(),
        modifiedAt: new Date()
    } as BaseUser;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BaseUserService,
                {
                    provide: getRepositoryToken(BaseUser),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<BaseUserService>(BaseUserService);
        repository = module.get<Repository<BaseUser>>(getRepositoryToken(BaseUser));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user with a login credential', async () => {
            const createUserDto: CreateBaseUserDto = {
                firstname: 'John',
                lastname: 'Doe',
                displayname: 'johndoe',
                contactEmail: 'john@example.com',
                primaryLoginCredentialId: mockLoginCredential.id
            };

            const savedUser: BaseUser = {
                id: 'user123',
                ...createUserDto,
                state: UserState.PENDING,
                isEnabled: true,
                createdAt: new Date(),
                modifiedAt: new Date(),
                loginCredentials: [mockLoginCredential],
                primaryLoginCredential: mockLoginCredential
            };

            jest.spyOn(repository, 'create').mockReturnValue(savedUser);
            jest.spyOn(repository, 'save').mockResolvedValue(savedUser);
            jest.spyOn(repository, 'findOne').mockResolvedValue(savedUser);

            const result = await service.create(createUserDto);

            expect(result).toEqual(savedUser);
            expect(repository.create).toHaveBeenCalledWith(createUserDto);
            expect(repository.save).toHaveBeenCalled();
        });

        it('should throw error if no login credential is provided', async () => {
            const createUserDto: CreateBaseUserDto = {
                firstname: 'John',
                lastname: 'Doe',
                displayname: 'johndoe',
                contactEmail: 'john@example.com'
            };

            await expect(service.create(createUserDto))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all users with their credentials', async () => {
            const users = [mockUser];
            jest.spyOn(repository, 'find').mockResolvedValue(users);

            const result = await service.findAll();
            expect(result).toEqual(users);
            expect(repository.find).toHaveBeenCalledWith({
                relations: {
                    loginCredentials: true,
                    primaryLoginCredential: true
                }
            });
        });

        it('should return empty array when no users exist', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue([]);

            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return user with login credentials', async () => {
            const userId = 'user123';
            const user: BaseUser = {
                id: userId,
                firstname: 'John',
                lastname: 'Doe',
                displayname: 'johndoe',
                contactEmail: 'john@example.com',
                state: UserState.PENDING,
                isEnabled: true,
                createdAt: new Date(),
                modifiedAt: new Date(),
                loginCredentials: [mockLoginCredential],
                primaryLoginCredential: mockLoginCredential
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(user);

            const result = await service.findOne(userId);

            expect(result).toEqual(user);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: userId },
                relations: {
                    loginCredentials: true,
                    primaryLoginCredential: true
                }
            });
        });

        it('should return null if user not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.findOne('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update user state', async () => {
            const userId = 'user123';
            const updateDto = { state: UserState.ACTIVE };
            const existingUser: BaseUser = {
                id: userId,
                firstname: 'John',
                lastname: 'Doe',
                displayname: 'johndoe',
                contactEmail: 'john@example.com',
                state: UserState.PENDING,
                isEnabled: true,
                createdAt: new Date(),
                modifiedAt: new Date(),
                loginCredentials: [mockLoginCredential],
                primaryLoginCredential: mockLoginCredential
            };
            const updatedUser = { ...existingUser, ...updateDto };

            jest.spyOn(repository, 'findOne').mockResolvedValue(updatedUser);
            jest.spyOn(repository, 'update').mockResolvedValue({
                affected: 1,
                raw: {},
                generatedMaps: []
            } as UpdateResult);

            const result = await service.update(userId, updateDto);

            expect(result).toEqual(updatedUser);
            expect(repository.update).toHaveBeenCalledWith(userId, updateDto);
        });

        it('should not allow removing primary login credential', async () => {
            const userId = '789';
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

            await expect(service.update(userId, { primaryLoginCredentialId: undefined }))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should return null if user not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.update('nonexistent', { state: UserState.ACTIVE });
            expect(result).toBeNull();
        });

        it('should allow updating fields other than primaryLoginCredentialId', async () => {
            const userId = '789';
            const updateDto = {
                firstname: 'Updated',
                lastname: 'User',
                displayname: 'updateduser',
                contactEmail: 'updated@example.com',
                state: UserState.ACTIVE,
                isEnabled: false
            };

            const existingUser = { ...mockUser };
            const updatedUser = { ...existingUser, ...updateDto };

            jest.spyOn(repository, 'findOne').mockResolvedValue(updatedUser);
            jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

            const result = await service.update(userId, updateDto);
            expect(result).toEqual(updatedUser);
            expect(repository.update).toHaveBeenCalledWith(userId, updateDto);
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            await service.remove('user123');
            expect(repository.delete).toHaveBeenCalledWith('user123');
        });

        it('should not throw if user does not exist', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            await expect(service.remove('nonexistent')).resolves.not.toThrow();
        });
    });
}); 