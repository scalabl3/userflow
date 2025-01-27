import { Test, TestingModule } from '@nestjs/testing';
import { LoginProviderController } from './LoginProviderController';
import { LoginProviderService } from '../services/LoginProviderService';
import { CreateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/CreateLoginProviderDto';
import { UpdateLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/UpdateLoginProviderDto';
import { ResponseLoginProviderDto } from '@my-app/shared/dist/dtos/LoginProvider/ResponseLoginProviderDto';

describe('LoginProviderController', () => {
    let controller: LoginProviderController;
    let service: LoginProviderService;

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

    // Add more tests for each CRUD operation
});
