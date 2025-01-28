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
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { auth } from '../test/__mocks__/auth.mock';
import { user } from '../test/__mocks__/user.mock';
import { core } from '../test/__mocks__/core.mock';

describe('LoginCredentialController', () => {
    let controller: LoginCredentialController;
    let service: LoginCredentialService;

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
    const mockPasswordCredentialResponse: ResponseLoginCredentialDto = {
        id: auth.credentials.password.id,
        identifier: auth.credentials.password.identifier,
        loginProviderId: auth.credentials.password.loginProviderId,
        loginProvider: auth.credentials.password.loginProvider,
        credentialType: auth.credentials.password.credentialType,
        hasPassword: true,
        isEnabled: auth.credentials.password.isEnabled,
        baseUserId: auth.credentials.password.baseUserId,
        createdAt: auth.credentials.password.createdAt,
        modifiedAt: auth.credentials.password.modifiedAt
    };

    const mockGoogleCredentialResponse: ResponseLoginCredentialDto = {
        id: auth.credentials.google.id,
        identifier: auth.credentials.google.identifier,
        loginProviderId: auth.credentials.google.loginProviderId,
        loginProvider: auth.credentials.google.loginProvider,
        credentialType: auth.credentials.google.credentialType,
        provider: auth.credentials.google.provider,
        accessTokenExpiresAt: core.timestamps.future,
        hasRefreshToken: true,
        refreshTokenExpiresAt: core.timestamps.future,
        scope: auth.credentials.google.scope,
        rawProfile: auth.credentials.google.rawProfile,
        isEnabled: auth.credentials.google.isEnabled,
        baseUserId: auth.credentials.google.baseUserId,
        createdAt: core.timestamps.past,
        modifiedAt: core.timestamps.now
    };

    const mockAppleCredentialResponse: ResponseLoginCredentialDto = {
        ...mockGoogleCredentialResponse,
        id: 'cred789',
        identifier: 'apple123',
        loginProviderId: 'apple-provider-id',
        provider: OAuthProvider.APPLE,
        hasIdentityToken: true,
        hasAuthorizationCode: true,
        realUserStatus: 'REAL'
    };

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
            ],
        }).compile();

        controller = module.get<LoginCredentialController>(LoginCredentialController);
        service = module.get<LoginCredentialService>(LoginCredentialService);

        // Reset mocks
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
        });

        describe('findOne', () => {
            it('should return a single login credential', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValue(mockPasswordCredentialResponse);

                const result = await controller.findOne('cred123');
                
                expect(result).toEqual(mockPasswordCredentialResponse);
                expect(service.findOne).toHaveBeenCalledWith('cred123');
            });

            it('should throw BadRequestException if credential not found', async () => {
                jest.spyOn(service, 'findOne').mockResolvedValue(null);

                await expect(controller.findOne('nonexistent'))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });
    });

    describe('Password Credentials', () => {
        describe('create', () => {
            it('should create a password credential', async () => {
                const createPasswordDto: CreatePasswordCredentialDto = {
                    identifier: auth.credentials.password.identifier,
                    loginProviderId: auth.credentials.password.loginProviderId,
                    credentialType: CredentialType.PASSWORD,
                    password: auth.requests.login.email.password,
                    isEnabled: true
                };

                jest.spyOn(service, 'createPasswordCredential').mockResolvedValue(mockPasswordCredentialResponse);

                const result = await controller.create(createPasswordDto);
                
                expect(result).toEqual(mockPasswordCredentialResponse);
                expect(service.createPasswordCredential).toHaveBeenCalledWith(createPasswordDto);
            });

            it('should throw BadRequestException for invalid credential type', async () => {
                const createDto = {
                    ...auth.credentials.password,
                    credentialType: 'INVALID' as CredentialType,  // Force invalid type
                    password: 'testpass'
                };

                await expect(controller.create(createDto))
                    .rejects
                    .toThrow(new BadRequestException('Invalid credential type'));
            });
        });

        describe('update', () => {
            it('should update password', async () => {
                const updatePasswordDto: UpdatePasswordCredentialDto = {
                    currentPassword: auth.requests.login.email.password,
                    newPassword: 'newpass123'
                };

                const updatedResponse = { ...mockPasswordCredentialResponse };
                jest.spyOn(service, 'update').mockResolvedValue(updatedResponse);

                const result = await controller.update(auth.credentials.password.id, updatePasswordDto);
                
                expect(result).toEqual(updatedResponse);
                expect(service.update).toHaveBeenCalledWith(auth.credentials.password.id, updatePasswordDto);
            });

            it('should throw BadRequestException if password update fails', async () => {
                const updatePasswordDto: UpdatePasswordCredentialDto = {
                    currentPassword: 'wrongpass',
                    newPassword: 'newpass123'
                };

                jest.spyOn(service, 'update').mockResolvedValue(null);

                await expect(controller.update(auth.credentials.password.id, updatePasswordDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });
    });

    describe('OAuth Credentials', () => {
        describe('create', () => {
            it('should create a Google OAuth credential', async () => {
                const createOAuthDto: CreateOAuthCredentialDto = {
                    identifier: auth.credentials.google.identifier,
                    loginProviderId: auth.credentials.google.loginProviderId,
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'google_access_token',
                    accessTokenExpiresAt: core.timestamps.future,
                    refreshToken: 'new_refresh_token',
                    refreshTokenExpiresAt: core.timestamps.future,
                    scope: auth.credentials.google.scope,
                    rawProfile: auth.credentials.google.rawProfile,
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
                    accessToken: 'apple_access_token',
                    accessTokenExpiresAt: new Date(),
                    identityToken: 'apple_identity_token',
                    authorizationCode: 'apple_auth_code',
                    realUserStatus: 'REAL',
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
                const updateOAuthDto = {
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'new_access_token',
                    accessTokenExpiresAt: core.timestamps.future,
                    refreshToken: 'new_refresh_token',
                    refreshTokenExpiresAt: core.timestamps.future,
                    scope: auth.credentials.google.scope,
                    rawProfile: auth.credentials.google.rawProfile
                };

                const updatedResponse = { ...mockGoogleCredentialResponse };
                jest.spyOn(service, 'update').mockResolvedValue(updatedResponse);

                const result = await controller.update(auth.credentials.google.id, updateOAuthDto);
                
                expect(result).toEqual(updatedResponse);
                expect(service.update).toHaveBeenCalledWith(auth.credentials.google.id, updateOAuthDto);
            });

            it('should throw BadRequestException if OAuth update fails', async () => {
                const updateDto: UpdateLoginCredentialDto = {
                    credentialType: CredentialType.OAUTH,
                    isEnabled: true,
                    loginProviderId: auth.credentials.google.loginProviderId
                };

                jest.spyOn(service, 'update').mockResolvedValue(null);

                await expect(controller.update(auth.credentials.google.id, updateDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });
    });

    describe('Generic Update', () => {
        it('should update generic fields', async () => {
            const updateDto: UpdateLoginCredentialDto = {
                isEnabled: false
            };

            const updatedResponse = {
                ...mockPasswordCredentialResponse,
                isEnabled: false
            };

            jest.spyOn(service, 'update').mockResolvedValue(updatedResponse);

            const result = await controller.update('cred123', updateDto);
            
            expect(result).toEqual(updatedResponse);
            expect(service.update).toHaveBeenCalledWith('cred123', updateDto);
        });

        it('should throw BadRequestException if update fails', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);

            await expect(controller.update('nonexistent', { isEnabled: false }))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should remove credential and return true', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            const result = await controller.remove('cred123');
            
            expect(result).toBe(true);
            expect(service.remove).toHaveBeenCalledWith('cred123');
        });

        it('should return false if credential not found', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);

            const result = await controller.remove('nonexistent');
            
            expect(result).toBe(false);
            expect(service.remove).toHaveBeenCalledWith('nonexistent');
        });
    });
});
