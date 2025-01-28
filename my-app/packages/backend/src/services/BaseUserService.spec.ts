import { Test, TestingModule } from '@nestjs/testing';
import { BaseUserService } from './BaseUserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BaseUser } from '../models/BaseUser';
import { Repository, UpdateResult } from 'typeorm';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UserState } from '@my-app/shared/dist/enums/UserState';
import { BadRequestException } from '@nestjs/common';
import { user as userMock } from '../test/__mocks__/user.mock';
import { auth as authMock } from '../test/__mocks__/auth.mock';
import { mockRepository } from '../test/setup';

describe('BaseUserService', () => {
    let service: BaseUserService;
    let repository: Repository<BaseUser>;

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
                firstname: userMock.base.firstname,
                lastname: userMock.base.lastname,
                contactEmail: userMock.base.contactEmail,
                primaryLoginCredentialId: authMock.credentials.password.id
            };

            const savedUser = userMock.base;

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
                firstname: userMock.base.firstname,
                lastname: userMock.base.lastname,
                contactEmail: userMock.base.contactEmail
            };

            await expect(service.create(createUserDto))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all users with their credentials', async () => {
            const users = [userMock.base];
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
            jest.spyOn(repository, 'findOne').mockResolvedValue(userMock.base);

            const result = await service.findOne(userMock.base.id);

            expect(result).toEqual(userMock.base);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: userMock.base.id },
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
            const updateDto = { state: UserState.ACTIVE };
            const updatedUser = { ...userMock.base, ...updateDto };

            jest.spyOn(repository, 'findOne').mockResolvedValue(updatedUser);
            jest.spyOn(repository, 'update').mockResolvedValue({
                affected: 1,
                raw: {},
                generatedMaps: []
            } as UpdateResult);

            const result = await service.update(userMock.base.id, updateDto);

            expect(result).toEqual(updatedUser);
            expect(repository.update).toHaveBeenCalledWith(userMock.base.id, updateDto);
        });

        it('should not allow removing primary login credential', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(userMock.base);
            jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

            await expect(service.update(userMock.base.id, { primaryLoginCredentialId: undefined }))
                .rejects
                .toThrow(BadRequestException);
        });

        it('should return null if user not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.update('nonexistent', { state: UserState.ACTIVE });
            expect(result).toBeNull();
        });

        it('should allow updating fields other than primaryLoginCredentialId', async () => {
            const updateDto = {
                firstname: 'Updated',
                lastname: 'User',
                contactEmail: 'updated@example.com',
                state: UserState.ACTIVE,
                isEnabled: false
            };

            const updatedUser = { ...userMock.base, ...updateDto };

            jest.spyOn(repository, 'findOne').mockResolvedValue(updatedUser);
            jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

            const result = await service.update(userMock.base.id, updateDto);
            expect(result).toEqual(updatedUser);
            expect(repository.update).toHaveBeenCalledWith(userMock.base.id, updateDto);
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            await service.remove(userMock.base.id);
            expect(repository.delete).toHaveBeenCalledWith(userMock.base.id);
        });
    });
}); 