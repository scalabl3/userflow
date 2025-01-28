import { Test, TestingModule } from '@nestjs/testing';
import { BaseUserController } from './BaseUserController';
import { BaseUserService } from '../services/BaseUserService';
import { CreateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/CreateBaseUserDto';
import { UpdateBaseUserDto } from '@my-app/shared/dist/dtos/BaseUser/UpdateBaseUserDto';
import { user as userMock } from '../test/__mocks__/user.mock';
import { auth as authMock } from '../test/__mocks__/auth.mock';

describe('BaseUserController', () => {
    let controller: BaseUserController;
    let service: BaseUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BaseUserController],
            providers: [
                {
                    provide: BaseUserService,
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

        controller = module.get<BaseUserController>(BaseUserController);
        service = module.get<BaseUserService>(BaseUserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a base user', async () => {
            const createBaseUserDto: CreateBaseUserDto = {
                firstname: userMock.base.firstname,
                lastname: userMock.base.lastname,
                contactEmail: userMock.base.contactEmail,
                primaryLoginCredentialId: authMock.credentials.password.id
            };

            jest.spyOn(service, 'create').mockResolvedValue(userMock.base);

            const result = await controller.create(createBaseUserDto);

            expect(result).toEqual(userMock.base);
            expect(service.create).toHaveBeenCalledWith(createBaseUserDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of base users', async () => {
            const baseUsers = [userMock.base];
            jest.spyOn(service, 'findAll').mockResolvedValue(baseUsers);

            const result = await controller.findAll();

            expect(result).toEqual(baseUsers);
            expect(service.findAll).toHaveBeenCalled();
        });

        it('should return empty array when no users exist', async () => {
            jest.spyOn(service, 'findAll').mockResolvedValue([]);

            const result = await controller.findAll();

            expect(result).toEqual([]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a base user by id', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(userMock.base);

            const result = await controller.findOne(userMock.base.id);

            expect(result).toEqual(userMock.base);
            expect(service.findOne).toHaveBeenCalledWith(userMock.base.id);
        });

        it('should return null when user not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue(null);

            const result = await controller.findOne('nonexistent-id');

            expect(result).toBeNull();
            expect(service.findOne).toHaveBeenCalledWith('nonexistent-id');
        });
    });

    describe('update', () => {
        it('should update a base user', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated',
                lastname: 'Name'
            };

            const updatedUser = {
                ...userMock.base,
                ...updateBaseUserDto
            };

            jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

            const result = await controller.update(userMock.base.id, updateBaseUserDto);

            expect(result).toEqual(updatedUser);
            expect(service.update).toHaveBeenCalledWith(userMock.base.id, updateBaseUserDto);
        });

        it('should return null when user not found', async () => {
            const updateBaseUserDto: UpdateBaseUserDto = {
                firstname: 'Updated'
            };

            jest.spyOn(service, 'update').mockResolvedValue(null);

            const result = await controller.update('nonexistent-id', updateBaseUserDto);

            expect(result).toBeNull();
            expect(service.update).toHaveBeenCalledWith('nonexistent-id', updateBaseUserDto);
        });
    });

    describe('remove', () => {
        it('should remove a base user', async () => {
            jest.spyOn(service, 'remove').mockResolvedValue(undefined);

            await controller.remove(userMock.base.id);

            expect(service.remove).toHaveBeenCalledWith(userMock.base.id);
        });
    });
}); 