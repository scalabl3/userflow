import { Test, TestingModule } from '@nestjs/testing';
import { LoginProviderService } from './LoginProviderService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginProvider } from '../models/LoginProvider';
import { Repository } from 'typeorm';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';

describe('LoginProviderService', () => {
    let service: LoginProviderService;
    let repository: Repository<LoginProvider>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginProviderService,
                {
                    provide: getRepositoryToken(LoginProvider),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<LoginProviderService>(LoginProviderService);
        repository = module.get<Repository<LoginProvider>>(getRepositoryToken(LoginProvider));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Add more tests for each CRUD operation
});
