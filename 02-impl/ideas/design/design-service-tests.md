# Service Test Design

## Core Structure

All service tests MUST follow this structure for consistency and maintainability:

```typescript
describe('ServiceName', () => {
    // Test setup
    let service: ServiceName;
    let repository: jest.Mocked<Repository<Entity>>;
    
    // Mock data setup using TestDataFactory
    const mockData = {
        entity: TestDataFactory.createEntity(),
        createDto: TestDataFactory.createEntityDto('create'),
        updateDto: TestDataFactory.createEntityDto('update')
    };

    beforeEach(() => {
        // Standard setup using mockRepository
        repository = mockRepository<Entity>();
    });

    describe('success cases', () => {
        // Group by operation pattern
        describe('read operations', () => {
            it('finds all entities')
            it('finds one entity')
            it('finds by specific field')
        });
        
        describe('write operations', () => {
            it('creates entity')
            it('updates entity')
            it('removes entity')
        });
    });

    describe('error handling', () => {
        // Group by error type
        describe('not found errors', () => {
            it('handles entity not found in find')
            it('handles entity not found in update')
            it('handles entity not found in remove')
        });
        
        describe('validation errors', () => {
            it('handles invalid data in create')
            it('handles invalid data in update')
        });
        
        describe('conflict errors', () => {
            it('handles duplicate unique fields')
            it('handles constraint violations')
        });
        
        describe('authorization errors', () => {
            it('handles unauthorized access')
            it('handles forbidden operations')
        });
    });

    describe('transaction management', () => {
        // Group by transaction pattern
        describe('write operations', () => {
            it('commits successful create')
            it('commits successful update')
            it('commits successful remove')
        });
        
        describe('rollback scenarios', () => {
            it('rolls back failed create')
            it('rolls back failed update')
            it('rolls back failed remove')
        });
    });
});
```

## Implementation Guidelines

1. **Test Setup**
   - Use `mockRepository<T>()` for repository mocks
   - Use `TestDataFactory` for consistent test data
   - Keep mock data at the top level for reuse

2. **Success Cases**
   - Group by operation pattern (read/write)
   - Test happy path thoroughly
   - Verify correct repository method calls
   - Validate return values
   ```typescript
   describe('success cases', () => {
       describe('read operations', () => {
           it('finds all entities', async () => {
               repository.find.mockResolvedValue([mockData.entity]);
               const result = await service.findAll();
               expect(result).toEqual([mockData.entity]);
               expect(repository.find).toHaveBeenCalled();
           });
       });
   });
   ```

3. **Error Handling**
   - Group by error type
   - Test all expected exceptions
   - Verify error messages
   - Check error status codes
   ```typescript
   describe('error handling', () => {
       describe('not found errors', () => {
           it('handles entity not found', async () => {
               repository.findOne.mockResolvedValue(null);
               await expect(service.findOne('id'))
                   .rejects.toThrow(NotFoundException);
           });
       });
   });
   ```

4. **Transaction Management**
   - Test transaction boundaries
   - Verify commit/rollback behavior
   - Check cleanup (release)
   ```typescript
   describe('transaction management', () => {
       describe('write operations', () => {
           it('commits successful create', async () => {
               repository.save.mockResolvedValue(mockData.entity);
               await service.create(mockData.createDto);
               expect(repository.save).toHaveBeenCalled();
           });
       });
   });
   ```

## Mock Setup Patterns

1. **Repository Mocks**
   ```typescript
   const repository = mockRepository<Entity>();
   repository.findOne
       .mockResolvedValueOnce(mockUser)  // validateAccess
       .mockResolvedValueOnce(null);     // uniqueness check
   ```

2. **Transaction Mocks**
   ```typescript
   // Transaction success
   repository.save.mockResolvedValue(entity);

   // Transaction failure
   repository.save.mockRejectedValue(new Error('DB Error'));
   ```

3. **Validation Chain**
   ```typescript
   // Multiple validation steps
   repository.findOne
       .mockResolvedValueOnce(mockUser)   // access check
       .mockResolvedValueOnce(mockUser)   // existence check
       .mockResolvedValueOnce(null);      // uniqueness check
   ```

## Anti-Patterns to Avoid

1. **❌ Don't mix test categories**
   ```typescript
   // Bad: Mixed concerns
   describe('findOne', () => {
       it('finds entity')
       it('handles not found')
   });

   // Good: Separated concerns
   describe('success cases', () => {
       it('finds entity')
   });
   describe('error handling', () => {
       it('handles not found')
   });
   ```

2. **❌ Don't nest too deeply**
   ```typescript
   // Bad: Too many levels
   describe('success cases', () => {
       describe('read operations', () => {
           describe('findOne', () => {
               describe('with id', () => {
                   it('works')
               });
           });
       });
   });

   // Good: Max 3 levels
   describe('success cases', () => {
       describe('read operations', () => {
           it('finds one by id')
       });
   });
   ```

3. **❌ Don't duplicate setup**
   ```typescript
   // Bad: Repeated setup
   it('test1', () => {
       repository = mockRepository();
       service = new Service(repository);
   });

   // Good: Use beforeEach
   beforeEach(() => {
       repository = mockRepository();
       service = new Service(repository);
   });
   ```

## Best Practices

1. **Organization**
   - Follow the prescribed structure exactly
   - Keep nesting to maximum 3 levels
   - Group related tests logically

2. **Mock Data**
   - Use TestDataFactory consistently
   - Define mock data at describe block level
   - Use clear, descriptive mock values

3. **Assertions**
   - Test both return values and side effects
   - Use type-safe assertions
   - Include repository method call checks

4. **Error Testing**
   - Test all error paths
   - Verify error types and messages
   - Check error status codes

5. **Transaction Testing**
   - Test both commit and rollback
   - Verify cleanup
   - Check error propagation