import { Test, TestingModule } from '@nestjs/testing';
import { LoginCredentialService } from './LoginCredentialService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginCredential, CredentialType } from '../models/LoginCredential';
import { Repository, DeepPartial } from 'typeorm';
import { CreateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/CreateLoginCredentialDto';
import { UpdateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/UpdateLoginCredentialDto';
import { mockRepository } from '../test/setup';
import { LoginProvider } from '../models/LoginProvider';

describe('LoginCredentialService', () => {
    let service: LoginCredentialService;
    let repository: Repository<LoginCredential>;

    const mockLoginProvider: LoginProvider = {
        id: 'provider123',
        code: 'email',
        name: 'Email and Password',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    const mockLoginCredential: LoginCredential = {
        id: 'cred123',
        identifier: 'test@example.com',
        loginProviderId: 'provider123',
        loginProvider: mockLoginProvider,
        credentials: 'hashedpassword',
        credentialType: CredentialType.PASSWORD,
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
        expiresAt: undefined
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
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all login credentials with providers', async () => {
            const credentials = [mockLoginCredential];
            jest.spyOn(repository, 'find').mockResolvedValue(credentials);

            const result = await service.findAll();
            expect(result).toEqual(credentials);
            expect(repository.find).toHaveBeenCalledWith({
                relations: ['loginProvider']
            });
        });
    });

    describe('findOne', () => {
        it('should return a login credential by id with provider', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(mockLoginCredential);

            const result = await service.findOne('cred123');
            expect(result).toEqual(mockLoginCredential);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: 'cred123' },
                relations: ['loginProvider']
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
            const identifier = 'test@example.com';
            const loginProviderId = 'provider123';
            const expectedCredential = {
                id: 'cred123',
                identifier,
                loginProviderId,
                credentials: 'hashedPassword',
                credentialType: CredentialType.PASSWORD,
                isEnabled: true,
                createdAt: new Date(),
                modifiedAt: new Date(),
                loginProvider: {
                    id: loginProviderId,
                    code: 'email',
                    name: 'Email Provider',
                    isEnabled: true,
                    createdAt: new Date(),
                    modifiedAt: new Date()
                }
            };

            jest.spyOn(repository, 'findOne').mockResolvedValue(expectedCredential);

            const result = await service.findByIdentifierAndProvider(identifier, loginProviderId);

            expect(result).toEqual(expectedCredential);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { identifier, loginProviderId },
                relations: ['loginProvider']
            });
        });

        it('should return null when no credential matches identifier and provider', async () => {
            const identifier = 'nonexistent@example.com';
            const loginProviderId = 'provider123';

            jest.spyOn(repository, 'findOne').mockResolvedValue(null);

            const result = await service.findByIdentifierAndProvider(identifier, loginProviderId);

            expect(result).toBeNull();
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { identifier, loginProviderId },
                relations: ['loginProvider']
            });
        });
    });

    describe('create', () => {
        it('should create a login credential with all fields', async () => {
            const createDto: CreateLoginCredentialDto = {
                identifier: 'test@example.com',
                loginProviderId: 'provider123',
                credentials: 'hashedpassword',
                credentialType: CredentialType.PASSWORD,
                expiresAt: new Date('2024-12-31'),
                isEnabled: true
            };

            const expectedCredential = { ...mockLoginCredential, expiresAt: createDto.expiresAt };
            jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

            const result = await service.create(createDto);
            expect(result).toEqual(expectedCredential);
            expect(repository.create).toHaveBeenCalledWith(createDto);
        });

        it('should create a login credential with default isEnabled', async () => {
            const createDto: CreateLoginCredentialDto = {
                identifier: 'test@example.com',
                loginProviderId: 'provider123',
                credentials: 'hashedpassword',
                credentialType: CredentialType.PASSWORD
            };

            const expectedCredential = { ...mockLoginCredential, isEnabled: true };
            jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

            const result = await service.create(createDto);
            expect(result.isEnabled).toBe(true);
        });

        it('should create an access token credential with expiration', async () => {
            const expiresAt = new Date('2024-12-31');
            const createDto: CreateLoginCredentialDto = {
                identifier: 'user@example.com',
                loginProviderId: 'provider123',
                credentials: 'access_token_value',
                credentialType: CredentialType.ACCESS_TOKEN,
                expiresAt
            };

            const expectedCredential = {
                ...mockLoginCredential,
                identifier: createDto.identifier,
                credentials: createDto.credentials,
                credentialType: createDto.credentialType,
                expiresAt
            };

            jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

            const result = await service.create(createDto);
            expect(result.credentialType).toBe(CredentialType.ACCESS_TOKEN);
            expect(result.expiresAt).toEqual(expiresAt);
        });

        it('should create a refresh token credential with longer expiration', async () => {
            const expiresAt = new Date('2025-12-31');
            const createDto: CreateLoginCredentialDto = {
                identifier: 'user@example.com',
                loginProviderId: 'provider123',
                credentials: 'refresh_token_value',
                credentialType: CredentialType.REFRESH_TOKEN,
                expiresAt
            };

            const expectedCredential = {
                ...mockLoginCredential,
                identifier: createDto.identifier,
                credentials: createDto.credentials,
                credentialType: createDto.credentialType,
                expiresAt
            };

            jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

            const result = await service.create(createDto);
            expect(result.credentialType).toBe(CredentialType.REFRESH_TOKEN);
            expect(result.expiresAt).toEqual(expiresAt);
        });

        it('should create a password credential without expiration', async () => {
            const createDto: CreateLoginCredentialDto = {
                identifier: 'user@example.com',
                loginProviderId: 'provider123',
                credentials: 'hashedpassword',
                credentialType: CredentialType.PASSWORD
            };

            const expectedCredential = {
                ...mockLoginCredential,
                identifier: createDto.identifier,
                credentials: createDto.credentials,
                credentialType: createDto.credentialType,
                expiresAt: undefined
            };

            jest.spyOn(repository, 'create').mockReturnValue(expectedCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(expectedCredential);

            const result = await service.create(createDto);
            expect(result.credentialType).toBe(CredentialType.PASSWORD);
            expect(result.expiresAt).toBeUndefined();
        });
    });

    describe('update', () => {
        it('should update only provided fields', async () => {
            const updateDto: UpdateLoginCredentialDto = {
                identifier: 'updated@example.com',
                isEnabled: false
            };

            const existingCredential = { ...mockLoginCredential };
            const updatedCredential = {
                ...existingCredential,
                identifier: updateDto.identifier!,
                isEnabled: updateDto.isEnabled!
            };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedCredential);

            const result = await service.update('cred123', updateDto);
            expect(result).toEqual(updatedCredential);
            expect(result?.credentials).toBe(existingCredential.credentials);
            expect(result?.credentialType).toBe(existingCredential.credentialType);
        });

        it('should update all possible fields when provided', async () => {
            const updateDto: UpdateLoginCredentialDto = {
                identifier: 'new@example.com',
                loginProviderId: 'newProvider123',
                credentials: 'newHashedPassword',
                credentialType: CredentialType.ACCESS_TOKEN,
                expiresAt: new Date('2025-01-01'),
                isEnabled: false
            };

            const existingCredential = { ...mockLoginCredential };
            const updatedCredential = { ...existingCredential, ...updateDto };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedCredential);

            const result = await service.update('cred123', updateDto);
            expect(result).toEqual(updatedCredential);
            expect(result?.identifier).toBe(updateDto.identifier);
            expect(result?.loginProviderId).toBe(updateDto.loginProviderId);
            expect(result?.credentials).toBe(updateDto.credentials);
            expect(result?.credentialType).toBe(updateDto.credentialType);
            expect(result?.expiresAt).toBe(updateDto.expiresAt);
            expect(result?.isEnabled).toBe(updateDto.isEnabled);
        });

        it('should not update fields when undefined is provided', async () => {
            const updateDto: UpdateLoginCredentialDto = {
                identifier: undefined,
                loginProviderId: undefined,
                credentials: undefined,
                credentialType: undefined,
                expiresAt: undefined,
                isEnabled: undefined
            };

            const existingCredential = { ...mockLoginCredential };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingCredential);
            jest.spyOn(repository, 'save').mockResolvedValue(existingCredential);

            const result = await service.update('cred123', updateDto);
            expect(result).toEqual(existingCredential);
            expect(result?.identifier).toBe(existingCredential.identifier);
            expect(result?.loginProviderId).toBe(existingCredential.loginProviderId);
            expect(result?.credentials).toBe(existingCredential.credentials);
            expect(result?.credentialType).toBe(existingCredential.credentialType);
            expect(result?.expiresAt).toBe(existingCredential.expiresAt);
            expect(result?.isEnabled).toBe(existingCredential.isEnabled);
        });

        it('should return null if credential not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            const result = await service.update('nonexistent', { isEnabled: false });
            expect(result).toBeNull();
        });
    });

    describe('remove', () => {
        it('should delete a login credential', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            const result = await service.remove('cred123');
            expect(result).toBe(true);
            expect(repository.delete).toHaveBeenCalledWith('cred123');
        });

        it('should return false when no credential was deleted', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            const result = await service.remove('nonexistent');
            expect(result).toBe(false);
        });

        it('should handle undefined affected rows gracefully', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ raw: [] });

            const result = await service.remove('cred123');
            expect(result).toBe(false);
        });
    });
});
