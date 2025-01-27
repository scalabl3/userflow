import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginCredentialService } from './LoginCredentialService';
import { LoginCredential } from '../models/LoginCredential';
import { LoginProvider } from '../models/LoginProvider';
import { BaseUser } from '../models/BaseUser';
import { mockRepository } from '../test/setup';
import * as bcrypt from 'bcrypt';
import { 
    CreateLoginCredentialDto,
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdateLoginCredentialDto,
    UpdatePasswordCredentialDto,
    UpdateOAuthCredentialDto,
    ResponseLoginCredentialDto
} from '@my-app/shared';
import { CredentialType, OAuthProvider } from '@my-app/shared';
import { UserState } from '@my-app/shared';

// Mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password_123'),
    compare: jest.fn().mockResolvedValue(true)
}));

describe('LoginCredentialService', () => {
    let service: LoginCredentialService;
    let repository: Repository<LoginCredential>;
    let loginProviderRepository: Repository<LoginProvider>;

    // Mock data
    const mockLoginProvider: LoginProvider = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        code: 'email',
        name: 'Email Provider',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    const mockBaseUser: BaseUser = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        firstname: 'John',
        lastname: 'Doe',
        displayname: 'John Doe',
        contactEmail: 'john@example.com',
        state: UserState.ACTIVE,
        primaryLoginCredentialId: '123e4567-e89b-12d3-a456-426614174002',
        lastLoginAt: new Date(),
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
        loginCredentials: []
    };

    // Mock credentials for different types
    const mockPasswordCredential: LoginCredential = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        identifier: 'john@example.com',
        loginProviderId: mockLoginProvider.id,
        loginProvider: mockLoginProvider,
        baseUserId: mockBaseUser.id,
        baseUser: mockBaseUser,
        credentialType: CredentialType.PASSWORD,
        passwordHash: 'hashedpassword123',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    const mockGoogleCredential: LoginCredential = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        identifier: 'google123',
        loginProviderId: mockLoginProvider.id,
        loginProvider: mockLoginProvider,
        baseUserId: mockBaseUser.id,
        baseUser: mockBaseUser,
        credentialType: CredentialType.OAUTH,
        provider: OAuthProvider.GOOGLE,
        accessToken: 'google-access-token',
        accessTokenExpiresAt: new Date(),
        refreshToken: 'google-refresh-token',
        refreshTokenExpiresAt: new Date(),
        scope: 'email profile',
        rawProfile: { email: 'john@example.com' },
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    const mockAppleCredential: LoginCredential = {
        id: '123e4567-e89b-12d3-a456-426614174004',
        identifier: 'apple123',
        loginProviderId: mockLoginProvider.id,
        loginProvider: mockLoginProvider,
        baseUserId: mockBaseUser.id,
        baseUser: mockBaseUser,
        credentialType: CredentialType.OAUTH,
        provider: OAuthProvider.APPLE,
        accessToken: 'apple-access-token',
        accessTokenExpiresAt: new Date(),
        refreshToken: 'apple-refresh-token',
        refreshTokenExpiresAt: new Date(),
        scope: 'email name',
        rawProfile: { email: 'john@example.com' },
        // Apple-specific fields
        identityToken: 'apple-identity-token',
        authorizationCode: 'apple-auth-code',
        realUserStatus: 'LIKELY_REAL',
        nonce: 'random-nonce',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    // Mock data for DTOs
    const mockPasswordCredentialDto: ResponseLoginCredentialDto = {
        id: mockPasswordCredential.id,
        identifier: mockPasswordCredential.identifier,
        loginProviderId: mockPasswordCredential.loginProviderId,
        loginProvider: {
            id: mockLoginProvider.id,
            code: mockLoginProvider.code,
            name: mockLoginProvider.name,
            isEnabled: mockLoginProvider.isEnabled,
            createdAt: mockLoginProvider.createdAt,
            modifiedAt: mockLoginProvider.modifiedAt
        },
        credentialType: mockPasswordCredential.credentialType,
        hasPassword: true,
        isEnabled: mockPasswordCredential.isEnabled,
        baseUserId: mockPasswordCredential.baseUserId,
        createdAt: mockPasswordCredential.createdAt,
        modifiedAt: mockPasswordCredential.modifiedAt
    };

    const mockGoogleCredentialDto: ResponseLoginCredentialDto = {
        id: mockGoogleCredential.id,
        identifier: mockGoogleCredential.identifier,
        loginProviderId: mockGoogleCredential.loginProviderId,
        loginProvider: {
            id: mockLoginProvider.id,
            code: mockLoginProvider.code,
            name: mockLoginProvider.name,
            isEnabled: mockLoginProvider.isEnabled,
            createdAt: mockLoginProvider.createdAt,
            modifiedAt: mockLoginProvider.modifiedAt
        },
        credentialType: mockGoogleCredential.credentialType,
        provider: mockGoogleCredential.provider,
        accessTokenExpiresAt: mockGoogleCredential.accessTokenExpiresAt,
        hasRefreshToken: true,
        refreshTokenExpiresAt: mockGoogleCredential.refreshTokenExpiresAt,
        scope: mockGoogleCredential.scope,
        rawProfile: mockGoogleCredential.rawProfile,
        isEnabled: mockGoogleCredential.isEnabled,
        baseUserId: mockGoogleCredential.baseUserId,
        createdAt: mockGoogleCredential.createdAt,
        modifiedAt: mockGoogleCredential.modifiedAt
    };

    const mockAppleCredentialDto: ResponseLoginCredentialDto = {
        id: mockAppleCredential.id,
        identifier: mockAppleCredential.identifier,
        loginProviderId: mockAppleCredential.loginProviderId,
        loginProvider: {
            id: mockLoginProvider.id,
            code: mockLoginProvider.code,
            name: mockLoginProvider.name,
            isEnabled: mockLoginProvider.isEnabled,
            createdAt: mockLoginProvider.createdAt,
            modifiedAt: mockLoginProvider.modifiedAt
        },
        credentialType: mockAppleCredential.credentialType,
        provider: mockAppleCredential.provider,
        accessTokenExpiresAt: mockAppleCredential.accessTokenExpiresAt,
        hasRefreshToken: true,
        refreshTokenExpiresAt: mockAppleCredential.refreshTokenExpiresAt,
        scope: mockAppleCredential.scope,
        rawProfile: mockAppleCredential.rawProfile,
        hasIdentityToken: true,
        hasAuthorizationCode: true,
        realUserStatus: mockAppleCredential.realUserStatus,
        isEnabled: mockAppleCredential.isEnabled,
        baseUserId: mockAppleCredential.baseUserId,
        createdAt: mockAppleCredential.createdAt,
        modifiedAt: mockAppleCredential.modifiedAt
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginCredentialService,
                {
                    provide: getRepositoryToken(LoginCredential),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<LoginCredentialService>(LoginCredentialService);
        repository = module.get<Repository<LoginCredential>>(getRepositoryToken(LoginCredential));

        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Common Methods', () => {
        describe('findAll', () => {
            it('should return all login credentials with relations', async () => {
                const credentials = [
                    mockPasswordCredential,
                    mockGoogleCredential,
                    mockAppleCredential
                ];
                jest.spyOn(repository, 'find').mockResolvedValue(credentials);

                const result = await service.findAll();
                expect(result).toEqual(credentials);
                expect(repository.find).toHaveBeenCalledWith({
                    relations: ['loginProvider', 'baseUser']
                });
            });
        });

        describe('findOne', () => {
            it('should return a credential by id with relations', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);

                const result = await service.findOne('cred123');
                expect(result).toEqual(mockPasswordCredential);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { id: 'cred123' },
                    relations: ['loginProvider', 'baseUser']
                });
            });

            it('should return null if credential not found', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.findOne('nonexistent');
                expect(result).toBeNull();
            });
        });

        describe('findByIdentifierAndProvider', () => {
            it('should find credential by identifier and provider', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);

                const result = await service.findByIdentifierAndProvider(
                    'john@example.com',
                    mockLoginProvider.id
                );

                expect(result).toEqual(mockPasswordCredential);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { 
                        identifier: 'john@example.com', 
                        loginProviderId: mockLoginProvider.id 
                    },
                    relations: ['loginProvider', 'baseUser']
                });
            });

            it('should return null when no credential matches', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.findByIdentifierAndProvider(
                    'nonexistent@example.com',
                    'invalid-provider'
                );
                expect(result).toBeNull();
            });
        });

        describe('remove', () => {
            it('should delete a credential and return true', async () => {
                jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

                const result = await service.remove('cred123');
                expect(result).toBe(true);
                expect(repository.delete).toHaveBeenCalledWith('cred123');
            });

            it('should return false when credential not found', async () => {
                jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

                const result = await service.remove('nonexistent');
                expect(result).toBe(false);
            });
        });
    });

    describe('Password Credentials', () => {
        describe('createPasswordCredential', () => {
            const createPasswordDto: CreatePasswordCredentialDto = {
                identifier: 'new@example.com',
                loginProviderId: mockLoginProvider.id,
                password: 'Password123!',
                credentialType: CredentialType.PASSWORD
            };

            it('should create a password credential', async () => {
                const expectedCredential = {
                    ...mockPasswordCredential,
                    id: expect.any(String),
                    identifier: createPasswordDto.identifier,
                    passwordHash: 'hashed_password_123',
                    createdAt: expect.any(Date),
                    modifiedAt: expect.any(Date)
                };

                jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
                jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

                const result = await service.createPasswordCredential(createPasswordDto);

                expect(result).toEqual(expectedCredential);
                expect(bcrypt.hash).toHaveBeenCalledWith(createPasswordDto.password, 10);
                expect(repository.create).toHaveBeenCalledWith({
                    identifier: createPasswordDto.identifier,
                    loginProviderId: createPasswordDto.loginProviderId,
                    credentialType: CredentialType.PASSWORD,
                    passwordHash: 'hashed_password_123'
                });
            });

            it('should throw error if password is invalid', async () => {
                const invalidDto: CreatePasswordCredentialDto = { 
                    ...createPasswordDto, 
                    password: '123',
                    credentialType: CredentialType.PASSWORD
                };
                await expect(service.createPasswordCredential(invalidDto))
                    .rejects
                    .toThrow('Password must be at least 8 characters long');
            });
        });

        describe('validatePassword', () => {
            it('should return true for valid password', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
                
                const result = await service.validatePassword(mockPasswordCredential, 'correct_password');

                expect(result).toBe(true);
                expect(bcrypt.compare).toHaveBeenCalledWith(
                    'correct_password',
                    mockPasswordCredential.passwordHash
                );
            });

            it('should return false for invalid password', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
                (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

                const result = await service.validatePassword(mockPasswordCredential, 'wrong_password');

                expect(result).toBe(false);
            });

            it('should return false if credential has no password hash', async () => {
                const credentialWithoutHash = { ...mockPasswordCredential, passwordHash: undefined };
                jest.spyOn(repository, 'findOne').mockResolvedValue(credentialWithoutHash);

                const result = await service.validatePassword(credentialWithoutHash, 'any_password');

                expect(result).toBe(false);
                expect(bcrypt.compare).not.toHaveBeenCalled();
            });
        });

        describe('updatePassword', () => {
            it('should update password hash', async () => {
                const updateDto: UpdatePasswordCredentialDto = {
                    newPassword: 'NewPassword123!',
                    credentialType: CredentialType.PASSWORD
                };
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
                jest.spyOn(repository, 'save').mockResolvedValue({
                    ...mockPasswordCredential,
                    passwordHash: 'new_hashed_password_123'
                });

                const result = await service.updatePassword(mockPasswordCredential.id, updateDto);

                expect(result).toBeTruthy();
                expect(bcrypt.hash).toHaveBeenCalledWith(updateDto.newPassword, 10);
                expect(repository.save).toHaveBeenCalledWith({
                    ...mockPasswordCredential,
                    passwordHash: 'hashed_password_123'
                });
            });

            it('should validate current password if provided', async () => {
                const updateDto: UpdatePasswordCredentialDto = {
                    currentPassword: 'CurrentPass123',
                    newPassword: 'NewPassword123!',
                    credentialType: CredentialType.PASSWORD
                };
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
                jest.spyOn(repository, 'save').mockResolvedValue({
                    ...mockPasswordCredential,
                    passwordHash: 'new_hashed_password_123'
                });
                (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

                const result = await service.updatePassword(mockPasswordCredential.id, updateDto);

                expect(result).toBeTruthy();
                expect(bcrypt.compare).toHaveBeenCalledWith(
                    updateDto.currentPassword,
                    mockPasswordCredential.passwordHash
                );
                expect(bcrypt.hash).toHaveBeenCalledWith(updateDto.newPassword, 10);
            });

            it('should throw error if current password is incorrect', async () => {
                const updateDto: UpdatePasswordCredentialDto = {
                    currentPassword: 'WrongPass123',
                    newPassword: 'NewPassword123!',
                    credentialType: CredentialType.PASSWORD
                };
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
                (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

                await expect(service.updatePassword(mockPasswordCredential.id, updateDto))
                    .rejects
                    .toThrow('Current password is incorrect');
            });

            it('should throw error if credential not found', async () => {
                const updateDto: UpdatePasswordCredentialDto = {
                    newPassword: 'NewPassword123!',
                    credentialType: CredentialType.PASSWORD
                };
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                await expect(service.updatePassword('nonexistent', updateDto))
                    .rejects
                    .toThrow('Credential not found');
            });

            it('should throw error if credential is not password type', async () => {
                const updateDto: UpdatePasswordCredentialDto = {
                    newPassword: 'NewPassword123!',
                    credentialType: CredentialType.PASSWORD
                };
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockGoogleCredential);

                await expect(service.updatePassword(mockGoogleCredential.id, updateDto))
                    .rejects
                    .toThrow('Credential is not a password type');
            });
        });
    });

    describe('OAuth Credentials', () => {
        describe('createOAuthCredential', () => {
            const createGoogleOAuthDto: CreateOAuthCredentialDto = {
                identifier: '12345',
                loginProviderId: 'google-provider-id',
                credentialType: CredentialType.OAUTH,
                provider: OAuthProvider.GOOGLE,
                accessToken: 'google_access_token',
                accessTokenExpiresAt: new Date(Date.now() + 3600000),
                refreshToken: 'google_refresh_token',
                refreshTokenExpiresAt: new Date(Date.now() + 7200000),
                scope: 'email profile',
                rawProfile: { email: 'john@gmail.com', name: 'John Doe' }
            };

            const createAppleOAuthDto: CreateOAuthCredentialDto = {
                identifier: 'apple_user_id',
                loginProviderId: 'apple-provider-id',
                credentialType: CredentialType.OAUTH,
                provider: OAuthProvider.APPLE,
                accessToken: 'apple_access_token',
                accessTokenExpiresAt: new Date(Date.now() + 3600000),
                identityToken: 'apple_identity_token',
                authorizationCode: 'apple_auth_code',
                realUserStatus: 'REAL',
                nonce: 'random_nonce',
                rawProfile: { email: 'john@privaterelay.appleid.com' }
            };

            it('should create a Google OAuth credential', async () => {
                const expectedCredential = {
                    ...mockGoogleCredential,
                    id: expect.any(String),
                    createdAt: expect.any(Date),
                    modifiedAt: expect.any(Date)
                };

                jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
                jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

                const result = await service.createOAuthCredential(createGoogleOAuthDto);

                expect(result).toEqual(expectedCredential);
                expect(repository.create).toHaveBeenCalledWith({
                    ...createGoogleOAuthDto,
                    isEnabled: true
                });
            });

            it('should create an Apple OAuth credential with specific fields', async () => {
                const expectedCredential = {
                    ...mockAppleCredential,
                    id: expect.any(String),
                    createdAt: expect.any(Date),
                    modifiedAt: expect.any(Date)
                };

                jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
                jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

                const result = await service.createOAuthCredential(createAppleOAuthDto);

                expect(result).toEqual(expectedCredential);
                expect(repository.create).toHaveBeenCalledWith({
                    ...createAppleOAuthDto,
                    isEnabled: true
                });
            });

            it('should throw error if credential type is not OAUTH', async () => {
                const invalidDto = {
                    ...createGoogleOAuthDto,
                    credentialType: CredentialType.PASSWORD
                };

                await expect(service.createOAuthCredential(invalidDto as CreateOAuthCredentialDto))
                    .rejects
                    .toThrow('Invalid credential type for OAuth creation');
            });

            it('should throw error if required fields are missing', async () => {
                const invalidDto = {
                    ...createGoogleOAuthDto,
                    accessToken: undefined,
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE
                } as unknown as CreateOAuthCredentialDto;

                await expect(service.createOAuthCredential(invalidDto))
                    .rejects
                    .toThrow();
            });
        });

        describe('updateOAuthCredential', () => {
            it('should update Google OAuth fields', async () => {
                const updateDto: UpdateOAuthCredentialDto = {
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'new_access_token',
                    accessTokenExpiresAt: new Date(Date.now() + 3600000),
                    refreshToken: 'new_refresh_token',
                    scope: 'email profile openid'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockGoogleCredential);
                jest.spyOn(repository, 'save').mockResolvedValue({
                    ...mockGoogleCredential,
                    ...updateDto
                });

                const result = await service.updateOAuthCredential(mockGoogleCredential.id, updateDto);

                expect(result).toBeTruthy();
                expect(repository.save).toHaveBeenCalledWith({
                    ...mockGoogleCredential,
                    ...updateDto
                });
            });

            it('should update Apple OAuth fields', async () => {
                const updateDto: UpdateOAuthCredentialDto = {
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.APPLE,
                    accessToken: 'new_access_token',
                    identityToken: 'new_identity_token',
                    authorizationCode: 'new_auth_code',
                    realUserStatus: 'REAL'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockAppleCredential);
                jest.spyOn(repository, 'save').mockResolvedValue({
                    ...mockAppleCredential,
                    ...updateDto
                });

                const result = await service.updateOAuthCredential(mockAppleCredential.id, updateDto);

                expect(result).toBeTruthy();
                expect(repository.save).toHaveBeenCalledWith({
                    ...mockAppleCredential,
                    ...updateDto
                });
            });

            it('should preserve Apple-specific fields when updating non-Apple provider', async () => {
                const credential = { ...mockAppleCredential };
                const updateDto: UpdateOAuthCredentialDto = {
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'new_access_token'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(credential);
                jest.spyOn(repository, 'save').mockResolvedValue({
                    ...credential,
                    ...updateDto,
                    identityToken: credential.identityToken,
                    authorizationCode: credential.authorizationCode,
                    realUserStatus: credential.realUserStatus,
                    nonce: credential.nonce
                });

                const result = await service.updateOAuthCredential(credential.id, updateDto);

                expect(result).toBeTruthy();
                expect(result?.hasIdentityToken).toBe(true);
                expect(result?.hasAuthorizationCode).toBe(true);
                expect(result?.realUserStatus).toBe(credential.realUserStatus);
            });

            it('should return null if credential not found', async () => {
                const updateDto: UpdateOAuthCredentialDto = {
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'new_access_token'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.updateOAuthCredential('nonexistent', updateDto);
                expect(result).toBeNull();
            });

            it('should return null if credential is not OAuth type', async () => {
                const updateDto: UpdateOAuthCredentialDto = {
                    credentialType: CredentialType.OAUTH,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'new_access_token'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);

                const result = await service.updateOAuthCredential(mockPasswordCredential.id, updateDto);
                expect(result).toBeNull();
            });
        });
    });
});
