import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './UserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository, DataSource } from 'typeorm';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { user as userMock } from '../__mocks__/models/user.mock';
import { organization as orgMock } from '../__mocks__/models/organization.mock';
import { UserState, CreateUserDto, UpdateUserDto } from '@my-app/shared';
import { TestDataFactory } from '../__mocks__/factories/test-data.factory';
import { mockRepository } from '../test/setup';

describe('UserService', () => {
    let service: UserService;
    let repository: jest.Mocked<Repository<User>>;
    let dataSource: jest.Mocked<DataSource>;

    // Mock data setup using TestDataFactory
    const mockData = {
        user: userMock.instances.standard,
        createDto: TestDataFactory.createUserDto<CreateUserDto>('create', {
            username: 'newuser',
            firstname: 'New',
            lastname: 'User',
            contactEmail: 'new@example.com',
            organizationId: orgMock.instances.standard.id
        }),
        updateDto: TestDataFactory.createUserDto<UpdateUserDto>('update', {
            firstname: 'Updated',
            lastname: 'User',
            displayname: 'Updated User'
        })
    };

    beforeEach(async () => {
        // Create mock DataSource
        dataSource = {
            createQueryRunner: jest.fn().mockReturnValue({
                connect: jest.fn(),
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                rollbackTransaction: jest.fn(),
                release: jest.fn(),
            }),
            getRepository: jest.fn(),
            manager: {
                transaction: jest.fn(),
            },
        } as unknown as jest.Mocked<DataSource>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: () => mockRepository<User>(),
                },
                {
                    provide: DataSource,
                    useValue: dataSource,
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get(getRepositoryToken(User));
    });

    describe('success cases', () => {
        describe('read operations', () => {
            it('finds all users', async () => {
                const users = userMock.lists.multiple;
                repository.find.mockResolvedValue(users);

                const result = await service.findAllUsers(mockData.user.organizationId, mockData.user.id);

                expect(result).toEqual(users);
                expect(repository.find).toHaveBeenCalled();
            });

            it('finds one user by id', async () => {
                repository.findOne.mockResolvedValue(mockData.user);

                const result = await service.findOneUser(mockData.user.id, mockData.user.id);

                expect(result).toEqual(mockData.user);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { id: mockData.user.id },
                    relations: expect.any(Array)
                });
            });

            it('finds user by username', async () => {
                repository.findOne.mockResolvedValue(mockData.user);

                const result = await service.findByUsername(mockData.user.username, mockData.user.id);

                expect(result).toEqual(mockData.user);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { username: mockData.user.username },
                    relations: expect.any(Array)
                });
            });
        });

        describe('write operations', () => {
            it('creates user', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(null);          // username uniqueness

                repository.create.mockReturnValue(mockData.user);
                repository.save.mockResolvedValue(mockData.user);

                const result = await service.createUser(mockData.createDto, mockData.user.id);

                expect(result).toEqual(mockData.user);
                expect(repository.save).toHaveBeenCalled();
            });

            it('updates user', async () => {
                const updatedUser = { ...mockData.user, ...mockData.updateDto };
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user)  // validateExists
                    .mockResolvedValueOnce(null);          // username uniqueness

                repository.save.mockResolvedValue(updatedUser);

                const result = await service.updateUser(mockData.user.id, mockData.updateDto, mockData.user.id);

                expect(result).toEqual(updatedUser);
                expect(repository.save).toHaveBeenCalled();
            });

            it('removes user', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user); // validateExists

                repository.remove.mockResolvedValue(mockData.user);

                const result = await service.removeUser(mockData.user.id, mockData.user.id);

                expect(result).toBe(true);
                expect(repository.remove).toHaveBeenCalledWith(mockData.user);
            });
        });
    });

    describe('error handling', () => {
        describe('not found errors', () => {
            it('handles user not found in findOne', async () => {
                repository.findOne.mockResolvedValue(null);

                await expect(service.findOneUser('nonexistent-id', mockData.user.id))
                    .rejects.toThrow(NotFoundException);
            });

            it('handles user not found in update', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(null);          // validateExists

                await expect(service.updateUser('nonexistent-id', mockData.updateDto, mockData.user.id))
                    .rejects.toThrow(NotFoundException);
            });

            it('handles user not found in remove', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(null);          // validateExists

                await expect(service.removeUser('nonexistent-id', mockData.user.id))
                    .rejects.toThrow(NotFoundException);
            });
        });

        describe('conflict errors', () => {
            it('handles duplicate username in create', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user); // username exists

                await expect(service.createUser(mockData.createDto, mockData.user.id))
                    .rejects.toThrow(ConflictException);
            });

            it('handles duplicate username in update', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user)  // validateExists
                    .mockResolvedValueOnce(mockData.user); // username exists

                await expect(service.updateUser(mockData.user.id, mockData.updateDto, mockData.user.id))
                    .rejects.toThrow(ConflictException);
            });
        });

        describe('authorization errors', () => {
            it('handles unauthorized access in create', async () => {
                await expect(service.createUser(mockData.createDto, undefined as unknown as string))
                    .rejects.toThrow(UnauthorizedException);
            });

            it('handles unauthorized access in update', async () => {
                await expect(service.updateUser(mockData.user.id, mockData.updateDto, undefined as unknown as string))
                    .rejects.toThrow(UnauthorizedException);
            });

            it('handles unauthorized access in remove', async () => {
                await expect(service.removeUser(mockData.user.id, undefined as unknown as string))
                    .rejects.toThrow(UnauthorizedException);
            });
        });
    });

    describe('transaction management', () => {
        describe('write operations', () => {
            it('commits successful create', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(null);          // username uniqueness

                repository.create.mockReturnValue(mockData.user);
                repository.save.mockResolvedValue(mockData.user);

                await service.createUser(mockData.createDto, mockData.user.id);

                expect(repository.save).toHaveBeenCalled();
            });

            it('commits successful update', async () => {
                const updatedUser = { ...mockData.user, ...mockData.updateDto };
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user)  // validateExists
                    .mockResolvedValueOnce(null);          // username uniqueness

                repository.save.mockResolvedValue(updatedUser);

                await service.updateUser(mockData.user.id, mockData.updateDto, mockData.user.id);

                expect(repository.save).toHaveBeenCalled();
            });

            it('commits successful remove', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user); // validateExists

                repository.remove.mockResolvedValue(mockData.user);

                await service.removeUser(mockData.user.id, mockData.user.id);

                expect(repository.remove).toHaveBeenCalled();
            });
        });

        describe('rollback scenarios', () => {
            it('rolls back failed create', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(null);          // username uniqueness

                repository.create.mockReturnValue(mockData.user);
                repository.save.mockRejectedValue(new Error('DB Error'));

                await expect(service.createUser(mockData.createDto, mockData.user.id))
                    .rejects.toThrow('DB Error');
            });

            it('rolls back failed update', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user)  // validateExists
                    .mockResolvedValueOnce(null);          // username uniqueness

                repository.save.mockRejectedValue(new Error('DB Error'));

                await expect(service.updateUser(mockData.user.id, mockData.updateDto, mockData.user.id))
                    .rejects.toThrow('DB Error');
            });

            it('rolls back failed remove', async () => {
                repository.findOne
                    .mockResolvedValueOnce(mockData.user)  // validateAccess
                    .mockResolvedValueOnce(mockData.user); // validateExists

                repository.remove.mockRejectedValue(new Error('DB Error'));

                await expect(service.removeUser(mockData.user.id, mockData.user.id))
                    .rejects.toThrow('DB Error');
            });
        });
    });
}); 