import { Test, TestingModule } from '@nestjs/testing';
import { LoginProviderController } from './LoginProviderController';
import { LoginProviderService } from '../services/LoginProviderService';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LoginProviderController', () => {
    let controller: LoginProviderController;
    let service: LoginProviderService;

    const mockLoginProvider = {
        id: 'test-id',
        code: 'email',
        name: 'Email and Password',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginProviderController],
            providers: [
                {
                    provide: LoginProviderService,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<LoginProviderController>(LoginProviderController);
        service = module.get<LoginProviderService>(LoginProviderService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of login providers', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([mockLoginProvider]);
            
            const result = await controller.findAll();
            
            expect(result).toEqual([mockLoginProvider]);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findAll').mockRejectedValue(new Error());
            
            await expect(controller.findAll()).rejects.toThrow(
                new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    describe('findOne', () => {
        it('should return a single login provider', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(mockLoginProvider);
            
            const result = await controller.findOne('test-id');
            
            expect(result).toEqual(mockLoginProvider);
            expect(service.findOne).toHaveBeenCalledWith('test-id');
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);
            
            await expect(controller.findOne('test-id')).rejects.toThrow(
                new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND)
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new Error());
            
            await expect(controller.findOne('test-id')).rejects.toThrow(
                new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    describe('create', () => {
        const createDto: CreateLoginProviderDto = {
            code: 'email',
            name: 'Email and Password',
            isEnabled: true,
        };

        it('should create a login provider', async () => {
            jest.spyOn(service, 'create').mockResolvedValue(mockLoginProvider);
            
            const result = await controller.create(createDto);
            
            expect(result).toEqual(mockLoginProvider);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'create').mockRejectedValue(new Error());
            
            await expect(controller.create(createDto)).rejects.toThrow(
                new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    describe('update', () => {
        const updateDto: UpdateLoginProviderDto = {
            name: 'Updated Email Provider',
            isEnabled: false,
        };

        it('should update a login provider', async () => {
            const updatedProvider = { ...mockLoginProvider, ...updateDto };
            jest.spyOn(service, 'update').mockResolvedValue(updatedProvider);
            
            const result = await controller.update('test-id', updateDto);
            
            expect(result).toEqual(updatedProvider);
            expect(service.update).toHaveBeenCalledWith('test-id', updateDto);
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'update').mockResolvedValue(null);
            
            await expect(controller.update('test-id', updateDto)).rejects.toThrow(
                new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND)
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new Error());
            
            await expect(controller.update('test-id', updateDto)).rejects.toThrow(
                new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    describe('remove', () => {
        it('should remove a login provider', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(true);
            
            await controller.remove('test-id');
            
            expect(service.remove).toHaveBeenCalledWith('test-id');
        });

        it('should throw not found exception when provider does not exist', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(false);
            
            await expect(controller.remove('test-id')).rejects.toThrow(
                new HttpException('LoginProvider not found', HttpStatus.NOT_FOUND)
            );
        });

        it('should handle errors', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new Error());
            
            await expect(controller.remove('test-id')).rejects.toThrow(
                new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });
});
