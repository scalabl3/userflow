import { Test, TestingModule } from '@nestjs/testing';
import { BaseUserService } from './BaseUserService';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BaseUser } from '../models/BaseUser';
import { DataSource, EntityManager, QueryRunner, Repository, FindOneOptions, DeepPartial, ObjectLiteral } from 'typeorm';
import { CreateBaseUserDto, ResponseBaseUserDto, UpdateBaseUserDto } from '@my-app/shared';
import { UserState } from '@my-app/shared';
import { BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { user as userMock } from '../models/test/__mocks__/user.mock';
import { plainToClass } from 'class-transformer';
import { OperationType, ServiceErrorCode } from '../constants/service-operations';

type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockEntityManager = Partial<Record<keyof EntityManager, jest.Mock>>;

describe('BaseUserService', () => {
    let service: BaseUserService;
    let repository: MockRepository<BaseUser>;
    let dataSource: Partial<DataSource>;
    let queryRunner: Partial<QueryRunner>;
    let entityManager: MockEntityManager;

    beforeEach(async () => {
        entityManager = {
            save: jest.fn(),
            remove: jest.fn(),
            transaction: jest.fn(),
        };

        queryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: entityManager as unknown as EntityManager,
        };

        dataSource = {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
        };

        repository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            manager: {
                ...entityManager,
                connection: dataSource as DataSource,
            } as unknown as EntityManager,
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BaseUserService,
                {
                    provide: getRepositoryToken(BaseUser),
                    useValue: repository,
                },
                {
                    provide: DataSource,
                    useValue: dataSource,
                },
            ],
        }).compile();

        service = module.get<BaseUserService>(BaseUserService);

        // Mock the logger to prevent console output during tests
        jest.spyOn(service['serviceLogger'], 'logOperation').mockImplementation(() => {});
        jest.spyOn(service['serviceLogger'], 'logError').mockImplementation(() => {});
        jest.spyOn(service['serviceLogger'], 'logSecurity').mockImplementation(() => {});
        jest.spyOn(service['serviceLogger'], 'logStateChange').mockImplementation(() => {});
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAllBaseUsers', () => {
        const adminUserId = 'admin-user-id';

        it('should return all users with their credentials when admin access', async () => {
            const users = [userMock.base];
            repository.find?.mockResolvedValue(users);

            const result = await service.findAllBaseUsers(adminUserId);
            
            expect(result).toEqual([plainToClass(ResponseBaseUserDto, users[0])]);
            expect(repository.find).toHaveBeenCalledWith({
                relations: ['loginCredentials'],
                where: { deleted: false }
            });
            expect(service['serviceLogger'].logOperation).toHaveBeenCalledWith(
                OperationType.ADMIN,
                'findAllBaseUsers',
                'SUCCESS',
                expect.objectContaining({
                    userId: adminUserId,
                    metadata: { count: users.length }
                })
            );
        });

        it('should throw UnauthorizedException when non-admin access', async () => {
            jest.spyOn(service as any, 'validateAccess')
                .mockRejectedValue(new UnauthorizedException({
                    code: ServiceErrorCode.ACCESS_DENIED,
                    message: 'Access denied',
                    details: { userId: 'non-admin-id' }
                }));

            await expect(service.findAllBaseUsers('non-admin-id'))
                .rejects
                .toThrow(UnauthorizedException);
        });
    });

    describe('findOneBaseUser', () => {
        const userId = 'user-id';

        it('should return user with login credentials when authorized', async () => {
            const user = userMock.base;
            repository.findOne?.mockResolvedValue(user);

            const result = await service.findOneBaseUser(user.id, userId);

            expect(result).toEqual(plainToClass(ResponseBaseUserDto, user));
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: user.id, deleted: false },
                relations: ['loginCredentials']
            });
            expect(service['serviceLogger'].logOperation).toHaveBeenCalledWith(
                OperationType.USER,
                'findOneBaseUser',
                'SUCCESS',
                expect.objectContaining({
                    userId,
                    targetId: user.id
                })
            );
        });

        it('should throw NotFoundException when user not found', async () => {
            repository.findOne?.mockResolvedValue(null);

            await expect(service.findOneBaseUser('nonexistent', userId))
                .rejects
                .toThrow(NotFoundException);
        });

        it('should throw UnauthorizedException when unauthorized access', async () => {
            jest.spyOn(service as any, 'validateAccess')
                .mockRejectedValue(new UnauthorizedException());

            await expect(service.findOneBaseUser(userId, 'unauthorized-id'))
                .rejects
                .toThrow(UnauthorizedException);
        });
    });

    describe('createBaseUser', () => {
        const createUserDto: CreateBaseUserDto = userMock.baseUserDtos.create;

        it('should create a user with default pending state', async () => {
            const savedUser = { ...userMock.base, state: UserState.PENDING };
            repository.create?.mockImplementation(() => savedUser);

            const result = await service.createBaseUser(createUserDto, 'user-id');

            expect(result).toEqual(plainToClass(ResponseBaseUserDto, savedUser));
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(service['serviceLogger'].logOperation).toHaveBeenCalledWith(
                OperationType.USER,
                'createBaseUser',
                'SUCCESS',
                expect.objectContaining({
                    userId: 'user-id',
                    targetId: savedUser.id,
                    changes: ['User created']
                })
            );
        });

        it('should throw BadRequestException when email exists', async () => {
            jest.spyOn(service as any, 'validateUniqueness')
                .mockRejectedValue(new BadRequestException({
                    code: ServiceErrorCode.ALREADY_EXISTS,
                    message: 'BaseUser with this contactEmail already exists'
                }));

            await expect(service.createBaseUser(createUserDto, 'user-id'))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('updateBaseUser', () => {
        const updateDto: UpdateBaseUserDto = userMock.baseUserDtos.update;

        it('should update user when authorized', async () => {
            const updatedUser = { ...userMock.base, ...updateDto };
            repository.findOne?.mockImplementation(async () => userMock.base);
            repository.save = jest.fn().mockResolvedValue(updatedUser);

            const result = await service.updateBaseUser(userMock.base.id, updateDto, 'user-id');

            expect(result).toEqual(plainToClass(ResponseBaseUserDto, updatedUser));
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: userMock.base.id, deleted: false },
                relations: ['loginCredentials']
            });
            expect(service['serviceLogger'].logOperation).toHaveBeenCalledWith(
                OperationType.USER,
                'updateBaseUser',
                'SUCCESS',
                expect.objectContaining({
                    userId: 'user-id',
                    targetId: userMock.base.id
                })
            );
        });

        it('should validate state transition', async () => {
            const invalidStateDto = { ...updateDto, state: UserState.DEACTIVATED };
            repository.findOne?.mockImplementation(async () => ({
                ...userMock.base,
                state: UserState.PENDING
            }));

            await expect(service.updateBaseUser(userMock.base.id, invalidStateDto, 'user-id'))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('removeBaseUser', () => {
        it('should remove user when admin and no active credentials', async () => {
            const user = { ...userMock.base, loginCredentials: [] };
            repository.findOne?.mockImplementation(async () => user);
            repository.remove = jest.fn().mockResolvedValue(user);

            const result = await service.removeBaseUser(user.id, 'admin-id');

            expect(result).toBe(true);
            expect(repository.remove).toHaveBeenCalled();
            expect(service['serviceLogger'].logOperation).toHaveBeenCalledWith(
                OperationType.ADMIN,
                'removeBaseUser',
                'SUCCESS',
                expect.objectContaining({
                    userId: 'admin-id',
                    targetId: user.id,
                    changes: ['User permanently deleted']
                })
            );
        });

        it('should throw BadRequestException when user has active credentials', async () => {
            const user = {
                ...userMock.base,
                loginCredentials: [{ isEnabled: true }]
            };
            repository.findOne?.mockImplementation(async () => user);

            await expect(service.removeBaseUser(user.id, 'admin-id'))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('softDeleteBaseUser', () => {
        it('should soft delete user when admin and no active credentials', async () => {
            const user = { ...userMock.base, loginCredentials: [] };
            repository.findOne?.mockImplementation(async () => user);
            repository.save = jest.fn().mockImplementation(async (entity) => entity);

            await service.softDeleteBaseUser(user.id, 'admin-id');

            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                deleted: true,
                deletedAt: expect.any(Date)
            }));
            expect(service['serviceLogger'].logOperation).toHaveBeenCalledWith(
                OperationType.ADMIN,
                'softDeleteBaseUser',
                'SUCCESS',
                expect.objectContaining({
                    userId: 'admin-id',
                    targetId: user.id
                })
            );
        });

        it('should throw UnauthorizedException when non-admin access', async () => {
            jest.spyOn(service as any, 'validateAccess')
                .mockRejectedValue(new UnauthorizedException());

            await expect(service.softDeleteBaseUser('user-id', 'non-admin-id'))
                .rejects
                .toThrow(UnauthorizedException);
        });
    });

    describe('validateStateTransition', () => {
        const validTransitions = [
            { from: UserState.PENDING, to: UserState.ACTIVE },
            { from: UserState.ACTIVE, to: UserState.SUSPENDED },
            { from: UserState.SUSPENDED, to: UserState.ACTIVE },
            { from: UserState.ACTIVE, to: UserState.DEACTIVATED }
        ];

        const invalidTransitions = [
            { from: UserState.DEACTIVATED, to: UserState.ACTIVE },
            { from: UserState.PENDING, to: UserState.SUSPENDED }
        ];

        it.each(validTransitions)('should allow transition from $from to $to', async ({ from, to }) => {
            await expect(service['validateStateTransition'](from, to))
                .resolves
                .not
                .toThrow();
        });

        it.each(invalidTransitions)('should not allow transition from $from to $to', async ({ from, to }) => {
            await expect(service['validateStateTransition'](from, to))
                .rejects
                .toThrow(BadRequestException);
        });
    });
}); 