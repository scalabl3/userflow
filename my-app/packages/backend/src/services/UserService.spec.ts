import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './UserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/User';
import { Repository } from 'typeorm';

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Add more tests for each method
});
