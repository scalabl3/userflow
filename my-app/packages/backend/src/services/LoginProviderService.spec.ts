import { Test, TestingModule } from '@nestjs/testing';
import { LoginProviderService } from './LoginProviderService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { mockRepository } from '../test/setup';
import { auth as authMock } from '../models/test/__mocks__/auth.mock';

describe('LoginProviderService', () => {
    let service: LoginProviderService;
    let repository: Repository<LoginProvider>;

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
                code: authMock.providers.email.code,
                name: authMock.providers.email.name,
                isEnabled: true
            };

            jest.spyOn(repository, 'create').mockReturnValue(authMock.providers.email);
            jest.spyOn(repository, 'save').mockResolvedValue(authMock.providers.email);

            const result = await service.create(createDto);
            expect(result).toEqual(authMock.providers.email);
        });

        it('should not allow duplicate provider codes', async () => {
            const createDto: CreateLoginProviderDto = {
                code: authMock.providers.email.code,
                name: authMock.providers.email.name,
                isEnabled: true
            };

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
            const providers = [authMock.providers.email];
            jest.spyOn(repository, 'find').mockResolvedValue(providers);

            const result = await service.findAll();
            expect(result).toEqual(providers);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a login provider by id', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(authMock.providers.email);

            const result = await service.findOne(authMock.providers.email.id);
            expect(result).toEqual(authMock.providers.email);
            expect(repository.findOneBy).toHaveBeenCalledWith({ id: authMock.providers.email.id });
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
            const updatedProvider = { ...authMock.providers.email, ...updateDto };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(authMock.providers.email);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedProvider);

            const result = await service.update(authMock.providers.email.id, updateDto);
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

            const result = await service.remove(authMock.providers.email.id);
            expect(result).toBe(true);
            expect(repository.delete).toHaveBeenCalledWith(authMock.providers.email.id);
        });

        it('should return false when no provider was deleted', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            const result = await service.remove('456');
            expect(result).toBe(false);
        });

        it('should handle undefined affected rows gracefully', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ raw: [] });

            const result = await service.remove('789');
            expect(result).toBe(false);
        });
    });
});
