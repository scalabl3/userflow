/**
 * Test setup utilities for NestJS services and repositories.
 * 
 * Service Test Strategy:
 * ```typescript
 * describe('UserService', () => {
 *   let repository: jest.Mocked<Repository<User>>;
 *   
 *   beforeEach(() => {
 *     repository = mockRepository<User>();
 *   });
 * 
 *   it('finds user by id', async () => {
 *     repository.findOne.mockResolvedValue(userMock.standard);
 *     const result = await service.findOne('test-id');
 *     expect(repository.findOne).toHaveBeenCalled();
 *   });
 * 
 *   it('creates user with transaction', async () => {
 *     repository.save.mockResolvedValue(userMock.standard);
 *     const result = await service.create(createUserDto);
 *     expect(repository.save).toHaveBeenCalled();
 *   });
 * });
 */

import { Repository, DataSource, EntityManager, QueryRunner, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * @internal
 * Used internally by mockRepository. Do not use directly in tests.
 */
const internalManager = {
    save: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    preload: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    count: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
    createQueryBuilder: jest.fn(),
    transaction: jest.fn()
} as unknown as jest.Mocked<EntityManager>;

/**
 * @internal
 * Used internally by mockRepository. Do not use directly in tests.
 */
const internalQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
    getCount: jest.fn(),
    execute: jest.fn()
} as unknown as jest.Mocked<SelectQueryBuilder<any>>;

/**
 * @internal
 * Used internally by mockRepository. Do not use directly in tests.
 */
const internalDataSource = {
    createQueryRunner: jest.fn(),
    getRepository: jest.fn(),
    manager: internalManager,
    isInitialized: true,
    options: {},
    driver: {} as any,
    createQueryBuilder: jest.fn().mockReturnValue(internalQueryBuilder),
    transaction: jest.fn()
} as unknown as jest.Mocked<DataSource>;

/**
 * @internal
 * Used internally by mockRepository. Do not use directly in tests.
 */
const internalQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: internalManager,
    connection: internalDataSource
} as unknown as jest.Mocked<QueryRunner>;

internalDataSource.createQueryRunner.mockReturnValue(internalQueryRunner);

/**
 * Creates a fully typed mock repository for service tests.
 * 
 * @template T - Entity type for the repository
 * @returns Mocked Repository instance
 * 
 * @example
 * ```typescript
 * describe('UserService', () => {
 *   let repository: jest.Mocked<Repository<User>>;
 *   
 *   beforeEach(() => {
 *     repository = mockRepository<User>();
 *   });
 * 
 *   it('creates user', async () => {
 *     repository.save.mockResolvedValue(userMock.standard);
 *     const result = await service.create(createUserDto);
 *     expect(repository.save).toHaveBeenCalled();
 *   });
 * });
 */
export function mockRepository<T extends ObjectLiteral>(): jest.Mocked<Repository<T>> {
    const repo = {
        // Core operations
        find: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        findOneById: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        preload: jest.fn(),
        merge: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        remove: jest.fn(),
        
        // Soft delete operations
        softDelete: jest.fn(),
        softRemove: jest.fn(),
        recover: jest.fn(),
        
        // Query operations
        createQueryBuilder: jest.fn().mockReturnValue(internalQueryBuilder),
        count: jest.fn(),
        exist: jest.fn(),
        
        // Metadata
        metadata: {
            name: 'MockRepository',
            tableName: 'mock_table',
            columns: [],
            relations: []
        },
        
        // Transaction context
        manager: {
            ...internalManager,
            connection: internalDataSource,
            queryRunner: internalQueryRunner
        },
        
        // Utility methods
        hasId: jest.fn(),
        getId: jest.fn(),
        clear: jest.fn()
    };
    
    return repo as unknown as jest.Mocked<Repository<T>>;
}

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset common mock return values
    internalQueryRunner.startTransaction.mockResolvedValue(undefined);
    internalQueryRunner.commitTransaction.mockResolvedValue(undefined);
    internalQueryRunner.rollbackTransaction.mockResolvedValue(undefined);
    internalQueryRunner.release.mockResolvedValue(undefined);
    
    // Setup transaction handling
    internalManager.transaction.mockImplementation(async (cb: any) => {
        try {
            const result = await cb(internalManager);
            return result;
        } catch (error) {
            throw error;
        }
    });
    
    internalDataSource.transaction.mockImplementation(async (cb: any) => {
        try {
            const result = await cb(internalManager);
            return result;
        } catch (error) {
            throw error;
        }
    });
});

// Clean up after all tests
afterAll(() => {
    jest.restoreAllMocks();
});

// Global Jest configuration
beforeAll(() => {
  // Add any global setup here
});

afterAll(() => {
  // Add any global cleanup here
});

beforeEach(() => {
  jest.clearAllMocks();
});