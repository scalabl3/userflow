import { Test, TestingModule } from '@nestjs/testing';
import { LoginCredentialController } from './LoginCredentialController';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { LoginCredential } from '../models/LoginCredential';
import { LoginProvider } from '../models/LoginProvider';
import { 
    CreateLoginCredentialDto,
    CreatePasswordCredentialDto,
    CreateOAuthCredentialDto
} from '@my-app/shared/dist/dtos/LoginCredential/CreateLoginCredentialDto';
import { UpdateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/UpdateLoginCredentialDto';
import { ResponseLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/ResponseLoginCredentialDto';
import { CredentialType, OAuthProvider } from '@my-app/shared/dist/enums';
import { BadRequestException } from '@nestjs/common';

describe('LoginCredentialController', () => {
    let controller: LoginCredentialController;
    let service: LoginCredentialService;

    const mockLoginProvider: LoginProvider = {
        id: 'provider123',
        code: 'email',
        name: 'Email Provider',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    } as LoginProvider;

    const mockPasswordCredential: LoginCredential = {
        id: 'cred123',
        identifier: 'john@example.com',
        loginProviderId: mockLoginProvider.id,
        loginProvider: mockLoginProvider,
        credentialType: CredentialType.PASSWORD,
        passwordHash: 'hashedpassword',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    } as LoginCredential;

    const mockGoogleCredential: LoginCredential = {
        id: 'cred456',
        identifier: '12345',
        loginProviderId: 'google-provider-id',
        loginProvider: {
            id: 'google-provider-id',
            code: 'google',
            name: 'Google',
            isEnabled: true,
            createdAt: new Date(),
            modifiedAt: new Date()
        },
        credentialType: CredentialType.OAUTH,
        provider: OAuthProvider.GOOGLE,
        accessToken: 'google_access_token',
        refreshToken: 'google_refresh_token',
        accessTokenExpiresAt: new Date(Date.now() + 3600000),
        refreshTokenExpiresAt: new Date(Date.now() + 7200000),
        scope: 'email profile',
        rawProfile: { email: 'john@gmail.com', name: 'John Doe' },
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    } as LoginCredential;

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
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<LoginCredentialController>(LoginCredentialController);
        service = module.get<LoginCredentialService>(LoginCredentialService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a password credential', async () => {
            const createPasswordDto: CreatePasswordCredentialDto = {
                identifier: 'john@example.com',
                loginProviderId: mockLoginProvider.id,
                credentialType: CredentialType.PASSWORD,
                password: 'Password123!',
                isEnabled: true
            };

            jest.spyOn(service, 'createPasswordCredential').mockResolvedValue(mockPasswordCredential);

            const result = await controller.create(createPasswordDto);
            expect(result).toEqual(mockPasswordCredential);
            expect(service.createPasswordCredential).toHaveBeenCalledWith(createPasswordDto);
        });

        it('should create an OAuth credential', async () => {
            const createOAuthDto: CreateOAuthCredentialDto = {
                identifier: '12345',
                loginProviderId: 'google-provider-id',
                credentialType: CredentialType.OAUTH,
                provider: OAuthProvider.GOOGLE,
                accessToken: 'google_access_token',
                accessTokenExpiresAt: new Date(Date.now() + 3600000),
                refreshToken: 'google_refresh_token',
                refreshTokenExpiresAt: new Date(Date.now() + 7200000),
                scope: 'email profile',
                rawProfile: { email: 'john@gmail.com', name: 'John Doe' },
                isEnabled: true
            };

            jest.spyOn(service, 'createOAuthCredential').mockResolvedValue(mockGoogleCredential);

            const result = await controller.create(createOAuthDto);
            expect(result).toEqual(mockGoogleCredential);
            expect(service.createOAuthCredential).toHaveBeenCalledWith(createOAuthDto);
        });

        it('should throw BadRequestException for invalid credential type', async () => {
            const invalidDto: CreateLoginCredentialDto = {
                identifier: 'test',
                loginProviderId: 'provider123',
                credentialType: CredentialType.PHONE,
                isEnabled: true
            };

            await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return an array of login credentials', async () => {
            const credentials = [mockPasswordCredential, mockGoogleCredential];
            jest.spyOn(service, 'findAll').mockResolvedValue(credentials);

            const result = await controller.findAll();
            expect(result).toEqual(credentials);
        });
    });

    describe('findOne', () => {
        it('should return a single login credential', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockPasswordCredential);

            const result = await controller.findOne('cred123');
            expect(result).toEqual(mockPasswordCredential);
        });

        it('should throw BadRequestException if credential not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);

            await expect(controller.findOne('nonexistent')).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update a login credential', async () => {
            const updateDto: UpdateLoginCredentialDto = {
                isEnabled: false
            };

            jest.spyOn(service, 'update').mockResolvedValue(mockPasswordCredential);

            const result = await controller.update('cred123', updateDto);
            expect(result).toEqual(mockPasswordCredential);
            expect(service.update).toHaveBeenCalledWith('cred123', updateDto);
        });

        it('should throw BadRequestException if credential not found', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);

            await expect(controller.update('nonexistent', {})).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should remove a login credential', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            const result = await controller.remove('cred123');
            expect(result).toBe(true);
            expect(service.remove).toHaveBeenCalledWith('cred123');
        });
    });
});
