# Service Layer Design Standards

## Overview
This document outlines the standards for the service layer, which implements business logic and manages interactions between controllers and models.

## File Organization

### Constants and Types
```
backend/
  └── src/
      ├── constants/
      │   └── service-operations.ts  # Operation types, results, error codes
      ├── utils/
      │   └── logging.ts            # Logging utilities
      └── services/
          └── base/
              └── service-base.ts    # Base service class
```

## Core Standards

### 1. Service Base Class
All services must extend `ServiceBase<T>` and implement required properties:
```typescript
@Injectable()
export class ExampleService extends ServiceBase<Example> {
    protected readonly ENTITY_NAME = 'Example';
    protected readonly logger = new Logger(ExampleService.name);
    protected readonly defaultRelations: string[] = ['relation1', 'relation2'];

    constructor(
        @InjectRepository(Example)
        protected readonly repository: Repository<Example>,
        protected readonly dataSource: DataSource,
    ) {
        super();
    }
}
```

### 2. Operation Categories and Access Control
Services support three operation categories:
- USER_OP: Regular user operations
- ADMIN_OP: Organization admin operations
- SYSTEM_OP: System owner operations

Note: All service methods MUST explicitly invoke validateAccess with the appropriate operation type before proceeding with any operation.

```typescript
// Example service method with operation category
async updateUser(id: string, dto: UpdateUserDto, requestingUserId: string): Promise<ResponseUserDto> {
    try {
        await this.validateAccess(OperationType.USER, requestingUserId);
        
        return this.withTransaction(async (queryRunner) => {
            const user = await this.validateExists(id);
            const updated = await this.update(id, dto, queryRunner);
            
            this.logOperation(OperationType.USER, 'updateUser', OperationResult.SUCCESS, {
                userId: requestingUserId,
                targetId: id,
                changes: Object.keys(dto)
            });
            
            return this.toResponseDto(updated);
        });
    } catch (error) {
        this.handleError(error, OperationType.USER, 'updateUser', {
            userId: requestingUserId,
            targetId: id
        });
    }
}
```

### 3. Method Documentation
All public methods must have clear documentation:
```typescript
/**
 * Finds a user by ID.
 * @param id - The user's UUID
 * @param requestingUserId - ID of the user making the request
 * @throws NotFoundException if user not found
 * @throws UnauthorizedException if access denied
 * @returns The user if found, null otherwise
 */
async findOneUser(id: string, requestingUserId: string): Promise<ResponseUserDto | null> {
    await this.validateAccess(OperationType.USER, requestingUserId);
    // Implementation
}
```

### 4. Method Naming Standards
- Create: `create${Entity}`
- Read: `findOne${Entity}`, `findAll${Entity}s`
- Update: `update${Entity}`
- Delete: `remove${Entity}`, `softDelete${Entity}`
- Domain-specific: `verb${Noun}${Entity}` (e.g., `validatePassword`)

### 5. Error Handling
Note: All exceptions MUST reference the predefined ServiceErrorCode constants and adhere to a standardized error format.
Use standard error format and appropriate exception types:
```typescript
// Standard error format
throw new BadRequestException({
    code: ServiceErrorCode.INVALID_INPUT,
    message: `${this.ENTITY_NAME} validation failed`,
    details: { field, value }  // Only include safe details
});

// Common validation method
protected async validateExists(id: string): Promise<Example> {
    const entity = await this.findOne(id);
    if (!entity) {
        throw new NotFoundException({
            code: ServiceErrorCode.NOT_FOUND,
            message: `${this.ENTITY_NAME} not found`,
            details: { id }
        });
    }
    return entity;
}

// Error handling wrapper
protected handleError(
    error: Error,
    operationType: OperationType,
    operation: string,
    context: Record<string, any>
): never
```

### 6. Transaction Management
Note: Ensure that all data-modification operations (create, update, delete, softDelete) are wrapped in withTransaction to guarantee proper rollback and consistency.
Use `withTransaction` for data modifications:
```typescript
async createExample(dto: CreateExampleDto, requestingUserId: string): Promise<ResponseExampleDto> {
    await this.validateAccess(OperationType.USER, requestingUserId);
    
    return this.withTransaction(async (queryRunner) => {
        // Validation
        await this.validateUniqueness('field', dto.field);
        
        // Operation
        const entity = await this.create(dto as DeepPartial<Example>, queryRunner);
        
        // Log success
        this.logOperation(OperationType.USER, 'createExample', OperationResult.SUCCESS, {
            userId: requestingUserId,
            targetId: entity.id,
            changes: Object.keys(dto)
        });
        
        // Transform and return
        return this.toResponseDto(entity);
    });
}
```

### 7. Logging Standards
Note: All logging MUST be performed using `createServiceLogger` rather than directly instantiating Logger, to ensure structured, context-enriched logs.
Log all operations with appropriate context:
```typescript
protected logOperation(
    operationType: OperationType,
    operation: string,
    result: OperationResult,
    details: {
        userId?: string;           // Who performed the action
        targetId?: string;         // What was affected
        organizationId?: string;   // Context of the operation
        error?: Error;             // If something went wrong
        changes?: string[];        // What was changed
        reason?: string;           // Why it failed/was denied
    }
): void {
    // Implementation using createServiceLogger
}
```

### 8. Relationship Loading
Define required relationships at service level:
```typescript
protected readonly defaultRelations = ['relation1', 'relation2'];

// Use in base methods automatically
async findOne(id: string): Promise<Example | null> {
    return this.repository.findOne({
        where: { id },
        relations: this.defaultRelations
    });
}
```

## Implementation Guidelines

### 1. CRUD Operations
Every service should implement standard CRUD operations with appropriate operation types:
```typescript
// Read operations
async findAll(): Promise<ResponseDto[]>;                     // USER_OP
async findOne(id: string): Promise<ResponseDto>;            // USER_OP

// Write operations
async create(dto: CreateDto): Promise<ResponseDto>;         // USER_OP
async update(id: string, dto: UpdateDto): Promise<ResponseDto>; // USER_OP
async remove(id: string): Promise<void>;                    // ADMIN_OP
async softDelete(id: string): Promise<void>;               // ADMIN_OP
```

### 2. Validation Methods
Implement standard validation methods:
```typescript
// Existence validation
protected async validateExists(id: string): Promise<Example>;

// Uniqueness validation
protected async validateUniqueness(
    field: string,
    value: string,
    excludeId?: string
): Promise<void>;

// Business rule validation
protected async validateBusinessRule(
    entity: Example,
    operation: string
): Promise<void>;

// Access validation
protected async validateAccess(
    operationType: OperationType,
    userId: string,
    organizationId?: string
): Promise<void>;
```

### 3. Response Transformation
Use consistent transformation patterns:
```typescript
protected toResponseDto(entity: Example): ResponseExampleDto {
    return plainToClass(ResponseExampleDto, entity, {
        excludeExtraneousValues: true
    });
}
```

## Common Patterns

### 1. Soft Delete
```typescript
async softDelete(id: string, requestingUserId: string): Promise<void> {
    await this.validateAccess(OperationType.ADMIN, requestingUserId);
    
    return this.withTransaction(async (queryRunner) => {
        const entity = await this.validateExists(id);
        await this.update(
            id,
            { deleted: true, deletedAt: new Date() } as DeepPartial<Example>,
            queryRunner
        );
        
        this.logOperation(OperationType.ADMIN, 'softDelete', OperationResult.SUCCESS, {
            userId: requestingUserId,
            targetId: id
        });
    });
}
```

### 2. State Management
```typescript
protected async validateStateTransition(
    current: State,
    target: State
): Promise<void> {
    if (!this.isValidTransition(current, target)) {
        throw new BadRequestException({
            code: ServiceErrorCode.INVALID_STATE,
            message: `Invalid state transition`,
            details: { current, target }
        });
    }
}
```

## Testing Requirements

### 1. Unit Tests
- Test all operation categories separately
- Test all public methods
- Mock repository and dependencies
- Test success and error paths
- Verify validation behavior
- Verify proper logging
- Test access validation

### 2. Integration Tests
- Test with actual database
- Verify relationship handling
- Verify proper access controls
- Test transaction rollback

## Security Considerations

### 1. Data Exposure
- Never log sensitive data
- Sanitize error messages
- Validate access before operations
- Use appropriate error codes

### 2. Access Control
- Always validate operation type access
- Log access denials
- Use proper error codes for security issues
- Maintain clear operation type boundaries

Note: Detailed authorization and JWT implementation will be covered in a separate design document.

## Migration Plan

### Current Service Inconsistencies

#### BaseUserService
1. Missing proper operation type categorization (USER_OP, ADMIN_OP, SYSTEM_OP)
2. Missing standardized error codes from ServiceErrorCode
3. Missing structured logging using createServiceLogger
4. Missing access validation in operations
5. Inconsistent error handling pattern

#### LoginCredentialService
1. Missing operation type categorization
2. Custom error handling instead of using ServiceErrorCode
3. Direct Logger usage instead of createServiceLogger
4. Missing access validation
5. Inconsistent transaction handling
6. Custom response transformation instead of using toResponseDto

#### LoginProviderService
1. Missing operation type categorization
2. Inconsistent error handling with handleError utility
3. Direct Logger usage instead of createServiceLogger
4. Missing access validation
5. Custom validation methods not using base class methods
6. Custom response transformation methods (transformResponse, transformResponseOrNull)

#### OrganizationService
1. Missing operation type categorization
2. Direct Logger usage instead of createServiceLogger
3. Missing standardized error codes
4. Inconsistent transaction handling
5. Custom validation methods not aligned with base class
6. Missing access validation in some operations

#### UserService
1. Missing operation type categorization
2. Direct Logger usage instead of createServiceLogger
3. Inconsistent error handling patterns
4. Custom softDelete implementation instead of using base class
5. Missing access validation in some operations
6. Inconsistent transaction handling in batch operations

### Required Changes
1. Implement consistent operation type categorization across all services
2. Migrate to createServiceLogger for structured logging
3. Standardize error handling using ServiceErrorCode
4. Implement proper access validation using validateAccess
5. Use base class transaction handling consistently
6. Standardize response transformation using toResponseDto
7. Align validation methods with base class implementations
8. Implement proper error context in all operations

### Migration Strategy
1. Create base service test suite to verify standard behaviors
2. Update one service at a time, starting with BaseUserService
3. Ensure all tests pass after each service update
4. Verify logging and error handling in integration tests
5. Document any breaking changes in API responses
6. Update service consumers to handle standardized errors

Note: This migration should be done incrementally to maintain system stability and ensure proper testing at each step.
