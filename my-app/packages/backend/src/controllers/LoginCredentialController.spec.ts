import { Test, TestingModule } from '@nestjs/testing';
import { LoginCredentialController } from './LoginCredentialController';
import { LoginCredentialService } from '../services/LoginCredentialService';
import { CreateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/CreateLoginCredentialDto';
import { UpdateLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/UpdateLoginCredentialDto';
import { ResponseLoginCredentialDto } from '@my-app/shared/dist/dtos/LoginCredential/ResponseLoginCredentialDto';
import { CredentialType } from '../models/LoginCredential';
import { LoginProvider } from '../models/LoginProvider';

describe('LoginCredentialController', () => {
    let controller: LoginCredentialController;
    let service: LoginCredentialService;

    const mockLoginProvider: LoginProvider = {
        id: 'provider-id',
        code: 'email',
        name: 'Email Provider',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    const mockLoginCredential = {
        id: 'test-id',
        identifier: 'test@example.com',
        loginProviderId: mockLoginProvider.id,
        loginProvider: mockLoginProvider,
        credentials: 'hashedPassword123',
        credentialType: CredentialType.PASSWORD,
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginCredentialController],
            providers: [
                {
                    provide: LoginCredentialService,
                    useValue: {
                        create: jest.fn(),
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
        const createDto: CreateLoginCredentialDto = {
            identifier: 'test@example.com',
            loginProviderId: mockLoginProvider.id,
            credentials: 'password123',
            credentialType: CredentialType.PASSWORD,
            isEnabled: true,
        };

        it('should create a login credential', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(mockLoginCredential);
            
            const result = await controller.create(createDto);
            
            expect(result).toEqual(mockLoginCredential);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(new Error('Failed to create'));
            
            await expect(controller.create(createDto)).rejects.toThrow('Failed to create');
        });
    });

    describe('findAll', () => {
        it('should return an array of login credentials', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([mockLoginCredential]);
            
            const result = await controller.findAll();
            
            expect(result).toEqual([mockLoginCredential]);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Failed to find'));
            
            await expect(controller.findAll()).rejects.toThrow('Failed to find');
        });
    });

    describe('findOne', () => {
        it('should return a single login credential', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockLoginCredential);
            
            const result = await controller.findOne('test-id');
            
            expect(result).toEqual(mockLoginCredential);
            expect(service.findOne).toHaveBeenCalledWith('test-id');
        });

        it('should throw error when credential does not exist', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);
            
            await expect(controller.findOne('test-id')).rejects.toThrow('LoginCredential not found');
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error('Failed to find'));
            
            await expect(controller.findOne('test-id')).rejects.toThrow('Failed to find');
        });
    });

    describe('update', () => {
        const updateDto: UpdateLoginCredentialDto = {
            credentials: 'newPassword123',
            isEnabled: false,
        };

        it('should update a login credential', async () => {
            const updatedCredential = { ...mockLoginCredential, ...updateDto };
            jest.spyOn(service, 'update').mockResolvedValue(updatedCredential);
            
            const result = await controller.update('test-id', updateDto);
            
            expect(result).toEqual(updatedCredential);
            expect(service.update).toHaveBeenCalledWith('test-id', updateDto);
        });

        it('should throw error when credential does not exist', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);
            
            await expect(controller.update('test-id', updateDto)).rejects.toThrow('LoginCredential not found');
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new Error('Failed to update'));
            
            await expect(controller.update('test-id', updateDto)).rejects.toThrow('Failed to update');
        });
    });

    describe('remove', () => {
        it('should remove a login credential', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);
            
            const result = await controller.remove('test-id');
            
            expect(result).toBe(true);
            expect(service.remove).toHaveBeenCalledWith('test-id');
        });

        it('should return false when credential does not exist', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);
            
            const result = await controller.remove('test-id');
            expect(result).toBe(false);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new Error('Failed to remove'));
            
            await expect(controller.remove('test-id')).rejects.toThrow('Failed to remove');
        });
    });
});
