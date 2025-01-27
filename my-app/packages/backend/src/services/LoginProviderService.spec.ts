import { Test, TestingModule } from '@nestjs/testing';
import { LoginProviderService } from './LoginProviderService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { mockRepository } from '../test/setup';

describe('LoginProviderService', () => {
    let service: LoginProviderService;
    let repository: Repository<LoginProvider>;

    const mockLoginProvider: LoginProvider = {
        id: '123',
        code: 'email',
        name: 'Email and Password',
        isEnabled: true,
        createdAt: new Date(),
        modifiedAt: new Date()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginProviderService,
                {
                    provide: getRepositoryToken(LoginProvider),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<LoginProviderService>(LoginProviderService);
        repository = module.get<Repository<LoginProvider>>(getRepositoryToken(LoginProvider));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a login provider', async () => {
            const createDto: CreateLoginProviderDto = {
                code: 'email',
                name: 'Email and Password',
                isEnabled: true
            };

            jest.spyOn(repository, 'create').mockReturnValue(mockLoginProvider);
            jest.spyOn(repository, 'save').mockResolvedValue(mockLoginProvider);

            const result = await service.create(createDto);
            expect(result).toEqual(mockLoginProvider);
            expect(repository.create).toHaveBeenCalledWith(createDto);
            expect(repository.save).toHaveBeenCalled();
        });

        it('should not allow duplicate provider codes', async () => {
            const createDto: CreateLoginProviderDto = {
                code: 'email',
                name: 'Email and Password',
                isEnabled: true
            };

            // Mock the save to throw a unique constraint violation
            jest.spyOn(repository, 'save').mockRejectedValue(new QueryFailedError(
                'query',
                [],
                new Error('duplicate key value violates unique constraint "UQ_login_provider_code"')
            ));

            await expect(service.create(createDto)).rejects.toThrow();
        });
    });

    describe('findAll', () => {
        it('should return an array of login providers', async () => {
            const providers = [mockLoginProvider];
            jest.spyOn(repository, 'find').mockResolvedValue(providers);

            const result = await service.findAll();
            expect(result).toEqual(providers);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a login provider by id', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockLoginProvider);

            const result = await service.findOne('123');
            expect(result).toEqual(mockLoginProvider);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: '123' });
        });

        it('should return null if provider not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            const result = await service.findOne('456');
            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update a login provider', async () => {
            const updateDto: UpdateLoginProviderDto = {
                name: 'Updated Email Provider',
                isEnabled: false
            };
            const updatedProvider = { ...mockLoginProvider, ...updateDto };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockLoginProvider);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedProvider);

            const result = await service.update('123', updateDto);
            expect(result).toEqual(updatedProvider);
        });

        it('should return null if provider not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            const result = await service.update('456', { name: 'Updated' });
            expect(result).toBeNull();
        });
    });

    describe('remove', () => {
        it('should delete a login provider', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

            const result = await service.remove('123');
            expect(result).toBe(true);
            expect(repository.delete).toHaveBeenCalledWith('123');
        });

        it('should return false when no provider was deleted', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            const result = await service.remove('456');
            expect(result).toBe(false);
            expect(repository.delete).toHaveBeenCalledWith('456');
        });

        it('should handle undefined affected rows gracefully', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ raw: [] });

            const result = await service.remove('789');
            expect(result).toBe(false);
            expect(repository.delete).toHaveBeenCalledWith('789');
        });
    });
});
