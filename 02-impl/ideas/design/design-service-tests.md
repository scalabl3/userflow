# Service Test Design Standards

## Overview
This document outlines the standards for testing service layer components, ensuring consistent test coverage and patterns across all services while maintaining flexibility and maintainability.

Mocks: `my-app/packages/backend/src/models/test/__mocks__`
Factory: `my-app/packages/backend/src/models/test/factories/test-data.factory.ts`
## Core Principles

1. **Balanced Structure**
   - Consistent patterns without over-constraining
   - Reusable verification utilities
   - Flexible entity handling
   - Clear separation of concerns

2. **Focus on Unit Testing**
   - Test service methods in isolation
   - Mock all dependencies (Repository, DataSource, etc.)
   - No database or external service integration
   - Clear and maintainable tests

3. **Test Categories**
   - Method validation and business logic
   - Error handling and edge cases
   - Transaction management
   - Service-level access control
   - Audit logging verification

4. **Out of Scope**
   - Integration tests
   - End-to-end testing
   - Performance testing
   - Cross-service interactions
   - Real database operations

## Test Infrastructure

### 1. Service Test Harness
```typescript
export abstract class ServiceTestHarness<T> {
    protected mockRepository: MockRepository<T>;
    protected mockDataSource: MockDataSource;
    protected mockQueryRunner: MockQueryRunner;
    protected mockSecurityContext: SecurityContext;
    protected mockLogger: ReturnType<typeof createServiceLogger>;

    protected abstract setupService(): void;
    protected abstract setupMocks(): void;

    protected async beforeEach() {
        await this.setupStandardMocks();
        this.setupService();
        this.setupMocks();
    }

    protected async setupStandardMocks() {
        this.mockRepository = this.createMockRepository();
        this.mockDataSource = this.createMockDataSource();
        this.mockQueryRunner = this.createMockQueryRunner();
        this.mockSecurityContext = this.createMockSecurityContext();
        this.mockLogger = this.createMockLogger();
    }
}
```

### 2. Mock Interfaces
```typescript
export interface MockRepository<T> {
    find: jest.Mock<Promise<T[]>>;
    findOne: jest.Mock<Promise<T | null>>;
    findBy: jest.Mock<Promise<T[]>>;
    findOneBy: jest.Mock<Promise<T | null>>;
    save: jest.Mock<Promise<T>>;
    create: jest.Mock<T>;
    update: jest.Mock<Promise<T>>;
    delete: jest.Mock<Promise<T>>;
    softDelete: jest.Mock<Promise<T>>;
}

export interface MockQueryRunner {
    startTransaction: jest.Mock;
    commitTransaction: jest.Mock;
    rollbackTransaction: jest.Mock;
    release: jest.Mock;
    connect: jest.Mock;
    manager: {
        save: jest.Mock;
        remove: jest.Mock;
    };
}

export interface SecurityContext {
    validateAccess: jest.Mock;
    getCurrentUser: jest.Mock;
    hasRole: jest.Mock;
    validateOrganizationAccess: jest.Mock;
}
```

### 3. Test Data Factory
```typescript
export class TestDataFactory {
    static createMockEntity<T>(
        baseFields: Partial<T> & { id: string },
        additionalFields: Partial<T> = {}
    ): T {
        return {
            createdAt: new Date(),
            modifiedAt: new Date(),
            ...baseFields,
            ...additionalFields
        } as T;
    }

    static createMockUser(overrides = {}) {
        return this.createMockEntity({
            id: 'test-user-id',
            firstname: 'Test',
            lastname: 'User',
            ...overrides
        });
    }

    static createMockOrganization(overrides = {}) {
        return this.createMockEntity({
            id: 'test-org-id',
            name: 'Test Organization',
            ...overrides
        });
    }
}
```

## Verification Utilities

### 1. Transaction Verification
```typescript
protected async verifyTransaction(operation: () => Promise<void>) {
    await operation();
    
    expect(this.mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(this.mockQueryRunner.commitTransaction).toHaveBeenCalled();
    expect(this.mockQueryRunner.release).toHaveBeenCalled();
}

protected async verifyTransactionRollback(operation: () => Promise<void>) {
    await expect(operation()).rejects.toThrow();
    expect(this.mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(this.mockQueryRunner.release).toHaveBeenCalled();
}
```

### 2. Access Control Verification
```typescript
protected verifyAccessControl(
    operationType: OperationType,
    requestingUserId: string,
    organizationId?: string
) {
    expect(this.mockSecurityContext.validateAccess)
        .toHaveBeenCalledWith(operationType, requestingUserId, organizationId);
}

protected verifyOrganizationAccess(
    requestingUserId: string,
    organizationId: string
) {
    expect(this.mockSecurityContext.validateOrganizationAccess)
        .toHaveBeenCalledWith(requestingUserId, organizationId);
}
```

### 3. Audit Log Verification
```typescript
protected verifyAuditLog(
    operationType: OperationType,
    operation: string,
    result: OperationResult,
    context: Record<string, any> = {}
) {
    expect(this.mockLogger.logOperation)
        .toHaveBeenCalledWith(operationType, operation, result, context);
}
```

## Implementation Example

```typescript
class UserServiceTest extends ServiceTestHarness<User> {
    private service: UserService;

    protected setupService() {
        this.service = new UserService(
            this.mockRepository,
            this.mockDataSource
        );
    }

    protected setupMocks() {
        const mockUsers = [
            TestDataFactory.createMockUser({ id: 'user-1' }),
            TestDataFactory.createMockUser({ id: 'user-2' })
        ];
        this.mockRepository.find.mockResolvedValue(mockUsers);
    }

    describe('findAllUsers', () => {
        it('should handle transactions correctly', async () => {
            await this.verifyTransaction(async () => {
                await this.service.findAllUsers('org-1', 'user-1');
            });
        });

        it('should validate access', async () => {
            await this.service.findAllUsers('org-1', 'user-1');
            this.verifyAccessControl(OperationType.READ, 'user-1', 'org-1');
        });

        it('should handle unauthorized access', async () => {
            this.mockSecurityContext.validateAccess
                .mockRejectedValue(new UnauthorizedException());

            await expect(
                this.service.findAllUsers('org-1', 'user-1')
            ).rejects.toThrow(UnauthorizedException);
        });
    });
}
```

## Best Practices

### 1. Mock Setup
- Use TestDataFactory for consistent entity creation
- Reset mocks between tests
- Mock only what's necessary for each test
- Keep mock data minimal and focused

### 2. Test Organization
```typescript
describe('ServiceName', () => {
    describe('methodName', () => {
        describe('success cases', () => {
            // Happy path tests
        });

        describe('validation', () => {
            // Input validation tests
        });

        describe('error handling', () => {
            // Error cases and rollbacks
        });

        describe('access control', () => {
            // Authorization checks
        });

        describe('audit logging', () => {
            // Operation logging
        });
    });
});
```

### 3. Common Test Patterns

#### Transaction Testing
```typescript
it('should handle transaction rollback', async () => {
    this.mockRepository.save.mockRejectedValue(new Error());
    await this.verifyTransactionRollback(async () => {
        await this.service.someOperation();
    });
});
```

#### Access Control Testing
```typescript
it('should deny unauthorized access', async () => {
    this.mockSecurityContext.validateAccess
        .mockRejectedValue(new UnauthorizedException());
    await expect(operation())
        .rejects.toThrow(UnauthorizedException);
});
```

#### Organization Access Testing
```typescript
it('should validate organization access', async () => {
    const userId = 'user-1';
    const orgId = 'org-1';
    
    await this.service.someOperation(orgId, userId);
    this.verifyOrganizationAccess(userId, orgId);
});
```

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