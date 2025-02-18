import { BaseUser } from '../models/BaseUser';
import { BaseUserService } from './BaseUserService';
import { BaseServiceTest, MockRepository, MockDataSource, SecurityContext, BaseTestEntity } from '../models/test/base/BaseServiceTest';
import { CreateBaseUserDto, ResponseBaseUserDto, UpdateBaseUserDto } from '@my-app/shared';
import { UserState, CredentialType } from '@my-app/shared';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { user as userMock } from '../models/test/__mocks__/user.mock';
import { OperationType, OperationResult } from '../constants/service-operations';
import { Repository, DataSource } from 'typeorm';
import { LoginCredential } from '../models/LoginCredential';
import { jest } from '@jest/globals';

// Test entity implementations
class TestBaseUser extends BaseUser implements BaseTestEntity {
    hasId(): boolean {
        return !!this.id;
    }

    async save(): Promise<this> {
        return this;
    }

    async remove(): Promise<this> {
        return this;
    }

    async softRemove(): Promise<this> {
        return this;
    }

    async recover(): Promise<this> {
        return this;
    }

    async reload(): Promise<void> {
        // No-op for tests
    }
}

class TestLoginCredential extends LoginCredential implements BaseTestEntity {
    hasId(): boolean {
        return !!this.id;
    }

    async save(): Promise<this> {
        return this;
    }

    async remove(): Promise<this> {
        return this;
    }

    async softRemove(): Promise<this> {
        return this;
    }

    async recover(): Promise<this> {
        return this;
    }

    async reload(): Promise<void> {
        // No-op for tests
    }
}

class TestHarness extends BaseServiceTest<TestBaseUser> {
    public service: BaseUserService;

    public async setupService(): Promise<void> {
        this.service = new BaseUserService(
            this.mockRepository as unknown as Repository<BaseUser>,
            this.mockDataSource as unknown as DataSource
        );

        // Set up service logger using Object.defineProperty
        Object.defineProperty(this.service, 'serviceLogger', {
            value: this.mockLogger,
            writable: true,
            configurable: true
        });
    }

    public createTestUser(overrides: Partial<TestBaseUser> = {}): TestBaseUser {
        const user = new TestBaseUser();
        Object.assign(user, {
            ...userMock.baseUserDtos.response,
            ...overrides
        });
        return user;
    }

    public createTestCredential(mockData: Partial<LoginCredential> = {}): TestLoginCredential {
        const credential = new TestLoginCredential();
        Object.assign(credential, {
            id: 'test-cred-123',
            identifier: 'test@example.com',
            credentialType: CredentialType.PASSWORD,
            isEnabled: true,
            ...mockData
        });
        return credential;
    }
}

// Test suite
describe('BaseUserService', () => {
    let testHarness: TestHarness;

    beforeEach(async () => {
        testHarness = new TestHarness();
        await testHarness.setupStandardMocks();

        // Setup transaction manager
        Object.defineProperty(testHarness.mockRepository, 'manager', {
            value: {
                connection: {
                    createQueryRunner: jest.fn().mockReturnValue(testHarness.mockQueryRunner)
                }
            },
            writable: true,
            configurable: true
        });

        // Setup query runner mocks
        testHarness.mockQueryRunner.startTransaction = jest.fn();
        testHarness.mockQueryRunner.commitTransaction = jest.fn();
        testHarness.mockQueryRunner.rollbackTransaction = jest.fn();
        testHarness.mockQueryRunner.release = jest.fn();

        await testHarness.setupService();
    });

    // Success Cases
    describe('findAllBaseUsers', () => {
        describe('success cases', () => {
            it('should return all base users when authorized', async () => {
                // Arrange
                testHarness.mockRepository.find.mockResolvedValue([]);
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

                // Act
                await testHarness.service.findAllBaseUsers('admin-123');

                // Assert
                expect(testHarness.mockRepository.find).toHaveBeenCalled();
            });
        });

        describe('access control', () => {
            it('should throw UnauthorizedException when not authorized', async () => {
                // Arrange
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(false);

                // Act & Assert
                await expect(testHarness.service.findAllBaseUsers('user-123'))
                    .rejects
                    .toThrow(UnauthorizedException);
            });
        });

        describe('audit logging', () => {
            it('should log successful operation', async () => {
                // Arrange
                const users = [testHarness.createTestUser()];
                testHarness.mockRepository.find.mockResolvedValue(users);

                // Act
                await testHarness.service.findAllBaseUsers('user-id');

                // Assert
                expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                    OperationType.USER,
                    'findAllBaseUsers',
                    OperationResult.SUCCESS,
                    expect.any(Object)
                );
            });
        });
    });

    describe('findOneBaseUser', () => {
        const userId = 'test-id';

        describe('success cases', () => {
            it('should return user when found and authorized', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

                // Act
                const result = await testHarness.service.findOneBaseUser(userId, 'requesting-user-id');

                // Assert
                expect(result).toBeInstanceOf(ResponseBaseUserDto);
                expect(testHarness.mockRepository.findOne).toHaveBeenCalledWith({
                    where: { id: userId },
                    relations: ['loginCredentials']
                });
            });
        });

        describe('error handling', () => {
            it('should handle database errors gracefully', async () => {
                // Arrange
                testHarness.mockRepository.findOne.mockRejectedValue(new Error('Database error'));

                // Act & Assert
                await expect(testHarness.service.findOneBaseUser(userId, 'requester-123'))
                    .rejects
                    .toThrow('Database error');
            });

            it('should throw NotFoundException when user not found', async () => {
                // Arrange
                testHarness.mockRepository.findOne.mockResolvedValue(null);

                // Act & Assert
                await expect(testHarness.service.findOneBaseUser(userId, 'requester-123'))
                    .rejects
                    .toThrow(NotFoundException);
            });
        });

        describe('audit logging', () => {
            it('should log successful operation', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);

                // Act
                await testHarness.service.findOneBaseUser(userId, 'requesting-user-id');

                // Assert
                expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                    OperationType.USER,
                    'findOneBaseUser',
                    OperationResult.SUCCESS,
                    expect.any(Object)
                );
            });
        });
    });

    describe('createBaseUser', () => {
        const createDto: CreateBaseUserDto = {
            firstname: 'John',
            lastname: 'Doe',
            contactEmail: 'john@example.com',
            state: UserState.PENDING,
            isEnabled: true
        };

        describe('success cases', () => {
            it('should create user when data is valid', async () => {
                // Arrange
                const savedUser = testHarness.createTestUser();
                testHarness.mockRepository.create.mockReturnValue(savedUser);
                testHarness.mockRepository.save.mockResolvedValue(savedUser);
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

                // Act
                const result = await testHarness.service.createBaseUser(createDto, 'admin-id');

                // Assert
                expect(result).toBeInstanceOf(ResponseBaseUserDto);
                expect(result.state).toBe(UserState.PENDING);
                expect(testHarness.mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                    firstname: createDto.firstname,
                    lastname: createDto.lastname,
                    contactEmail: createDto.contactEmail
                }));
            });
        });

        describe('validation', () => {
            it('should validate required fields', async () => {
                // Arrange
                const invalidDto = { ...createDto, firstname: '' };

                // Act & Assert
                await expect(testHarness.service.createBaseUser(invalidDto, 'admin-id'))
                    .rejects
                    .toThrow(BadRequestException);
            });

            it('should validate email format', async () => {
                // Arrange
                const invalidDto = { ...createDto, contactEmail: 'invalid-email' };

                // Act & Assert
                await expect(testHarness.service.createBaseUser(invalidDto, 'admin-id'))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });

        describe('transaction management', () => {
            it('should handle transaction rollback on error', async () => {
                // Arrange
                testHarness.mockRepository.save.mockRejectedValue(new Error('Save failed'));

                // Act & Assert
                await expect(testHarness.service.createBaseUser(createDto, 'admin-id'))
                    .rejects
                    .toThrow('Save failed');

                expect(testHarness.mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
                expect(testHarness.mockQueryRunner.release).toHaveBeenCalled();
            });
        });

        describe('access control', () => {
            it('should validate admin access', async () => {
                // Arrange
                testHarness.mockSecurityContext.validateAccess.mockRejectedValue(
                    new UnauthorizedException()
                );

                // Act & Assert
                await expect(testHarness.service.createBaseUser(createDto, 'non-admin-id'))
                    .rejects
                    .toThrow(UnauthorizedException);
            });
        });

        describe('audit logging', () => {
            it('should log successful operation', async () => {
                // Arrange
                const savedUser = testHarness.createTestUser();
                testHarness.mockRepository.create.mockReturnValue(savedUser);
                testHarness.mockRepository.save.mockResolvedValue(savedUser);

                // Act
                await testHarness.service.createBaseUser(createDto, 'admin-id');

                // Assert
                expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                    OperationType.USER,
                    'createBaseUser',
                    OperationResult.SUCCESS,
                    expect.any(Object)
                );
            });
        });
    });

    describe('updateBaseUser', () => {
        const userId = 'test-id';
        const updateDto: UpdateBaseUserDto = {
            firstname: 'Updated',
            lastname: 'Name'
        };

        describe('success cases', () => {
            it('should update user when authorized', async () => {
                // Arrange
                const existingUser = testHarness.createTestUser();
                const updatedUser = testHarness.createTestUser(updateDto);
                testHarness.mockRepository.findOne.mockResolvedValue(existingUser);
                testHarness.mockRepository.save.mockResolvedValue(updatedUser);
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

                // Act
                const result = await testHarness.service.updateBaseUser(userId, updateDto, 'admin-id');

                // Assert
                expect(result).toBeInstanceOf(ResponseBaseUserDto);
                expect(testHarness.mockRepository.save).toHaveBeenCalledWith(
                    expect.objectContaining({
                        firstname: updateDto.firstname,
                        lastname: updateDto.lastname
                    })
                );
            });
        });

        describe('validation', () => {
            it('should validate required fields', async () => {
                // Arrange
                const invalidDto = { ...updateDto, firstname: '' };

                // Act & Assert
                await expect(testHarness.service.updateBaseUser(userId, invalidDto, 'admin-id'))
                    .rejects
                    .toThrow(BadRequestException);
            });

            it('should validate email format', async () => {
                // Arrange
                const invalidDto = { ...updateDto, contactEmail: 'invalid-email' };

                // Act & Assert
                await expect(testHarness.service.updateBaseUser(userId, invalidDto, 'admin-id'))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });

        describe('transaction management', () => {
            it('should use transaction for state changes', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockRepository.save.mockResolvedValue(user);

                // Act
                await testHarness.service.updateBaseUser(userId, { state: UserState.ACTIVE }, 'admin-id');

                // Assert
                expect(testHarness.mockQueryRunner.startTransaction).toHaveBeenCalled();
                expect(testHarness.mockQueryRunner.commitTransaction).toHaveBeenCalled();
            });

            it('should not use transaction for non-state updates', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockRepository.save.mockResolvedValue(user);

                // Act
                await testHarness.service.updateBaseUser(userId, { firstname: 'Updated' }, 'admin-id');

                // Assert
                expect(testHarness.mockQueryRunner.startTransaction).not.toHaveBeenCalled();
            });
        });

        describe('access control', () => {
            it('should require admin access for state changes', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                
                // Act
                await testHarness.service.updateBaseUser(userId, { state: UserState.ACTIVE }, 'user-id');
                
                // Assert
                expect(testHarness.mockSecurityContext.validateAccess).toHaveBeenCalledWith(
                    OperationType.ADMIN,
                    'admin-id'
                );
            });

            it('should allow user access for non-state updates', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                
                // Act
                await testHarness.service.updateBaseUser(userId, { firstname: 'Updated' }, 'user-id');
                
                // Assert
                expect(testHarness.mockSecurityContext.validateAccess).toHaveBeenCalledWith(
                    OperationType.USER,
                    'user-id'
                );
            });
        });

        describe('audit logging', () => {
            it('should log state changes', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                const updatedUser = testHarness.createTestUser(updateDto);
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockRepository.save.mockResolvedValue(updatedUser);
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

                // Act
                await testHarness.service.updateBaseUser(userId, updateDto, 'admin-123');

                // Assert
                expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                    OperationType.USER,
                    'updateBaseUser',
                    OperationResult.SUCCESS,
                    expect.any(Object)
                );
            });

            it('should log validation failures', async () => {
                // Arrange
                const user = testHarness.createTestUser({ state: UserState.DEACTIVATED });
                testHarness.mockRepository.findOne.mockResolvedValue(user);

                // Act
                try {
                    await testHarness.service.updateBaseUser(userId, { state: UserState.ACTIVE }, 'admin-123');
                } catch {
                    // Assert
                    expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                        OperationType.ADMIN,
                        'updateBaseUser',
                        OperationResult.FAILURE,
                        expect.objectContaining({
                            error: expect.any(BadRequestException)
                        })
                    );
                }
            });
        });
    });

    describe('softDeleteBaseUser', () => {
        it('should soft delete user when admin and no active credentials', async () => {
            // Arrange
            const disabledCredential = testHarness.createTestCredential({ isEnabled: false });
            const user = testHarness.createTestUser({
                loginCredentials: [disabledCredential]
            });
            
            testHarness.mockRepository.findOne.mockResolvedValue(user);
            testHarness.mockRepository.save.mockResolvedValue(user);
            testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

            // Act
            await testHarness.service.softDeleteBaseUser('user-id', 'admin-id');

            // Assert
            expect(testHarness.mockRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ deleted: true })
            );
        });
    });

    // Access Control
    describe('access control', () => {
        describe('findAllBaseUsers', () => {
            it('should validate user access', async () => {
                // Arrange
                const requestingUserId = 'user-123';
                
                // Act
                await testHarness.service.findAllBaseUsers(requestingUserId);
                
                // Assert
                expect(testHarness.mockSecurityContext.validateAccess).toHaveBeenCalledWith(
                    OperationType.USER,
                    requestingUserId
                );
            });

            it('should throw UnauthorizedException when access denied', async () => {
                // Arrange
                testHarness.mockSecurityContext.validateAccess.mockRejectedValue(
                    new UnauthorizedException('Access denied')
                );

                // Act & Assert
                await expect(testHarness.service.findAllBaseUsers('user-123'))
                    .rejects
                    .toThrow(UnauthorizedException);
            });
        });

        describe('updateBaseUser', () => {
            it('should require admin access for state changes', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                
                // Act
                await testHarness.service.updateBaseUser(
                    'user-123',
                    { state: UserState.ACTIVE },
                    'admin-123'
                );
                
                // Assert
                expect(testHarness.mockSecurityContext.validateAccess).toHaveBeenCalledWith(
                    OperationType.ADMIN,
                    'admin-123'
                );
            });

            it('should allow user access for non-state updates', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                
                // Act
                await testHarness.service.updateBaseUser(
                    'user-123',
                    { firstname: 'Updated' },
                    'user-123'
                );
                
                // Assert
                expect(testHarness.mockSecurityContext.validateAccess).toHaveBeenCalledWith(
                    OperationType.USER,
                    'user-123'
                );
            });
        });

        describe('softDeleteBaseUser', () => {
            it('should require admin access', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                
                // Act & Assert
                await expect(testHarness.service.softDeleteBaseUser('user-123', 'non-admin'))
                    .rejects
                    .toThrow(UnauthorizedException);
            });
        });
    });

    // Error Handling
    describe('error handling', () => {
        describe('findOneBaseUser', () => {
            it('should handle database errors gracefully', async () => {
                // Arrange
                testHarness.mockRepository.findOne.mockRejectedValue(new Error('Database error'));

                // Act & Assert
                await expect(testHarness.service.findOneBaseUser('user-123', 'requester-123'))
                    .rejects
                    .toThrow('Database error');
            });

            it('should throw NotFoundException when user not found', async () => {
                // Arrange
                testHarness.mockRepository.findOne.mockResolvedValue(null);

                // Act & Assert
                await expect(testHarness.service.findOneBaseUser('user-123', 'requester-123'))
                    .rejects
                    .toThrow(NotFoundException);
            });
        });

        describe('updateBaseUser', () => {
            it('should validate state transitions', async () => {
                // Arrange
                const user = testHarness.createTestUser({ state: UserState.DEACTIVATED });
                testHarness.mockRepository.findOne.mockResolvedValue(user);

                // Act & Assert
                await expect(testHarness.service.updateBaseUser(
                    'user-123',
                    { state: UserState.ACTIVE },
                    'admin-123'
                )).rejects.toThrow(BadRequestException);
            });

            it('should handle concurrent update conflicts', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockRepository.save.mockRejectedValue(new Error('Concurrent update'));

                // Act & Assert
                await expect(testHarness.service.updateBaseUser(
                    'user-123',
                    { firstname: 'New' },
                    'admin-123'
                )).rejects.toThrow('Concurrent update');
            });
        });
    });

    // Transaction Management
    describe('transaction management', () => {
        describe('createBaseUser', () => {
            const createDto: CreateBaseUserDto = {
                firstname: 'John',
                lastname: 'Doe',
                contactEmail: 'john@example.com',
                state: UserState.PENDING
            };

            it('should commit transaction on successful creation', async () => {
                // Arrange
                const savedUser = testHarness.createTestUser();
                testHarness.mockRepository.create.mockReturnValue(savedUser);
                testHarness.mockRepository.save.mockResolvedValue(savedUser);

                // Act
                await testHarness.service.createBaseUser(createDto, 'admin-123');

                // Assert
                expect(testHarness.mockQueryRunner.startTransaction).toHaveBeenCalled();
                expect(testHarness.mockQueryRunner.commitTransaction).toHaveBeenCalled();
                expect(testHarness.mockQueryRunner.release).toHaveBeenCalled();
            });

            it('should rollback transaction on error', async () => {
                // Arrange
                testHarness.mockRepository.save.mockRejectedValue(new Error('Save failed'));

                // Act & Assert
                await expect(testHarness.service.createBaseUser(createDto, 'admin-123'))
                    .rejects
                    .toThrow('Save failed');

                expect(testHarness.mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
                expect(testHarness.mockQueryRunner.release).toHaveBeenCalled();
            });
        });

        describe('updateBaseUser', () => {
            it('should use transaction for state changes', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockRepository.save.mockResolvedValue(user);

                // Act
                await testHarness.service.updateBaseUser('user-123', { state: UserState.ACTIVE }, 'admin-123');

                // Assert
                expect(testHarness.mockQueryRunner.startTransaction).toHaveBeenCalled();
                expect(testHarness.mockQueryRunner.commitTransaction).toHaveBeenCalled();
            });

            it('should not use transaction for non-state updates', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockRepository.save.mockResolvedValue(user);

                // Act
                await testHarness.service.updateBaseUser('user-123', { firstname: 'Updated' }, 'user-123');

                // Assert
                expect(testHarness.mockQueryRunner.startTransaction).not.toHaveBeenCalled();
            });
        });
    });

    // Audit Logging
    describe('audit logging', () => {
        describe('findAllBaseUsers', () => {
            it('should log successful operation', async () => {
                // Arrange
                testHarness.mockRepository.find.mockResolvedValue([]);
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

                // Act
                await testHarness.service.findAllBaseUsers('admin-123');

                // Assert
                expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                    OperationType.ADMIN,
                    'findAllBaseUsers',
                    OperationResult.SUCCESS,
                    expect.any(Object)
                );
            });

            it('should log access denied', async () => {
                // Arrange
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(false);

                // Act
                try {
                    await testHarness.service.findAllBaseUsers('user-123');
                } catch {
                    // Assert
                    expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                        OperationType.ADMIN,
                        'findAllBaseUsers',
                        OperationResult.DENIED,
                        expect.objectContaining({
                            error: expect.any(UnauthorizedException)
                        })
                    );
                }
            });
        });

        describe('updateBaseUser', () => {
            it('should log state changes', async () => {
                // Arrange
                const user = testHarness.createTestUser();
                const updatedUser = testHarness.createTestUser({ state: UserState.PENDING });
                testHarness.mockRepository.findOne.mockResolvedValue(user);
                testHarness.mockRepository.save.mockResolvedValue(updatedUser);
                testHarness.mockSecurityContext.validateAccess.mockResolvedValue(true);

                // Act
                await testHarness.service.updateBaseUser('user-123', { state: UserState.ACTIVE }, 'admin-123');

                // Assert
                expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                    OperationType.USER,
                    'updateBaseUser',
                    OperationResult.SUCCESS,
                    expect.any(Object)
                );
            });

            it('should log validation failures', async () => {
                // Arrange
                const user = testHarness.createTestUser({ state: UserState.DEACTIVATED });
                testHarness.mockRepository.findOne.mockResolvedValue(user);

                // Act
                try {
                    await testHarness.service.updateBaseUser('user-123', { state: UserState.ACTIVE }, 'admin-123');
                } catch {
                    // Assert
                    expect(testHarness.mockLogger.logOperation).toHaveBeenCalledWith(
                        OperationType.ADMIN,
                        'updateBaseUser',
                        OperationResult.FAILURE,
                        expect.objectContaining({
                            error: expect.any(BadRequestException)
                        })
                    );
                }
            });
        });
    });
});