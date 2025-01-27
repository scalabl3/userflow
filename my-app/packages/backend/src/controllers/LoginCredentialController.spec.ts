import { Test, TestingModule } from '@nestjs/testing';
import { LoginCredentialController } from './LoginCredentialController';
import { LoginCredentialService } from '../services/LoginCredentialService';

describe('LoginCredentialController', () => {
    let controller: LoginCredentialController;
    let service: LoginCredentialService;

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

    // Add more tests here
});
