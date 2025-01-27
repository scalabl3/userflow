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
    ResponseLoginCredentialDto,
    CredentialType,
    OAuthProvider,
    UserState
} from '@my-app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

// Mock bcrypt for password hashing
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password_123'),
    compare: jest.fn().mockResolvedValue(true)
}));

describe('LoginCredentialService', () => {
    let service: LoginCredentialService;
    let repository: Repository<LoginCredential>;

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

    // Mock entities
    const mockPasswordCredential: LoginCredential = {
        id: 'cred123',
        identifier: 'john@example.com',
        loginProviderId: mockLoginProvider.id,
        loginProvider: mockLoginProvider,
        baseUserId: mockBaseUser.id,
        baseUser: mockBaseUser,
        credentialType: CredentialType.PASSWORD,
        passwordHash: 'hashed_password_123',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    } as LoginCredential;

    const mockGoogleCredential: LoginCredential = {
        id: 'cred456',
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
    } as LoginCredential;

    const mockAppleCredential: LoginCredential = {
        ...mockGoogleCredential,
        id: 'cred789',
        identifier: 'apple123',
        provider: OAuthProvider.APPLE,
        accessToken: 'apple-access-token',
        identityToken: 'apple-identity-token',
        authorizationCode: 'apple-auth-code',
        realUserStatus: 'REAL',
        nonce: 'random-nonce'
    } as LoginCredential;

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

        // Reset mocks
        jest.clearAllMocks();
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
                const credentials = [mockPasswordCredential, mockGoogleCredential];
                jest.spyOn(repository, 'find').mockResolvedValue(credentials);

                const result = await service.findAll();
                
                expect(result).toHaveLength(2);
                expect(repository.find).toHaveBeenCalledWith({
                    relations: ['loginProvider', 'baseUser']
                });

                // Verify DTO transformation
                const expectedDtos = credentials.map(cred => 
                    plainToClass(ResponseLoginCredentialDto, cred, { excludeExtraneousValues: true })
                );
                expect(result).toEqual(expectedDtos);
            });
        });

        describe('findOne', () => {
            it('should return a credential by id with relations', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);

                const result = await service.findOne(mockPasswordCredential.id);
                
                expect(result).toBeDefined();
                expect(result?.id).toBe(mockPasswordCredential.id);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { id: mockPasswordCredential.id },
                    relations: ['loginProvider', 'baseUser']
                });

                // Verify DTO transformation
                const expectedDto = plainToClass(ResponseLoginCredentialDto, mockPasswordCredential, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should return null for non-existent credential', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.findOne('nonexistent-id');
                
                expect(result).toBeNull();
            });
        });

        describe('findByIdentifierAndProvider', () => {
            it('should find credential by identifier and provider', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);

                const result = await service.findByIdentifierAndProvider(
                    mockPasswordCredential.identifier,
                    mockPasswordCredential.loginProviderId
                );

                expect(result).toBeDefined();
                expect(result?.identifier).toBe(mockPasswordCredential.identifier);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { 
                        identifier: mockPasswordCredential.identifier,
                        loginProviderId: mockPasswordCredential.loginProviderId
                    },
                    relations: ['loginProvider', 'baseUser']
                });
            });
        });
    });

    describe('Password Credentials', () => {
        describe('createPasswordCredential', () => {
            const createPasswordDto: CreatePasswordCredentialDto = {
                identifier: 'john@example.com',
                loginProviderId: mockLoginProvider.id,
                credentialType: CredentialType.PASSWORD,
                password: 'password123',
                isEnabled: true
            };

            it('should create password credential', async () => {
                jest.spyOn(repository, 'create').mockReturnValue(mockPasswordCredential);
                jest.spyOn(repository, 'save').mockResolvedValue(mockPasswordCredential);

                const result = await service.createPasswordCredential(createPasswordDto);

                expect(result).toBeDefined();
                expect(bcrypt.hash).toHaveBeenCalledWith(createPasswordDto.password, 10);
                expect(repository.create).toHaveBeenCalledWith({
                    ...createPasswordDto,
                    passwordHash: 'hashed_password_123'
                });

                // Verify DTO transformation
                const expectedDto = plainToClass(ResponseLoginCredentialDto, mockPasswordCredential, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should reject invalid credential type', async () => {
                const invalidDto = { ...createPasswordDto, credentialType: CredentialType.OAUTH };

                await expect(service.createPasswordCredential(invalidDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });

        describe('validatePassword', () => {
            it('should validate correct password', async () => {
                const isValid = await service.validatePassword(mockPasswordCredential, 'password123');
                
                expect(isValid).toBe(true);
                expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockPasswordCredential.passwordHash);
            });

            it('should reject if no password hash exists', async () => {
                const credWithoutHash = { ...mockPasswordCredential, passwordHash: undefined };
                
                const isValid = await service.validatePassword(credWithoutHash, 'password123');
                
                expect(isValid).toBe(false);
                expect(bcrypt.compare).not.toHaveBeenCalled();
            });
        });

        describe('updatePassword', () => {
            const updatePasswordDto: UpdatePasswordCredentialDto = {
                currentPassword: 'oldpass123',
                newPassword: 'newpass123'
            };

            it('should update password with valid credentials', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
                jest.spyOn(repository, 'save').mockResolvedValue({
                    ...mockPasswordCredential,
                    passwordHash: 'new_hashed_password'
                });

                const result = await service.updatePassword(mockPasswordCredential.id, updatePasswordDto);

                expect(result).toBeDefined();
                expect(bcrypt.compare).toHaveBeenCalledWith(
                    updatePasswordDto.currentPassword,
                    mockPasswordCredential.passwordHash
                );
                expect(bcrypt.hash).toHaveBeenCalledWith(updatePasswordDto.newPassword, 10);
            });

            it('should reject if current password is incorrect', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
                (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

                await expect(service.updatePassword(mockPasswordCredential.id, updatePasswordDto))
                    .rejects
                    .toThrow(UnauthorizedException);
            });

            it('should return null if credential not found', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.updatePassword('nonexistent', updatePasswordDto);
                
                expect(result).toBeNull();
            });

            it('should return null if credential is not password type', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockGoogleCredential);

                const result = await service.updatePassword(mockGoogleCredential.id, updatePasswordDto);
                
                expect(result).toBeNull();
            });
        });
    });

    describe('OAuth Credentials', () => {
        describe('createOAuthCredential', () => {
            const createOAuthDto: CreateOAuthCredentialDto = {
                identifier: 'google123',
                loginProviderId: mockLoginProvider.id,
                credentialType: CredentialType.OAUTH,
                provider: OAuthProvider.GOOGLE,
                accessToken: 'access_token',
                accessTokenExpiresAt: new Date(),
                refreshToken: 'refresh_token',
                refreshTokenExpiresAt: new Date(),
                scope: 'email profile',
                rawProfile: { email: 'john@gmail.com' }
            };

            it('should create Google OAuth credential', async () => {
                jest.spyOn(repository, 'create').mockReturnValue(mockGoogleCredential);
                jest.spyOn(repository, 'save').mockResolvedValue(mockGoogleCredential);

                const result = await service.createOAuthCredential(createOAuthDto);

                expect(result).toBeDefined();
                expect(repository.create).toHaveBeenCalledWith({
                    ...createOAuthDto,
                    identityToken: undefined,
                    authorizationCode: undefined,
                    realUserStatus: undefined,
                    nonce: undefined
                });

                // Verify DTO transformation
                const expectedDto = plainToClass(ResponseLoginCredentialDto, mockGoogleCredential, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should create Apple OAuth credential with specific fields', async () => {
                const createAppleDto: CreateOAuthCredentialDto = {
                    ...createOAuthDto,
                    provider: OAuthProvider.APPLE,
                    identityToken: 'apple_identity_token',
                    authorizationCode: 'apple_auth_code',
                    realUserStatus: 'REAL',
                    nonce: 'random_nonce'
                };

                jest.spyOn(repository, 'create').mockReturnValue(mockAppleCredential);
                jest.spyOn(repository, 'save').mockResolvedValue(mockAppleCredential);

                const result = await service.createOAuthCredential(createAppleDto);

                expect(result).toBeDefined();
                expect(repository.create).toHaveBeenCalledWith({
                    ...createAppleDto,
                    identityToken: createAppleDto.identityToken,
                    authorizationCode: createAppleDto.authorizationCode,
                    realUserStatus: createAppleDto.realUserStatus,
                    nonce: createAppleDto.nonce
                });

                // Verify DTO transformation
                const expectedDto = plainToClass(ResponseLoginCredentialDto, mockAppleCredential, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should reject invalid credential type', async () => {
                const invalidDto = { ...createOAuthDto, credentialType: CredentialType.PASSWORD };

                await expect(service.createOAuthCredential(invalidDto))
                    .rejects
                    .toThrow(BadRequestException);
            });
        });

        describe('updateOAuthCredential', () => {
            const updateOAuthDto: UpdateOAuthCredentialDto = {
                accessToken: 'new_access_token',
                refreshToken: 'new_refresh_token'
            };

            it('should update OAuth fields', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockGoogleCredential);
                const updatedCredential = {
                    ...mockGoogleCredential,
                    ...updateOAuthDto
                };
                jest.spyOn(repository, 'save').mockResolvedValue(updatedCredential);

                const result = await service.updateOAuthCredential(mockGoogleCredential.id, updateOAuthDto);

                expect(result).toBeDefined();
                const expectedDto = plainToClass(ResponseLoginCredentialDto, updatedCredential, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should handle Apple-specific fields', async () => {
                const appleUpdateDto: UpdateOAuthCredentialDto = {
                    ...updateOAuthDto,
                    provider: OAuthProvider.APPLE,
                    identityToken: 'new_identity_token',
                    authorizationCode: 'new_auth_code',
                    realUserStatus: 'REAL',
                    nonce: 'new_nonce'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockAppleCredential);
                const updatedCredential = {
                    ...mockAppleCredential,
                    ...appleUpdateDto
                };
                jest.spyOn(repository, 'save').mockResolvedValue(updatedCredential);

                const result = await service.updateOAuthCredential(mockAppleCredential.id, appleUpdateDto);

                expect(result).toBeDefined();
                const expectedDto = plainToClass(ResponseLoginCredentialDto, updatedCredential, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should preserve Apple-specific fields when updating non-Apple provider', async () => {
                // Start with Apple credential
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockAppleCredential);
                
                // Update to Google
                const updateDto: UpdateOAuthCredentialDto = {
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'new_access_token'
                };

                const updatedCredential = {
                    ...mockAppleCredential,
                    provider: OAuthProvider.GOOGLE,
                    accessToken: 'new_access_token',
                    // Apple fields should be preserved
                    identityToken: mockAppleCredential.identityToken,
                    authorizationCode: mockAppleCredential.authorizationCode,
                    realUserStatus: mockAppleCredential.realUserStatus,
                    nonce: mockAppleCredential.nonce
                };
                jest.spyOn(repository, 'save').mockResolvedValue(updatedCredential);

                const result = await service.updateOAuthCredential(mockAppleCredential.id, updateDto);

                expect(result).toBeDefined();
                const expectedDto = plainToClass(ResponseLoginCredentialDto, updatedCredential, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should return null if credential not found', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.updateOAuthCredential('nonexistent', updateOAuthDto);
                
                expect(result).toBeNull();
            });

            it('should return null if credential is not OAuth type', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);

                const result = await service.updateOAuthCredential(mockPasswordCredential.id, updateOAuthDto);
                
                expect(result).toBeNull();
            });
        });
    });

    describe('Generic Update', () => {
        it('should route password update to updatePassword', async () => {
            const updateDto: UpdatePasswordCredentialDto = {
                currentPassword: 'oldpass',
                newPassword: 'newpass'
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
            const updateSpy = jest.spyOn(service, 'updatePassword');

            await service.update(mockPasswordCredential.id, updateDto);

            expect(updateSpy).toHaveBeenCalledWith(mockPasswordCredential.id, updateDto);
        });

        it('should route OAuth update to updateOAuthCredential', async () => {
            const updateDto: UpdateOAuthCredentialDto = {
                provider: OAuthProvider.GOOGLE,
                accessToken: 'new_token'
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockGoogleCredential);
            const updateSpy = jest.spyOn(service, 'updateOAuthCredential');

            await service.update(mockGoogleCredential.id, updateDto);

            expect(updateSpy).toHaveBeenCalledWith(mockGoogleCredential.id, updateDto);
        });

        it('should handle generic updates', async () => {
            const updateDto: UpdateLoginCredentialDto = {
                isEnabled: false
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockPasswordCredential);
            const updatedCredential = {
                ...mockPasswordCredential,
                isEnabled: false
            };
            jest.spyOn(repository, 'save').mockResolvedValue(updatedCredential);

            const result = await service.update(mockPasswordCredential.id, updateDto);

            expect(result).toBeDefined();
            const expectedDto = plainToClass(ResponseLoginCredentialDto, updatedCredential, { excludeExtraneousValues: true });
            expect(result).toEqual(expectedDto);
        });
    });

    describe('remove', () => {
        it('should remove credential and return true', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            const result = await service.remove('cred123');

            expect(result).toBe(true);
            expect(repository.delete).toHaveBeenCalledWith('cred123');
        });

        it('should return false if credential not found', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            const result = await service.remove('nonexistent');

            expect(result).toBe(false);
        });
    });
});
