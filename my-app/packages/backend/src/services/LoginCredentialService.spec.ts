import { Test, TestingModule } from '@nestjs/testing';
import { LoginCredentialService } from './LoginCredentialService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginCredential } from '../models/LoginCredential';
import { Repository } from 'typeorm';

describe('LoginCredentialService', () => {
    let service: LoginCredentialService;
    let repository: Repository<LoginCredential>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginCredentialService,
                {
                    provide: getRepositoryToken(LoginCredential),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<LoginCredentialService>(LoginCredentialService);
        repository = module.get<Repository<LoginCredential>>(getRepositoryToken(LoginCredential));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Add more tests here
});
