import { bcryptMock } from '../test/__mocks__/bcrypt.mock';
jest.mock('bcrypt', () => bcryptMock);

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LoginCredentialService } from './LoginCredentialService';
import { LoginCredential } from '../models/LoginCredential';
import { mockRepository, mockDataSource } from '../test/setup';
import { 
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdatePasswordCredentialDto,
    UpdateOAuthCredentialDto,
    ResponseLoginCredentialDto,
    CredentialType,
    OAuthProvider
} from '@my-app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { auth as authMock } from '../test/__mocks__/auth.mock';
import { TestDataFactory } from '../test/factories/test-data.factory';

describe('LoginCredentialService', () => {
    let service: LoginCredentialService;
    let repository: Repository<LoginCredential>;
    let dataSource: DataSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginCredentialService,
                {
                    provide: getRepositoryToken(LoginCredential),
                    useFactory: mockRepository
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                },
            ],
        }).compile();

        service = module.get<LoginCredentialService>(LoginCredentialService);
        repository = module.get<Repository<LoginCredential>>(getRepositoryToken(LoginCredential));
        dataSource = module.get<DataSource>(DataSource);
    });

    describe('Service Setup', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
            expect(repository).toBeDefined();
        });
    });

    describe('Query Methods', () => {
        describe('findAll', () => {
            it('should return all login credentials with relations', async () => {
                const credentials = [
                    TestDataFactory.createCredential('password'),
                    TestDataFactory.createCredential('google')
                ];
                jest.spyOn(repository, 'find').mockResolvedValue(credentials);

                const result = await service.findAll();
                
                expect(result).toHaveLength(2);
                expect(repository.find).toHaveBeenCalledWith({
                    relations: ['loginProvider', 'baseUser']
                });
            });
        });

        describe('findOne', () => {
            it('should return a credential by id with relations', async () => {
                const mockCred = TestDataFactory.createCredential('password');
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);

                const result = await service.findOne(mockCred.id);
                
                expect(result).toBeDefined();
                expect(result?.id).toBe(mockCred.id);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { id: mockCred.id },
                    relations: ['loginProvider', 'baseUser']
                });
            });

            it('should return null for non-existent credential', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);
                const result = await service.findOne('nonexistent-id');
                expect(result).toBeNull();
            });
        });

        describe('findByIdentifierAndProvider', () => {
            it('should find credential by identifier and provider', async () => {
                const mockCred = TestDataFactory.createCredential('password');
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);

                const result = await service.findByIdentifierAndProvider(
                    mockCred.identifier,
                    mockCred.loginProviderId
                );

                expect(result).toBeDefined();
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { 
                        identifier: mockCred.identifier,
                        loginProviderId: mockCred.loginProviderId
                    },
                    relations: ['loginProvider', 'baseUser']
                });
            });

            it('should return null when no credential is found', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);
                const result = await service.findByIdentifierAndProvider('test@example.com', 'provider-id');
                expect(result).toBeNull();
            });
        });
    });

    describe('Password Credentials', () => {
        describe('createPasswordCredential', () => {
            it('should create password credential', async () => {
                const createDto = TestDataFactory.createCredentialDto<CreatePasswordCredentialDto>('password', 'create');
                const mockCred = TestDataFactory.createCredential('password');
                
                const queryRunner = dataSource.createQueryRunner();
                jest.spyOn(repository, 'create').mockReturnValue(mockCred);
                jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(mockCred);

                const result = await service.createPasswordCredential(createDto);

                expect(result).toBeDefined();
                expect(bcryptMock.hash).toHaveBeenCalledWith(createDto.password, 10);
            });

            it('should throw if password is missing', async () => {
                const createDto = TestDataFactory.createCredentialDto<CreatePasswordCredentialDto>('password', 'create');
                delete (createDto as any).password;

                await expect(service.createPasswordCredential(createDto))
                    .rejects
                    .toThrow(BadRequestException);
            });

            it('should throw if credential type is incorrect', async () => {
                const createDto = TestDataFactory.createCredentialDto<CreatePasswordCredentialDto>('password', 'create');
                createDto.credentialType = CredentialType.OAUTH;

                await expect(service.createPasswordCredential(createDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });

        describe('validatePassword', () => {
            it('should validate correct password', async () => {
                const mockCred = TestDataFactory.createCredential('password');
                const isValid = await service.validatePassword(mockCred, 'password123');
                expect(isValid).toBe(true);
                expect(bcryptMock.compare).toHaveBeenCalledWith('password123', mockCred.passwordHash);
            });

            it('should reject if no password hash exists', async () => {
                const credWithoutHash = TestDataFactory.createCredential('password');
                delete credWithoutHash.passwordHash;
                
                const isValid = await service.validatePassword(credWithoutHash, 'password123');
                expect(isValid).toBe(false);
                expect(bcryptMock.compare).not.toHaveBeenCalled();
            });
        });

        describe('updatePassword', () => {
            it('should update password when current password is valid', async () => {
                const mockCred = TestDataFactory.createCredential('password');
                const updateDto: UpdatePasswordCredentialDto = {
                    currentPassword: 'oldpass',
                    newPassword: 'newpass'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                bcryptMock.compare.mockResolvedValue(true);

                const result = await service.updatePassword(mockCred.id, updateDto);

                expect(result).toBeDefined();
                expect(bcryptMock.compare).toHaveBeenCalledWith('oldpass', mockCred.passwordHash);
                expect(bcryptMock.hash).toHaveBeenCalledWith('newpass', 10);
            });

            it('should throw if current password is incorrect', async () => {
                const mockCred = TestDataFactory.createCredential('password');
                const updateDto: UpdatePasswordCredentialDto = {
                    currentPassword: 'wrongpass',
                    newPassword: 'newpass'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                bcryptMock.compare.mockResolvedValue(false);

                await expect(service.updatePassword(mockCred.id, updateDto))
                    .rejects
                    .toThrow(UnauthorizedException);
            });

            it('should allow updating enabled status without password change', async () => {
                const mockCred = TestDataFactory.createCredential('password');
                const updateDto: UpdatePasswordCredentialDto = {
                    isEnabled: false
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                const result = await service.updatePassword(mockCred.id, updateDto);

                expect(result).toBeDefined();
                expect(bcryptMock.hash).not.toHaveBeenCalled();
            });
        });
    });

    describe('OAuth Credentials', () => {
        describe('createOAuthCredential', () => {
            it('should create OAuth credential', async () => {
                const createDto = TestDataFactory.createCredentialDto<CreateOAuthCredentialDto>('google', 'create');
                const mockCred = TestDataFactory.createCredential('google');
                
                const queryRunner = dataSource.createQueryRunner();
                jest.spyOn(repository, 'create').mockReturnValue(mockCred);
                jest.spyOn(queryRunner.manager, 'save').mockResolvedValue(mockCred);

                const result = await service.createOAuthCredential(createDto);

                expect(result).toBeDefined();
            });

            it('should throw if provider is missing', async () => {
                const createDto = TestDataFactory.createCredentialDto<CreateOAuthCredentialDto>('google', 'create');
                delete (createDto as any).provider;

                await expect(service.createOAuthCredential(createDto))
                    .rejects
                    .toThrow(BadRequestException);
            });

            it('should throw if access token is missing', async () => {
                const createDto = TestDataFactory.createCredentialDto<CreateOAuthCredentialDto>('google', 'create');
                delete (createDto as any).accessToken;

                await expect(service.createOAuthCredential(createDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });

        describe('updateOAuthCredential', () => {
            it('should update OAuth credential', async () => {
                const mockCred = TestDataFactory.createCredential('google');
                const updateDto: UpdateOAuthCredentialDto = {
                    accessToken: 'new-token',
                    accessTokenExpiresAt: new Date()
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                const result = await service.updateOAuthCredential(mockCred.id, updateDto);

                expect(result).toBeDefined();
            });

            it('should throw if trying to change provider type', async () => {
                const mockCred = TestDataFactory.createCredential('google');
                const updateDto: UpdateOAuthCredentialDto = {
                    provider: OAuthProvider.APPLE
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);

                await expect(service.updateOAuthCredential(mockCred.id, updateDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });
    });

    describe('Remove Credential', () => {
        it('should remove non-primary credential', async () => {
            const mockCred = TestDataFactory.createCredential('password');
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null)
            } as any);

            await service.removeLoginCredential(mockCred.id);
            expect(repository.createQueryBuilder).toHaveBeenCalled();
        });

        it('should throw when trying to remove primary credential', async () => {
            const mockCred = TestDataFactory.createCredential('password');
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
                innerJoin: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(mockCred)
            } as any);

            await expect(service.removeLoginCredential(mockCred.id))
                .rejects
                .toThrow(BadRequestException);
        });
    });
}); 
