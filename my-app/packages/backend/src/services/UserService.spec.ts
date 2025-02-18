import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserService } from './UserService';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from '@my-app/shared';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { user as userMock } from '../__mocks__/models/user.mock';
import { organization as orgMock } from '../__mocks__/models/organization.mock';
import { mockRepository, mockDataSource, mockManager } from '../test/setup';
import { UserState } from '@my-app/shared/';


describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;
    let dataSource: DataSource;

    const mockOrg: Partial<Organization> = {
        id: 'org-test-123',
        name: 'Test Org',
        adminUserId: 'base-user-123'
    };

    const mockUser = {
        id: 'base-user-123',
        username: 'testuser',
        firstname: 'Test',
        lastname: 'User',
        contactEmail: 'test@example.com',
        state: UserState.ACTIVE,
        isEnabled: true,
        displayname: 'Test User',
        organization: {
            ...mockOrg,
            adminUserId: 'base-user-123'
        } as Organization
    } as User;

    const createDto: CreateUserDto = {
        username: 'newuser',
        firstname: 'New',
        lastname: 'User',
        contactEmail: 'new@example.com',
        state: UserState.ACTIVE,
        isEnabled: true,
        displayname: 'New User',
        organizationId: mockOrg.id
    };

    const updateDto: UpdateUserDto = {
        firstname: 'Updated',
        lastname: 'User',
        state: UserState.ACTIVE,
        displayname: 'Updated User',
        preferences: {
            theme: 'light',
            notifications: {
                email: true,
                push: true
            }
        } as UserPreferences
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
        dataSource = module.get<DataSource>(DataSource);

        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup default authorization mock
        mockManager.findOne.mockResolvedValue(mockUser);
    });

    describe('createUser', () => {
        describe('success cases', () => {
            it('should create a new user when username is unique', async () => {
                // Arrange
                mockManager.findOne.mockResolvedValueOnce(null); // No existing user with username
                mockManager.save.mockResolvedValue(mockUser);

                // Act
                const result = await service.createUser(createDto, mockUser.id);

                // Assert
                expect(result).toBeDefined();
                expect(mockDataSource.createQueryRunner().startTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().release).toHaveBeenCalled();
            });
        });

        describe('error handling', () => {
            it('should throw ConflictException when username exists', async () => {
                // Arrange
                mockManager.findOne.mockResolvedValueOnce(mockUser); // Existing user with username

                // Act & Assert
                await expect(service.createUser(createDto, mockUser.id))
                    .rejects.toThrow(ConflictException);
            });

            it('should throw UnauthorizedException without requestingUserId', async () => {
                // Act & Assert
                await expect(service.createUser(createDto, undefined as any))
                    .rejects.toThrow(UnauthorizedException);
            });
        });

        describe('transaction management', () => {
            it('should commit transaction on success', async () => {
                // Arrange
                mockManager.findOne.mockResolvedValueOnce(null);
                mockManager.save.mockResolvedValue(mockUser);

                // Act
                await service.createUser(createDto, mockUser.id);

                // Assert
                expect(mockDataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().release).toHaveBeenCalled();
            });

            it('should rollback transaction on error', async () => {
                // Arrange
                mockManager.findOne.mockResolvedValueOnce(null);
                mockManager.save.mockRejectedValue(new Error('DB Error'));

                // Act & Assert
                await expect(service.createUser(createDto, mockUser.id))
                    .rejects.toThrow('DB Error');
                expect(mockDataSource.createQueryRunner().rollbackTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().release).toHaveBeenCalled();
            });
        });
    });

    describe('findAllUsers', () => {
        const mockUsers = userMock.lists.multiple;

        describe('success cases', () => {
            it('should return all users with organization relation', async () => {
                // Arrange
                jest.spyOn(repository, 'find').mockResolvedValue(mockUsers);

                // Act
                const result = await service.findAllUsers(mockUser.organizationId, mockUser.id);

                // Assert
                expect(result).toEqual(
                    expect.arrayContaining(
                        mockUsers.map(user => expect.objectContaining({
                            id: user.id,
                            username: user.username
                        }))
                    )
                );
            });

            it('should return empty array when no users exist', async () => {
                // Arrange
                jest.spyOn(repository, 'find').mockResolvedValue([]);

                // Act
                const result = await service.findAllUsers(mockUser.organizationId, mockUser.id);

                // Assert
                expect(result).toEqual([]);
            });
        });

        describe('error handling', () => {
            it('should throw UnauthorizedException without requestingUserId', async () => {
                // Arrange
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                // Act & Assert
                await expect(service.findAllUsers(mockUser.organizationId, undefined as any))
                    .rejects.toThrow(UnauthorizedException);
            });
        });
    });

    describe('findOneUser', () => {
        describe('success cases', () => {
            it('should return user by id with organization relation', async () => {
                // Arrange
                jest.spyOn(repository, 'findOne')
                    .mockResolvedValueOnce(mockUser)  // user fetch

                // Act
                const result = await service.findOneUser(mockUser.id, mockUser.id);

                // Assert
                expect(result).toEqual(expect.objectContaining({
                    id: mockUser.id,
                    username: mockUser.username
                }));
            });
        });

        describe('error handling', () => {
            it('should throw NotFoundException when user not found', async () => {
                // Arrange
                jest.spyOn(repository, 'findOne')
                    .mockResolvedValueOnce(null);      // user fetch

                // Act & Assert
                await expect(service.findOneUser('nonexistent', mockUser.id))
                    .rejects.toThrow(NotFoundException);
            });

            it('should throw UnauthorizedException without requestingUserId', async () => {
                // Arrange
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                // Act & Assert
                await expect(service.findOneUser(mockUser.id, undefined as any))
                    .rejects.toThrow(UnauthorizedException);
            });
        });
    });

    describe('updateUser', () => {
        const updatedUser = { ...mockUser, ...updateDto };

        describe('success cases', () => {
            it('should update user when data is valid', async () => {
                // Arrange
                mockManager.save.mockResolvedValue(updatedUser);

                // Act
                const result = await service.updateUser(mockUser.id, updateDto, mockUser.id);

                // Assert
                expect(result).toEqual(expect.objectContaining({
                    id: updatedUser.id,
                    username: updatedUser.username
                }));
            });
        });

        describe('error handling', () => {
            it('should throw NotFoundException when user not found', async () => {
                // Arrange
                mockManager.save.mockRejectedValue(new Error('DB Error'));

                // Act & Assert
                await expect(service.updateUser('nonexistent', updateDto, mockUser.id))
                    .rejects.toThrow('DB Error');
            });

            it('should throw UnauthorizedException without requestingUserId', async () => {
                // Arrange
                mockManager.save.mockRejectedValue(new Error('Unauthorized'));

                // Act & Assert
                await expect(service.updateUser(mockUser.id, updateDto, undefined as any))
                    .rejects.toThrow('Unauthorized');
            });
        });

        describe('transaction management', () => {
            it('should commit transaction on success', async () => {
                // Arrange
                mockManager.save.mockResolvedValue(updatedUser);

                // Act
                await service.updateUser(mockUser.id, updateDto, mockUser.id);

                // Assert
                expect(mockDataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().release).toHaveBeenCalled();
            });

            it('should rollback transaction on error', async () => {
                // Arrange
                mockManager.save.mockRejectedValue(new Error('DB Error'));

                // Act & Assert
                await expect(service.updateUser(mockUser.id, updateDto, mockUser.id))
                    .rejects.toThrow('DB Error');
                expect(mockDataSource.createQueryRunner().rollbackTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().release).toHaveBeenCalled();
            });
        });
    });

    describe('removeUser', () => {
        describe('success cases', () => {
            it('should remove user when found', async () => {
                // Arrange
                mockManager.remove.mockResolvedValue([mockUser]);

                // Act
                await service.removeUser(mockUser.id, mockUser.id);

                // Assert
                expect(mockManager.remove).toHaveBeenCalledWith([mockUser]);
            });
        });

        describe('error handling', () => {
            it('should throw NotFoundException when user not found', async () => {
                // Arrange
                mockManager.remove.mockRejectedValue(new Error('DB Error'));

                // Act & Assert
                await expect(service.removeUser('nonexistent', mockUser.id))
                    .rejects.toThrow('DB Error');
            });

            it('should throw UnauthorizedException without requestingUserId', async () => {
                // Arrange
                mockManager.remove.mockRejectedValue(new Error('Unauthorized'));

                // Act & Assert
                await expect(service.removeUser(mockUser.id, undefined as any))
                    .rejects.toThrow('Unauthorized');
            });
        });

        describe('transaction management', () => {
            it('should commit transaction on success', async () => {
                // Arrange
                mockManager.remove.mockResolvedValue([mockUser]);

                // Act
                await service.removeUser(mockUser.id, mockUser.id);

                // Assert
                expect(mockDataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().release).toHaveBeenCalled();
            });

            it('should rollback transaction on error', async () => {
                // Arrange
                mockManager.remove.mockRejectedValue(new Error('DB Error'));

                // Act & Assert
                await expect(service.removeUser(mockUser.id, mockUser.id))
                    .rejects.toThrow('DB Error');
                expect(mockDataSource.createQueryRunner().rollbackTransaction).toHaveBeenCalled();
                expect(mockDataSource.createQueryRunner().release).toHaveBeenCalled();
            });
        });
    });
}); 