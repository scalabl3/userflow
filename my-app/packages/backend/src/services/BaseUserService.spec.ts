import { Test, TestingModule } from '@nestjs/testing';
import { BaseUserService } from './BaseUserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BaseUser } from '../models/BaseUser';
import { DataSource, DeleteResult, EntityManager, FindOneOptions, FindOptionsWhere, QueryRunner, Repository, SaveOptions } from 'typeorm';
import { CreateBaseUserDto, ResponseBaseUserDto, UpdateBaseUserDto } from '@my-app/shared';
import { UserState } from '@my-app/shared';
import { BadRequestException } from '@nestjs/common';
import { user as userMock } from '../models/test/__mocks__/user.mock';
import { auth as authMock } from '../models/test/__mocks__/auth.mock';
import { mockRepository } from '../test/setup';
import { plainToClass } from 'class-transformer';

type MockType<T> = {
    [P in keyof T]?: jest.Mock<any>;
};

describe('BaseUserService', () => {
    let service: BaseUserService;
    let repository: MockType<Repository<BaseUser>>;
    let dataSource: DataSource;
    let mockQueryRunner: QueryRunner;
    let mockManager: EntityManager;

    beforeEach(async () => {
        mockManager = {
            save: jest.fn().mockImplementation(async (entity: any) => entity),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as EntityManager;

        mockQueryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: mockManager,
        } as unknown as QueryRunner;

        const mockDataSource = {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
        } as unknown as DataSource;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BaseUserService,
                {
                    provide: getRepositoryToken(BaseUser),
                    useFactory: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<BaseUserService>(BaseUserService);
        repository = module.get(getRepositoryToken(BaseUser));
        dataSource = module.get<DataSource>(DataSource);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAllBaseUsers', () => {
        it('should return all users with their credentials', async () => {
            const users = [userMock.base];
            const responseDto = plainToClass(ResponseBaseUserDto, users[0]);
            repository.find?.mockImplementation(async () => users);

            const result = await service.findAllBaseUsers();
            expect(result).toEqual([responseDto]);
            expect(repository.find).toHaveBeenCalledWith({
                relations: {
                    loginCredentials: true
                }
            });
        });

        it('should return empty array when no users exist', async () => {
            repository.find?.mockImplementation(async () => []);

            const result = await service.findAllBaseUsers();
            expect(result).toEqual([]);
        });
    });

    describe('findOneBaseUser', () => {
        it('should return user with login credentials', async () => {
            const user = userMock.base;
            const responseDto = plainToClass(ResponseBaseUserDto, user);
            repository.findOne?.mockImplementation(async () => user);

            const result = await service.findOneBaseUser(user.id);

            expect(result).toEqual(responseDto);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: user.id },
                relations: {
                    loginCredentials: true
                }
            });
        });

        it('should return null if user not found', async () => {
            repository.findOne?.mockImplementation(async () => null);

            const result = await service.findOneBaseUser('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('createBaseUser', () => {
        it('should create a user', async () => {
            const createUserDto: CreateBaseUserDto = {
                firstname: userMock.base.firstname,
                lastname: userMock.base.lastname,
                contactEmail: userMock.base.contactEmail
            };

            const savedUser = userMock.base;
            const responseDto = plainToClass(ResponseBaseUserDto, savedUser);

            mockManager.save = jest.fn().mockResolvedValue(savedUser);
            repository.create?.mockImplementation(() => savedUser);

            const result = await service.createBaseUser(createUserDto);

            expect(result).toEqual(responseDto);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });

        it('should rollback transaction on error', async () => {
            const createUserDto: CreateBaseUserDto = {
                firstname: userMock.base.firstname,
                lastname: userMock.base.lastname,
                contactEmail: userMock.base.contactEmail
            };

            const error = new Error('Database error');
            mockManager.save = jest.fn().mockRejectedValue(error);

            await expect(service.createBaseUser(createUserDto))
                .rejects
                .toThrow(error);

            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });
    });

    describe('updateBaseUser', () => {
        it('should update user state', async () => {
            const updateDto: UpdateBaseUserDto = { state: UserState.ACTIVE };
            const updatedUser = { ...userMock.base, ...updateDto };
            const responseDto = plainToClass(ResponseBaseUserDto, updatedUser);

            mockManager.save = jest.fn().mockResolvedValue(updatedUser);
            repository.findOne?.mockImplementation(async () => updatedUser);

            const result = await service.updateBaseUser(userMock.base.id, updateDto);

            expect(result).toEqual(responseDto);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });

        it('should return null if user not found', async () => {
            repository.findOne?.mockImplementation(async () => null);

            const result = await service.updateBaseUser('nonexistent', { state: UserState.ACTIVE });
            expect(result).toBeNull();
        });

        it('should allow updating all user fields', async () => {
            const updateDto: UpdateBaseUserDto = {
                firstname: 'Updated',
                lastname: 'User',
                contactEmail: 'updated@example.com',
                state: UserState.ACTIVE,
                isEnabled: false
            };

            const updatedUser = { ...userMock.base, ...updateDto };
            const responseDto = plainToClass(ResponseBaseUserDto, updatedUser);

            mockManager.save = jest.fn().mockResolvedValue(updatedUser);
            repository.findOne?.mockImplementation(async () => updatedUser);

            const result = await service.updateBaseUser(userMock.base.id, updateDto);
            expect(result).toEqual(responseDto);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });

        it('should rollback transaction on error', async () => {
            const updateDto: UpdateBaseUserDto = { state: UserState.ACTIVE };
            const error = new Error('Database error');

            mockManager.save = jest.fn().mockRejectedValue(error);
            repository.findOne?.mockImplementation(async () => userMock.base);

            await expect(service.updateBaseUser(userMock.base.id, updateDto))
                .rejects
                .toThrow(error);

            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });
    });

    describe('removeBaseUser', () => {
        it('should delete a user', async () => {
            mockManager.delete = jest.fn().mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] } as DeleteResult);
            repository.findOne?.mockImplementation(async () => userMock.base);

            const result = await service.removeBaseUser(userMock.base.id);
            expect(result).toBe(true);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });

        it('should rollback transaction on error', async () => {
            const error = new Error('Database error');
            mockManager.delete = jest.fn().mockRejectedValue(error);
            repository.findOne?.mockImplementation(async () => userMock.base);

            await expect(service.removeBaseUser(userMock.base.id))
                .rejects
                .toThrow(error);

            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });
    });
}); 