import { bcryptMock } from '../test/__mocks__/bcrypt.mock';
jest.mock('bcrypt', () => bcryptMock);

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LoginCredentialService } from './LoginCredentialService';
import { LoginCredential } from '../models/LoginCredential';
import { mockRepository } from '../test/setup';
import * as bcrypt from 'bcrypt';
import { 
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto,
    UpdatePasswordCredentialDto,
    UpdateOAuthCredentialDto,
    ResponseLoginCredentialDto,
    CredentialType,
    OAuthProvider,
    UpdateLoginCredentialDto
} from '@my-app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { auth as authMock } from '../test/__mocks__/auth.mock';
import { user as userMock } from '../test/__mocks__/user.mock';

describe('LoginCredentialService', () => {
    let service: LoginCredentialService;
    let repository: Repository<LoginCredential>;
    let dataSource: DataSource;

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

    beforeEach(async () => {
        const mockDataSource = {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner)
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginCredentialService,
                {
                    provide: getRepositoryToken(LoginCredential),
                    useFactory: mockRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<LoginCredentialService>(LoginCredentialService);
        repository = module.get<Repository<LoginCredential>>(getRepositoryToken(LoginCredential));
        dataSource = module.get<DataSource>(DataSource);

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
                const credentials = [authMock.credentials.password, authMock.credentials.google];
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
                const mockCred = authMock.credentials.password;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);

                const result = await service.findOne(mockCred.id);
                
                expect(result).toBeDefined();
                expect(result?.id).toBe(mockCred.id);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { id: mockCred.id },
                    relations: ['loginProvider', 'baseUser']
                });

                // Verify DTO transformation
                const expectedDto = plainToClass(ResponseLoginCredentialDto, mockCred, { excludeExtraneousValues: true });
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
                const mockCred = authMock.credentials.password;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);

                const result = await service.findByIdentifierAndProvider(
                    mockCred.identifier,
                    mockCred.loginProviderId
                );

                expect(result).toBeDefined();
                expect(result?.identifier).toBe(mockCred.identifier);
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { 
                        identifier: mockCred.identifier,
                        loginProviderId: mockCred.loginProviderId
                    },
                    relations: ['loginProvider', 'baseUser']
                });
            });

            it('should return null when no credential is found', async () => {
                const identifier = 'test@example.com';
                const loginProviderId = 'provider-id';
                
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.findByIdentifierAndProvider(identifier, loginProviderId);

                expect(result).toBeNull();
                expect(repository.findOne).toHaveBeenCalledWith({
                    where: { identifier, loginProviderId },
                    relations: ['loginProvider', 'baseUser']
                });
            });
        });
    });

    describe('Password Credentials', () => {
        describe('createPasswordCredential', () => {
            const createPasswordDto: CreatePasswordCredentialDto = {
                identifier: authMock.credentials.password.identifier,
                loginProviderId: authMock.providers.email.id,
                credentialType: CredentialType.PASSWORD,
                password: 'password123',
                isEnabled: true
            };

            it('should create password credential', async () => {
                const mockCred = authMock.credentials.password;
                jest.spyOn(repository, 'create').mockReturnValue(mockCred);
                mockQueryRunner.manager.save.mockResolvedValue(mockCred);

                const result = await service.createPasswordCredential(createPasswordDto);

                expect(result).toBeDefined();
                expect(bcrypt.hash).toHaveBeenCalledWith(createPasswordDto.password, 10);
                expect(repository.create).toHaveBeenCalledWith({
                    ...createPasswordDto,
                    passwordHash: 'hashed_password'
                });
                expect(mockQueryRunner.connect).toHaveBeenCalled();
                expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();

                // Verify DTO transformation
                const expectedDto = plainToClass(ResponseLoginCredentialDto, mockCred, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should rollback transaction on error', async () => {
                const error = new Error('Database error');
                mockQueryRunner.manager.save.mockRejectedValue(error);

                await expect(service.createPasswordCredential(createPasswordDto))
                    .rejects
                    .toThrow(error);

                expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();
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
                const mockCred = authMock.credentials.password;
                const isValid = await service.validatePassword(mockCred, 'password123');
                
                expect(isValid).toBe(true);
                expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockCred.passwordHash);
            });

            it('should reject if no password hash exists', async () => {
                const credWithoutHash = { ...authMock.credentials.password, passwordHash: undefined };
                
                const isValid = await service.validatePassword(credWithoutHash, 'password123');
                
                expect(isValid).toBe(false);
                expect(bcrypt.compare).not.toHaveBeenCalled();
            });
        });

        describe('updatePassword', () => {
            const updatePasswordDto: UpdatePasswordCredentialDto = {
                currentPassword: 'oldpass',
                newPassword: 'newpass'
            };

            it('should update password when current password is valid', async () => {
                const mockCred = authMock.credentials.password;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                jest.spyOn(service, 'validatePassword').mockResolvedValue(true);
                mockQueryRunner.manager.save.mockResolvedValue({ ...mockCred, passwordHash: 'new_hash' });

                const result = await service.updatePassword(mockCred.id, updatePasswordDto);

                expect(result).toBeDefined();
                expect(service.validatePassword).toHaveBeenCalledWith(mockCred, updatePasswordDto.currentPassword);
                expect(bcrypt.hash).toHaveBeenCalledWith(updatePasswordDto.newPassword, 10);
                expect(mockQueryRunner.connect).toHaveBeenCalled();
                expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();
            });

            it('should rollback transaction on error', async () => {
                const mockCred = authMock.credentials.password;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                jest.spyOn(service, 'validatePassword').mockResolvedValue(true);
                const error = new Error('Database error');
                mockQueryRunner.manager.save.mockRejectedValue(error);

                await expect(service.updatePassword(mockCred.id, updatePasswordDto))
                    .rejects
                    .toThrow(error);

                expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();
            });

            it('should return null when credential not found', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.updatePassword('nonexistent', updatePasswordDto);

                expect(result).toBeNull();
            });

            it('should throw UnauthorizedException when current password is invalid', async () => {
                const mockCred = authMock.credentials.password;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                jest.spyOn(service, 'validatePassword').mockResolvedValue(false);

                await expect(service.updatePassword(mockCred.id, updatePasswordDto))
                    .rejects
                    .toThrow(UnauthorizedException);
            });

            it('should throw BadRequestException when current password is missing', async () => {
                const mockCred = authMock.credentials.password;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);

                await expect(service.updatePassword(mockCred.id, { newPassword: 'newpass' } as UpdatePasswordCredentialDto))
                    .rejects
                    .toThrow(new BadRequestException('Current password is required'));
            });
        });
    });

    describe('OAuth Credentials', () => {
        describe('createOAuthCredential', () => {
            const createOAuthDto: CreateOAuthCredentialDto = {
                identifier: authMock.credentials.google.identifier,
                loginProviderId: authMock.providers.google.id,
                credentialType: CredentialType.OAUTH,
                provider: OAuthProvider.GOOGLE,
                accessToken: 'access_token',
                accessTokenExpiresAt: new Date(),
                refreshToken: 'refresh_token',
                refreshTokenExpiresAt: new Date(),
                scope: 'email profile',
                rawProfile: { email: 'test@example.com' },
                isEnabled: true
            };

            it('should create OAuth credential', async () => {
                const mockCred = authMock.credentials.google;
                jest.spyOn(repository, 'create').mockReturnValue(mockCred);
                mockQueryRunner.manager.save.mockResolvedValue(mockCred);

                const result = await service.createOAuthCredential(createOAuthDto);

                expect(result).toBeDefined();
                expect(repository.create).toHaveBeenCalledWith(createOAuthDto);
                expect(mockQueryRunner.connect).toHaveBeenCalled();
                expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();

                // Verify DTO transformation
                const expectedDto = plainToClass(ResponseLoginCredentialDto, mockCred, { excludeExtraneousValues: true });
                expect(result).toEqual(expectedDto);
            });

            it('should rollback transaction on error', async () => {
                const error = new Error('Database error');
                mockQueryRunner.manager.save.mockRejectedValue(error);

                await expect(service.createOAuthCredential(createOAuthDto))
                    .rejects
                    .toThrow(error);

                expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();
            });

            it('should reject invalid credential type', async () => {
                const invalidDto = { ...createOAuthDto, credentialType: CredentialType.PASSWORD };

                await expect(service.createOAuthCredential(invalidDto))
                    .rejects
                    .toThrow(BadRequestException);
            });

            it('should handle Apple-specific fields', async () => {
                const appleDto: CreateOAuthCredentialDto = {
                    ...createOAuthDto,
                    provider: OAuthProvider.APPLE,
                    identityToken: 'identity_token',
                    authorizationCode: 'auth_code',
                    realUserStatus: 'real_user',
                    nonce: 'nonce_value'
                };

                const mockCred = {
                    ...authMock.credentials.google,
                    provider: OAuthProvider.APPLE,
                    identityToken: 'identity_token',
                    authorizationCode: 'auth_code',
                    realUserStatus: 'real_user',
                    nonce: 'nonce_value'
                };

                jest.spyOn(repository, 'create').mockReturnValue(mockCred);
                mockQueryRunner.manager.save.mockResolvedValue(mockCred);

                const result = await service.createOAuthCredential(appleDto);

                expect(result).toBeDefined();
                expect(repository.create).toHaveBeenCalledWith(appleDto);
            });
        });

        describe('updateOAuthCredential', () => {
            const updateOAuthDto: UpdateOAuthCredentialDto = {
                accessToken: 'new_access_token',
                refreshToken: 'new_refresh_token'
            };

            it('should update OAuth credential', async () => {
                const mockCred = authMock.credentials.google;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                mockQueryRunner.manager.save.mockResolvedValue({ ...mockCred, ...updateOAuthDto });

                const result = await service.updateOAuthCredential(mockCred.id, updateOAuthDto);

                expect(result).toBeDefined();
                expect(mockQueryRunner.connect).toHaveBeenCalled();
                expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();
            });

            it('should rollback transaction on error', async () => {
                const mockCred = authMock.credentials.google;
                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                const error = new Error('Database error');
                mockQueryRunner.manager.save.mockRejectedValue(error);

                await expect(service.updateOAuthCredential(mockCred.id, updateOAuthDto))
                    .rejects
                    .toThrow(error);

                expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
                expect(mockQueryRunner.release).toHaveBeenCalled();
            });

            it('should return null when credential not found', async () => {
                jest.spyOn(repository, 'findOne').mockResolvedValue(null);

                const result = await service.updateOAuthCredential('nonexistent', updateOAuthDto);

                expect(result).toBeNull();
            });

            it('should handle Apple-specific fields update', async () => {
                const mockCred = {
                    ...authMock.credentials.google,
                    provider: OAuthProvider.APPLE
                };
                const appleUpdateDto: UpdateOAuthCredentialDto = {
                    ...updateOAuthDto,
                    identityToken: 'new_identity_token',
                    authorizationCode: 'new_auth_code'
                };

                jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
                mockQueryRunner.manager.save.mockResolvedValue({ ...mockCred, ...appleUpdateDto });

                const result = await service.updateOAuthCredential(mockCred.id, appleUpdateDto);

                expect(result).toBeDefined();
                expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
                    LoginCredential,
                    expect.objectContaining({
                        identityToken: 'new_identity_token',
                        authorizationCode: 'new_auth_code'
                    })
                );
            });
        });
    });

    describe('Generic Update', () => {
        it('should route password credential update to updatePassword', async () => {
            const updateDto: UpdatePasswordCredentialDto = {
                currentPassword: 'oldpass',
                newPassword: 'newpass'
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(authMock.credentials.password);
            const updatePasswordSpy = jest.spyOn(service, 'updatePassword').mockResolvedValue(authMock.credentials.password);

            await service.update(authMock.credentials.password.id, updateDto);

            expect(updatePasswordSpy).toHaveBeenCalledWith(authMock.credentials.password.id, updateDto);
        });

        it('should route OAuth credential update to updateOAuthCredential', async () => {
            const updateDto: UpdateOAuthCredentialDto = {
                provider: OAuthProvider.GOOGLE,
                accessToken: 'new-token'
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(authMock.credentials.google);
            const updateOAuthSpy = jest.spyOn(service, 'updateOAuthCredential').mockResolvedValue(authMock.credentials.google);

            await service.update(authMock.credentials.google.id, updateDto);

            expect(updateOAuthSpy).toHaveBeenCalledWith(authMock.credentials.google.id, updateDto);
        });

        it('should handle generic updates', async () => {
            const updateDto = { isEnabled: false };
            const mockCred = authMock.credentials.password;
            const updatedCred = { ...mockCred, ...updateDto };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedCred);

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
        });

        it('should return null for non-existent credential', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.update('nonexistent', { isEnabled: false });

            expect(result).toBeNull();
        });

        it('should handle password credential update with non-password DTO', async () => {
            const updateDto: UpdateOAuthCredentialDto = {
                provider: OAuthProvider.GOOGLE,
                accessToken: 'token',
                accessTokenExpiresAt: new Date(),
                refreshToken: 'refresh-token',
                refreshTokenExpiresAt: new Date()
            };
            const mockCred = authMock.credentials.password;

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({ ...mockCred, ...updateDto });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
        });

        it('should handle OAuth credential update with non-OAuth DTO', async () => {
            const updateDto: UpdatePasswordCredentialDto = {
                currentPassword: 'oldpass',
                newPassword: 'newpass'
            };
            const mockCred = authMock.credentials.google;

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({ ...mockCred, ...updateDto });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
        });

        it('should handle generic update for password credential with mismatched DTO', async () => {
            const updateDto = { isEnabled: false };
            const mockCred = authMock.credentials.password;

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: false
            });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: false
            }));
        });

        it('should handle generic update for OAuth credential with mismatched DTO', async () => {
            const updateDto = { isEnabled: false };
            const mockCred = authMock.credentials.google;

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: false
            });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: false
            }));
        });

        it('should handle password credential update with partial password DTO', async () => {
            const updateDto: Partial<UpdatePasswordCredentialDto> = { currentPassword: 'oldpass' };  // Missing newPassword
            const mockCred = { ...authMock.credentials.password };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: false
            });

            const result = await service.update(mockCred.id, { ...updateDto, isEnabled: false });

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalled();
            const saveArg = jest.mocked(repository.save).mock.calls[0][0];
            expect(saveArg).toHaveProperty('isEnabled', false);
        });

        it('should handle OAuth credential update with partial OAuth DTO', async () => {
            const updateDto: Partial<UpdateOAuthCredentialDto> = { provider: OAuthProvider.GOOGLE };  // Missing tokens
            const mockCred = { ...authMock.credentials.google };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: false
            });

            const result = await service.update(mockCred.id, { ...updateDto, isEnabled: false });

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalled();
            const saveArg = jest.mocked(repository.save).mock.calls[0][0];
            expect(saveArg).toHaveProperty('isEnabled', false);
        });

        it('should handle password-like DTO for non-password credential type', async () => {
            const updateDto = { currentPassword: 'oldpass', isEnabled: false };
            const mockCred = { 
                ...authMock.credentials.password,
                credentialType: CredentialType.OAUTH  // Credential with wrong type
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: false
            });
            jest.spyOn(service, 'updatePassword').mockResolvedValue(null);

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(service.updatePassword).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: false
            }));
        });

        it('should handle oauth-like DTO for non-oauth credential type', async () => {
            const updateDto = { provider: OAuthProvider.GOOGLE, isEnabled: false };
            const mockCred = { 
                ...authMock.credentials.google,
                credentialType: CredentialType.PASSWORD  // Credential with wrong type
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: false
            });
            jest.spyOn(service, 'updateOAuthCredential').mockResolvedValue(null);

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(service.updateOAuthCredential).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: false
            }));
        });

        it('should handle password credential with oauth-like DTO fields', async () => {
            const updateDto = { 
                isEnabled: true,
                provider: OAuthProvider.GOOGLE,
                accessToken: 'token',
                currentPassword: undefined  // Explicitly undefined to avoid triggering password update
            } as unknown as UpdateLoginCredentialDto;
            const mockCred = { 
                ...authMock.credentials.password,
                isEnabled: true  // Match the DTO
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: true
            });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: true
            }));
        });

        it('should handle oauth credential with password-like DTO fields', async () => {
            const updateDto = { 
                isEnabled: true,
                currentPassword: 'oldpass',
                newPassword: 'newpass',
                provider: undefined  // Explicitly undefined to avoid triggering oauth update
            } as unknown as UpdateLoginCredentialDto;
            const mockCred = { 
                ...authMock.credentials.google,
                isEnabled: true  // Match the DTO
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: true
            });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: true
            }));
        });

        it('should not call updatePassword when password credential has oauth fields', async () => {
            const updateDto = { 
                isEnabled: true,
                provider: OAuthProvider.GOOGLE
            } as UpdateLoginCredentialDto;
            const mockCred = { 
                ...authMock.credentials.password,
                isEnabled: false
            };

            const updatePasswordSpy = jest.spyOn(service, 'updatePassword');
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: true
            });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(updatePasswordSpy).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: true
            }));
        });

        it('should not call updateOAuthCredential when oauth credential has password fields', async () => {
            const updateDto = { 
                isEnabled: true,
                currentPassword: 'oldpass'
            } as UpdateLoginCredentialDto;
            const mockCred = { 
                ...authMock.credentials.google,
                isEnabled: false
            };

            const updateOAuthSpy = jest.spyOn(service, 'updateOAuthCredential');
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockCred);
            jest.spyOn(repository, 'save').mockResolvedValue({
                ...mockCred,
                isEnabled: true
            });

            const result = await service.update(mockCred.id, updateDto);

            expect(result).toBeDefined();
            expect(updateOAuthSpy).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                ...mockCred,
                isEnabled: true
            }));
        });
    });

    describe('Remove', () => {
        it('should handle undefined affected rows when removing', async () => {
            const mockId = 'test-id';
            jest.spyOn(repository, 'delete').mockResolvedValue({
                affected: undefined,
                raw: undefined
            });

            const result = await service.remove(mockId);

            expect(result).toBe(false);
            expect(repository.delete).toHaveBeenCalledWith(mockId);
        });

        it('should return false when no rows were affected', async () => {
            const mockId = 'test-id';
            jest.spyOn(repository, 'delete').mockResolvedValue({
                affected: 0,
                raw: undefined
            });

            const result = await service.remove(mockId);

            expect(result).toBe(false);
            expect(repository.delete).toHaveBeenCalledWith(mockId);
        });

        it('should return true when rows were affected', async () => {
            const mockId = 'test-id';
            jest.spyOn(repository, 'delete').mockResolvedValue({
                affected: 1,
                raw: undefined
            });

            const result = await service.remove(mockId);

            expect(result).toBe(true);
            expect(repository.delete).toHaveBeenCalledWith(mockId);
        });
    });
}); 
