import { Test, TestingModule } from '@nestjs/testing';
import { LoginCredentialController } from './LoginCredentialController';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { LoginCredential } from '../models/LoginCredential';
import { LoginProvider } from '../models/LoginProvider';
import { BaseUser } from '../models/BaseUser';
import { 
    CreateLoginCredentialDto,
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdateLoginCredentialDto,
    UpdatePasswordCredentialDto,
    UpdateOAuthCredentialDto,
    ResponseLoginCredentialDto,
    CredentialType,
    OAuthProvider,
    UserState
} from '@my-app/shared';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { auth } from '../__mocks__/models/auth.mock';
import { user } from '../__mocks__/models/user.mock';
import { core } from '../__mocks__/models/core.mock';
import { plainToClass } from 'class-transformer';
import { DataSource } from 'typeorm';

describe('LoginCredentialController', () => {
    let controller: LoginCredentialController;
    let service: LoginCredentialService;

    const mockQueryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn()
        }
    };

    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
    };

    // Mock data setup
    const mockLoginProvider: LoginProvider = {
        id: 'provider123',
        code: 'email',
        name: 'Email Provider',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    } as LoginProvider;

    const mockBaseUser: BaseUser = {
        id: 'user123',
        firstname: 'John',
        lastname: 'Doe',
        displayname: 'John Doe',
        contactEmail: 'john@example.com',
        state: UserState.ACTIVE,
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
        loginCredentials: []
    } as BaseUser;

    // Mock DTO responses using shared mocks
    const mockPasswordCredentialResponse = plainToClass(ResponseLoginCredentialDto, {
        id: auth.credentials.password.id,
        identifier: auth.credentials.password.identifier,
        loginProviderId: auth.credentials.password.loginProviderId,
        credentialType: CredentialType.PASSWORD,
        isEnabled: true,
        hasPassword: true,
        baseUserId: auth.credentials.password.baseUserId,
        createdAt: auth.credentials.password.createdAt,
        modifiedAt: auth.credentials.password.modifiedAt,
        loginProvider: {
            id: auth.providers.email.id,
            code: auth.providers.email.code,
            name: auth.providers.email.name,
            isEnabled: auth.providers.email.isEnabled,
            createdAt: auth.providers.email.createdAt,
            modifiedAt: auth.providers.email.modifiedAt
        }
    });

    const mockGoogleCredentialResponse = plainToClass(ResponseLoginCredentialDto, {
        id: auth.credentials.google.id,
        identifier: auth.credentials.google.identifier,
        loginProviderId: auth.credentials.google.loginProviderId,
        credentialType: CredentialType.OAUTH,
        provider: OAuthProvider.GOOGLE,
        isEnabled: true,
        hasRefreshToken: true,
        baseUserId: auth.credentials.google.baseUserId,
        createdAt: auth.credentials.google.createdAt,
        modifiedAt: auth.credentials.google.modifiedAt,
        accessTokenExpiresAt: auth.credentials.google.accessTokenExpiresAt,
        refreshTokenExpiresAt: auth.credentials.google.refreshTokenExpiresAt,
        scope: auth.credentials.google.scope,
        rawProfile: auth.credentials.google.rawProfile,
        loginProvider: {
            id: auth.providers.google.id,
            code: auth.providers.google.code,
            name: auth.providers.google.name,
            isEnabled: auth.providers.google.isEnabled,
            createdAt: auth.providers.google.createdAt,
            modifiedAt: auth.providers.google.modifiedAt
        }
    });

    const mockAppleCredentialResponse = plainToClass(ResponseLoginCredentialDto, {
        id: 'cred789',
        identifier: 'apple123',
        loginProviderId: 'apple-provider-id',
        credentialType: CredentialType.OAUTH,
        provider: OAuthProvider.APPLE,
        isEnabled: true,
        hasRefreshToken: true,
        hasIdentityToken: true,
        hasAuthorizationCode: true,
        baseUserId: auth.credentials.google.baseUserId,
        createdAt: auth.credentials.google.createdAt,
        modifiedAt: auth.credentials.google.modifiedAt,
        accessTokenExpiresAt: auth.credentials.google.accessTokenExpiresAt,
        refreshTokenExpiresAt: auth.credentials.google.refreshTokenExpiresAt,
        rawProfile: { email: 'john@example.com' },
        loginProvider: {
            id: 'apple-provider-id',
            code: 'apple',
            name: 'Apple OAuth',
            isEnabled: true,
            createdAt: auth.credentials.google.createdAt,
            modifiedAt: auth.credentials.google.modifiedAt
        }
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginCredentialController],
            providers: [
                {
                    provide: LoginCredentialService,
                    useValue: {
                        createPasswordCredential: jest.fn(),
                        createOAuthCredential: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        updatePassword: jest.fn(),
                        updateOAuthCredential: jest.fn(),
                        remove: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        controller = module.get<LoginCredentialController>(LoginCredentialController);
        service = module.get<LoginCredentialService>(LoginCredentialService);

        // Reset mocks between tests
        jest.clearAllMocks();
    });

    describe('Controller Setup', () => {
        it('should be defined', () => {
            expect(controller).toBeDefined();
            expect(service).toBeDefined();
        });
    });

    describe('Query Methods', () => {
        describe('findAll', () => {
            it('should return an array of login credentials', async () => {
                const credentials = [mockPasswordCredentialResponse, mockGoogleCredentialResponse];
                jest.spyOn(service, 'findAll').mockResolvedValue(credentials);

                const result = await controller.findAll();
                
                expect(result).toEqual(credentials);
                expect(service.findAll).toHaveBeenCalled();
            });

            it('should return empty array when no credentials exist', async () => {
                jest.spyOn(service, 'findAll').mockResolvedValue([]);

                const result = await controller.findAll();

                expect(result).toEqual([]);
            });
        });

        describe('findOne', () => {
            it('should return a single login credential', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValue(mockPasswordCredentialResponse);

                const result = await controller.findOne('cred123');
                
                expect(result).toEqual(mockPasswordCredentialResponse);
                expect(service.findOne).toHaveBeenCalledWith('cred123');
            });

            it('should throw NotFoundException when credential not found', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValue(null);

                await expect(controller.findOne('nonexistent')).rejects.toThrow(
                    new NotFoundException('LoginCredential with ID nonexistent not found')
                );
            });
        });
    });

    describe('Password Credentials', () => {
        describe('create', () => {
            it('should create a password credential', async () => {
                jest.spyOn(service, 'createPasswordCredential').mockResolvedValue(mockPasswordCredentialResponse);

                const result = await controller.create({
                    identifier: 'test@example.com',
                    loginProviderId: 'provider123',
                    credentialType: CredentialType.PASSWORD,
                    password: 'password123',
                    isEnabled: true
                } as CreatePasswordCredentialDto);

                expect(result).toEqual(mockPasswordCredentialResponse);
            });

            it('should throw BadRequestException for invalid credential type', async () => {
                const invalidDto = {
                    identifier: 'test@example.com',
                    loginProviderId: 'provider123',
                    credentialType: CredentialType.OAUTH,
                    password: 'password123'
                } as CreatePasswordCredentialDto;

                await expect(controller.create(invalidDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });

        describe('update', () => {
            it('should update password', async () => {
                const updatePasswordDto: UpdatePasswordCredentialDto = {
                    currentPassword: 'oldpass',
                    newPassword: 'newpass'
                };

                const updatedResponse = mockPasswordCredentialResponse;
                jest.spyOn(service, 'update').mockResolvedValue(updatedResponse);

                const result = await controller.update(auth.credentials.password.id, updatePasswordDto);
                
                expect(result).toEqual(updatedResponse);
                expect(service.update).toHaveBeenCalledWith(auth.credentials.password.id, updatePasswordDto);
            });

            it('should throw NotFoundException if password update fails', async () => {
                const updatePasswordDto: UpdatePasswordCredentialDto = {
                    currentPassword: 'oldpass',
                    newPassword: 'newpass'
                };

                jest.spyOn(service, 'update').mockResolvedValue(null);

                await expect(controller.update(auth.credentials.password.id, updatePasswordDto))
                    .rejects
                    .toThrow(new NotFoundException(`LoginCredential with ID ${auth.credentials.password.id} not found`));
            });
        });
    });

    describe('OAuth Credentials', () => {
        describe('create', () => {
            it('should create a Google OAuth credential', async () => {
                const createOAuthDto: CreateOAuthCredentialDto = {
                    identifier: 'google-user',
                    loginProviderId: 'google-provider',
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'access-token',
                    accessTokenExpiresAt: new Date(),
                    refreshToken: 'refresh-token',
                    refreshTokenExpiresAt: new Date(),
                    scope: 'email profile',
                    rawProfile: { email: 'test@example.com' },
                    isEnabled: true
                };

                jest.spyOn(service, 'createOAuthCredential').mockResolvedValue(mockGoogleCredentialResponse);

                const result = await controller.create(createOAuthDto);
                
                expect(result).toEqual(mockGoogleCredentialResponse);
                expect(service.createOAuthCredential).toHaveBeenCalledWith(createOAuthDto);
            });

            it('should create an Apple OAuth credential', async () => {
                const createAppleOAuthDto: CreateOAuthCredentialDto = {
                    identifier: 'apple123',
                    loginProviderId: 'apple-provider-id',
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.APPLE,
                    accessToken: 'access-token',
                    accessTokenExpiresAt: new Date(),
                    refreshToken: 'refresh-token',
                    refreshTokenExpiresAt: new Date(),
                    identityToken: 'identity-token',
                    authorizationCode: 'auth-code',
                    realUserStatus: 'real',
                    nonce: 'nonce',
                    isEnabled: true
                };

                jest.spyOn(service, 'createOAuthCredential').mockResolvedValue(mockAppleCredentialResponse);

                const result = await controller.create(createAppleOAuthDto);
                
                expect(result).toEqual(mockAppleCredentialResponse);
                expect(service.createOAuthCredential).toHaveBeenCalledWith(createAppleOAuthDto);
            });
        });

        describe('update', () => {
            it('should update OAuth credential', async () => {
                const updateOAuthDto: UpdateOAuthCredentialDto = {
                    accessToken: 'new-access-token',
                    refreshToken: 'new-refresh-token'
                };

                const updatedResponse = mockGoogleCredentialResponse;
                jest.spyOn(service, 'update').mockResolvedValue(updatedResponse);

                const result = await controller.update(auth.credentials.google.id, updateOAuthDto);
                
                expect(result).toEqual(updatedResponse);
                expect(service.update).toHaveBeenCalledWith(auth.credentials.google.id, updateOAuthDto);
            });

            it('should throw NotFoundException if OAuth update fails', async () => {
                const updateDto: UpdateOAuthCredentialDto = {
                    accessToken: 'new-access-token',
                    refreshToken: 'new-refresh-token'
                };

                jest.spyOn(service, 'update').mockResolvedValue(null);

                await expect(controller.update(auth.credentials.google.id, updateDto))
                    .rejects
                    .toThrow(new NotFoundException(`LoginCredential with ID ${auth.credentials.google.id} not found`));
            });
        });
    });

    describe('Generic Update', () => {
        it('should update generic fields', async () => {
            const updateDto: UpdateLoginCredentialDto = {
                isEnabled: false
            };

            const updatedResponse = { ...mockPasswordCredentialResponse, isEnabled: false };
            jest.spyOn(service, 'update').mockResolvedValue(updatedResponse);

            const result = await controller.update('cred123', updateDto);
            
            expect(result).toEqual(updatedResponse);
            expect(service.update).toHaveBeenCalledWith('cred123', updateDto);
        });

        it('should throw NotFoundException if update fails', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);

            await expect(controller.update('nonexistent', { isEnabled: false }))
                .rejects
                .toThrow(new NotFoundException('LoginCredential with ID nonexistent not found'));
        });
    });

    describe('remove', () => {
        it('should remove credential and return true', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            const result = await controller.remove('cred123');
            
            expect(result).toBe(true);
            expect(service.remove).toHaveBeenCalledWith('cred123');
        });

        it('should throw NotFoundException when credential not found', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);

            await expect(controller.remove('nonexistent')).rejects.toThrow(
                new NotFoundException('LoginCredential with ID nonexistent not found')
            );
        });
    });
});
