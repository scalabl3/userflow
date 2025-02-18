import { Repository, DataSource, EntityManager, QueryRunner } from 'typeorm';

export type MockType<T> = {
    [P in keyof T]?: jest.Mock<any, any>;
};

export const mockManager = {
    save: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn()
} as unknown as jest.Mocked<EntityManager>;

const mockDataSourceInstance = {
    createQueryRunner: jest.fn(),
    getRepository: jest.fn(),
    manager: mockManager,
    isInitialized: true,
    options: {},
    driver: {} as any
} as unknown as jest.Mocked<DataSource>;

export const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: mockManager,
    connection: mockDataSourceInstance
} as unknown as jest.Mocked<QueryRunner>;

mockDataSourceInstance.createQueryRunner.mockReturnValue(mockQueryRunner);

export const mockDataSource = mockDataSourceInstance;

export const mockRepository = () => {
    const repo = {
        find: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        remove: jest.fn(),
        manager: {
            ...mockManager,
            connection: mockDataSource
        }
    };
    return repo as unknown as jest.Mocked<Repository<any>>;
};

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