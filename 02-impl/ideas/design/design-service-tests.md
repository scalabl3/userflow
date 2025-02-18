# Service Test Design Standards

## Overview
This document outlines the standards for testing service layer components, ensuring consistent test coverage and patterns across all services while maintaining flexibility and maintainability.

Mocks: `my-app/packages/backend/src/__mocks__`
Factory: `my-app/packages/backend/src/__mocks__/factories/test-data.factory.ts`

## Core Principles

1. **Simplicity First**
   - Keep test setup minimal and clear
   - Use standardized mocks directly
   - Avoid complex test harnesses
   - Focus on readability

2. **Standard Test Structure**
   ```typescript
   describe('ServiceName', () => {
     let service: ServiceName;
     let repository: Repository<Entity>;
     let dataSource: DataSource;

     beforeEach(async () => {
       const module: TestingModule = await Test.createTestingModule({
         providers: [
           ServiceName,
           {
             provide: getRepositoryToken(Entity),
             useFactory: mockRepository,
           },
           {
             provide: DataSource,
             useValue: mockDataSource
           },
         ],
       }).compile();

       service = module.get<ServiceName>(ServiceName);
       repository = module.get<Repository<Entity>>(getRepositoryToken(Entity));
       dataSource = module.get<DataSource>(DataSource);

       jest.clearAllMocks();
     });

     describe('methodName', () => {
       describe('success cases', () => {
         it('should handle normal operation', async () => {
           // Arrange - Use standardized mocks
           const mockEntity = entityMock.instances.standard;
           repository.findOne.mockResolvedValue(mockEntity);

           // Act
           const result = await service.methodName(params);

           // Assert
           expect(result).toEqual(expect.any(ResponseDto));
         });
       });

       describe('error handling', () => {
         it('should handle not found', async () => {
           repository.findOne.mockResolvedValue(null);
           await expect(service.methodName(params))
             .rejects.toThrow(NotFoundException);
         });
       });
     });
   });
   ```

3. **Mock Data Usage**
   - Use standardized mock instances from `__mocks__` directory
   - Leverage mock DTOs for input validation
   - Use mock lists for collection testing
   - Keep test-specific overrides minimal

4. **Test Categories**
   - Success Cases
     - Normal operation
     - Edge cases with valid data
     - Optional parameter handling
   
   - Error Handling
     - Not found scenarios
     - Validation failures
     - Conflict handling
     - Database errors
   
   - Transaction Management (when needed)
     - Commit on success
     - Rollback on error
     - Resource cleanup

5. **Best Practices**
   - One assertion per test when possible
   - Clear test descriptions
   - Minimal setup in beforeEach
   - Clean mock reset between tests
   - Use type-safe mock data

## Example Implementation

```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let dataSource: DataSource;

  beforeEach(async () => {
    // Standard NestJS test module setup
    // ... (as shown above)
  });

  describe('createUser', () => {
    const createDto = userMock.dtos.create.standard;

    describe('success cases', () => {
      it('should create user with valid data', async () => {
        // Arrange
        const mockUser = userMock.instances.standard;
        repository.create.mockReturnValue(mockUser);
        repository.save.mockResolvedValue(mockUser);

        // Act
        const result = await service.createUser(createDto);

        // Assert
        expect(result).toEqual(
          expect.objectContaining({
            id: mockUser.id,
            username: createDto.username
          })
        );
      });
    });

    describe('error handling', () => {
      it('should handle duplicate username', async () => {
        // Arrange
        repository.findOne.mockResolvedValue(userMock.instances.standard);

        // Act & Assert
        await expect(service.createUser(createDto))
          .rejects.toThrow(ConflictException);
      });
    });

    describe('transaction management', () => {
      it('should rollback on error', async () => {
        // Arrange
        const queryRunner = dataSource.createQueryRunner();
        repository.save.mockRejectedValue(new Error('DB Error'));

        // Act
        await expect(service.createUser(createDto))
          .rejects.toThrow('DB Error');

        // Assert
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(queryRunner.release).toHaveBeenCalled();
      });
    });
  });
});
```

## Key Differences from Previous Approach

1. **Removed Complexity**
   - No ServiceTestHarness abstraction
   - No custom verification utilities
   - Direct use of mock data

2. **Improved Clarity**
   - Standard NestJS testing patterns
   - Clear test organization
   - Minimal boilerplate

3. **Better Maintainability**
   - Less code to maintain
   - Easier to understand
   - More flexible for edge cases

4. **Leverages Existing Tools**
   - Uses NestJS testing utilities
   - Standard Jest patterns
   - TypeORM mock patterns

## Migration Strategy

1. **Phase 1: Infrastructure**
   - Implement new ServiceTestHarness
   - Create/update TestDataFactory
   - Set up mock interfaces
   - Add verification utilities

2. **Phase 2: Service Migration**
   - Migrate one service at a time
   - Start with simpler services
   - Update test data creation
   - Add missing verifications

3. **Phase 3: Cleanup**
   - Remove old base classes
   - Update documentation
   - Add missing test coverage
   - Standardize test patterns

## Conclusion

This design provides:
- Structure where it helps
- Flexibility where it matters
- Clear patterns to follow
- Easy maintenance and extension
- Type safety without constraints

The focus is on making tests:
- Easy to write
- Easy to maintain
- Comprehensive
- Reliable