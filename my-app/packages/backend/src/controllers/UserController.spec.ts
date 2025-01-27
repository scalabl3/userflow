import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './UserController';
import { UserService } from '../services/UserService';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn(),
                        findUserById: jest.fn(),
                        updateUser: jest.fn(),
                        deleteUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    // Add more tests for each endpoint
});
