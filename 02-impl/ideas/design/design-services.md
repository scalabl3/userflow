# Service Layer Design Standards

## Overview
This document outlines the standards for the service layer, which implements business logic and manages interactions between controllers and models.

## Core Principles

### 1. Service Base Class
All services must extend `ServiceBase<T>` and implement required abstracts:
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

### 2. Method Naming Standards
- Create: `createX`
- Read: `findOneX`, `findAllX`
- Update: `updateX`
- Delete: `removeX`
- Domain-specific: `verbNounX` (e.g., `validatePasswordX`)

### 3. Transaction Management
Always use `withTransaction` for operations that modify data:
```typescript
async createExample(dto: CreateExampleDto): Promise<ResponseExampleDto> {
    return this.withTransaction(async (queryRunner) => {
        // Validation
        await this.validateUniqueness('field', dto.field);
        
        // Operation
        const entity = await this.create(dto as DeepPartial<Example>, queryRunner);
        
        // Transform and return
        return this.toResponseDto(entity, ResponseExampleDto)!;
    }, 'create', undefined, { dto });
}
```

### 4. Error Handling
- Use typed exceptions (`BadRequestException`, `NotFoundException`, etc.)
- Include context in error messages
- Log errors with appropriate level
- Handle edge cases explicitly

```typescript
private async validateExists(id: string): Promise<Example> {
    const entity = await this.findOne(id);
    if (!entity) {
        throw new NotFoundException(
            `${this.ENTITY_NAME} with ID ${id} not found`
        );
    }
    return entity;
}
```

### 5. Relationship Loading
Define required relationships at service level:
```typescript
protected readonly defaultRelations = ['relation1', 'relation2'];

async findOne(id: string): Promise<Example | null> {
    return this.repository.findOne({
        where: { id },
        relations: this.defaultRelations
    });
}
```

### 6. Business Rule Validation
Implement validation methods for business rules:
```typescript
protected async validateBusinessRule(entity: Example): Promise<void> {
    if (!this.isValidState(entity)) {
        throw new BadRequestException(
            `Invalid state transition for ${this.ENTITY_NAME}`
        );
    }
}
```

### 7. Logging Standards
Log significant state changes and operations:
```typescript
protected logChanges(original: Example, updated: DeepPartial<Example>, context: string): void {
    if (updated.state !== undefined && updated.state !== original.state) {
        this.logger.log(
            `${this.ENTITY_NAME} ${original.id} state changed from ${original.state} to ${updated.state}`
        );
    }
}
```

### 8. DTO Transformation
Use consistent transformation patterns:
```typescript
protected toResponseDto<D>(entity: Example, dtoClass: ClassConstructor<D>): D {
    return plainToClass(dtoClass, entity, {
        excludeExtraneousValues: true
    });
}
```

## Implementation Guidelines

### 1. CRUD Operations
Every service should implement standard CRUD operations:
```typescript
async findAllExamples(): Promise<ResponseExampleDto[]> {
    const entities = await this.findAll();
    return this.toResponseDtoArray(entities, ResponseExampleDto);
}

async findOneExample(id: string): Promise<ResponseExampleDto | null> {
    const entity = await this.findOne(id);
    return entity ? this.toResponseDto(entity, ResponseExampleDto)! : null;
}

async createExample(dto: CreateExampleDto): Promise<ResponseExampleDto> {
    return this.withTransaction(async (queryRunner) => {
        const entity = await this.create(dto as DeepPartial<Example>, queryRunner);
        return this.toResponseDto(entity, ResponseExampleDto)!;
    }, 'create', undefined, { dto });
}

async updateExample(id: string, dto: UpdateExampleDto): Promise<ResponseExampleDto | null> {
    return this.withTransaction(async (queryRunner) => {
        const entity = await this.update(id, dto as DeepPartial<Example>, queryRunner);
        return entity ? this.toResponseDto(entity, ResponseExampleDto)! : null;
    }, 'update', id, { dto });
}

async removeExample(id: string): Promise<boolean> {
    return this.withTransaction(async (queryRunner) => {
        return this.remove(id, queryRunner);
    }, 'remove', id);
}
```

### 2. Validation Helpers
Implement standard validation methods:
```typescript
protected async validateUniqueness(
    field: string,
    value: string,
    excludeId?: string
): Promise<void> {
    const where: FindOptionsWhere<Example> = { [field]: value };
    if (excludeId) {
        where.id = Not(excludeId);
    }
    
    const existing = await this.repository.findOne({ where });
    if (existing) {
        throw new ConflictException(
            `${this.ENTITY_NAME} with ${field} ${value} already exists`
        );
    }
}
```

### 3. Complex Operations
For operations involving multiple steps:
1. Validate all preconditions first
2. Execute operations within a single transaction
3. Handle rollback scenarios
4. Log operation progress
5. Return consistent response type

```typescript
async complexOperation(dto: ComplexOperationDto): Promise<ResponseExampleDto> {
    return this.withTransaction(async (queryRunner) => {
        // 1. Validation
        const entity = await this.validateExists(dto.id);
        await this.validateBusinessRules(entity, dto);
        
        // 2. Updates
        const updated = await this.update(entity.id, dto as DeepPartial<Example>, queryRunner);
        
        // 3. Related Operations
        await this.handleRelatedChanges(updated, queryRunner);
        
        // 4. Return Result
        return this.toResponseDto(updated, ResponseExampleDto)!;
    }, 'complexOperation', dto.id, { dto });
}
```

## Testing Requirements

### 1. Unit Tests
- Test all public methods
- Mock repository and dependencies
- Test success and error paths
- Verify transaction handling
- Test business rule validation

### 2. Integration Tests
- Test with actual database
- Verify relationship handling
- Test complex operations
- Verify rollback scenarios

### 3. Test Coverage
- Aim for 100% branch coverage
- Test all error conditions
- Verify logging behavior
- Test all validation rules

## Common Patterns

### 1. State Management
```typescript
protected async validateStateTransition(
    current: State,
    target: State
): Promise<void> {
    if (!this.isValidTransition(current, target)) {
        throw new BadRequestException(
            `Invalid state transition from ${current} to ${target}`
        );
    }
}
```

### 2. Relationship Management
```typescript
protected async loadRelationships(
    entity: Example,
    relations: string[]
): Promise<Example> {
    return this.repository.findOne({
        where: { id: entity.id },
        relations
    });
}
```

### 3. Batch Operations
```typescript
protected async batchUpdate(
    ids: string[],
    data: DeepPartial<Example>
): Promise<void> {
    return this.withTransaction(async (queryRunner) => {
        await Promise.all(
            ids.map(id => this.update(id, data, queryRunner))
        );
    }, 'batchUpdate', undefined, { ids: ids.length });
}
```

### 4. Soft Delete
```typescript
protected async softDelete(id: string): Promise<void> {
    return this.withTransaction(async (queryRunner) => {
        const entity = await this.validateExists(id);
        await this.update(
            id,
            { deleted: true, deletedAt: new Date() } as DeepPartial<Example>,
            queryRunner
        );
    }, 'softDelete', id);
}
```

## Service Alignment Plan

### Current Inconsistencies

#### 1. Relationship Loading
- **Issue**: Inconsistent relationship loading patterns across services
- **Examples**:
  - `LoginCredentialService`: Uses `defaultRelations` and overrides base methods
  - `UserService`: Loads relations ad-hoc in each method
  - `OrganizationService`: Mixes both approaches
- **Impact**: Potential N+1 queries, inconsistent data loading

#### 2. Validation Methods
- **Issue**: Multiple approaches to entity validation
- **Examples**:
  - Duplicate `validateUnique` methods in some services
  - Mix of `validateExists` and `findOneOrFail`
  - Inconsistent error message formatting
- **Impact**: Code duplication, inconsistent error handling

#### 3. Method Naming
- **Issue**: Inconsistent method naming patterns
- **Examples**:
  - `findOne` vs `findOneUser` vs `getUser`
  - Missing entity names in some method names
  - Inconsistent verb usage (get/find/retrieve)
- **Impact**: Reduced code readability and maintainability

#### 4. Error Handling
- **Issue**: Varying error handling approaches
- **Examples**:
  - Inconsistent use of error contexts
  - Different error message formats
  - Some services missing proper error wrapping
- **Impact**: Inconsistent error reporting and debugging

#### 5. Transaction Management
- **Issue**: Inconsistent transaction usage
- **Examples**:
  - Some operations missing transaction wrapping
  - Varying transaction context information
  - Inconsistent rollback handling
- **Impact**: Potential data consistency issues

### Remediation Plan

#### Phase 1: Standardize Base Patterns
1. Update `ServiceBase` class:
   - Add required `defaultRelations` property
   - Enhance base CRUD methods with relation loading
   - Standardize error message formatting
   - Improve transaction context handling

2. Create service utility functions:
   ```typescript
   // service-utils.ts
   export const createErrorContext = (
       operation: string,
       entityName: string,
       id?: string,
       details?: Record<string, unknown>
   ) => ({
       operation,
       entity: entityName,
       id,
       ...details
   });

   export const formatValidationError = (
       entityName: string,
       field: string,
       value: any,
       type: 'uniqueness' | 'existence' | 'state'
   ) => {
       const messages = {
           uniqueness: `${entityName} with ${field} '${value}' already exists`,
           existence: `${entityName} with ${field} '${value}' not found`,
           state: `Invalid state '${value}' for ${entityName}`
       };
       return messages[type];
   };
   ```

#### Phase 2: Service Refactoring
1. Relationship Loading:
   ```typescript
   @Injectable()
   export class ExampleService extends ServiceBase<Example> {
       protected readonly defaultRelations = ['relation1', 'relation2'];
       
       // Base methods will automatically use defaultRelations
       // Only override for special cases
       async findWithCustomRelations(id: string): Promise<Example | null> {
           return this.repository.findOne({
               where: { id },
               relations: [...this.defaultRelations, 'customRelation']
           });
       }
   }
   ```

2. Validation Methods:
   ```typescript
   @Injectable()
   export class ExampleService extends ServiceBase<Example> {
       // Use base class methods instead of service-specific ones
       protected async validateBusinessRules(entity: Example): Promise<void> {
           if (!this.isValidState(entity.state)) {
               throw new BadRequestException(
                   formatValidationError(this.ENTITY_NAME, 'state', entity.state, 'state')
               );
           }
       }
   }
   ```

3. Method Naming:
   ```typescript
   @Injectable()
   export class ExampleService extends ServiceBase<Example> {
       // Standard CRUD methods (inherited from base)
       async findOneExample(id: string): Promise<ResponseExampleDto | null>;
       async findAllExamples(): Promise<ResponseExampleDto[]>;
       async createExample(dto: CreateExampleDto): Promise<ResponseExampleDto>;
       async updateExample(id: string, dto: UpdateExampleDto): Promise<ResponseExampleDto>;
       async removeExample(id: string): Promise<void>;
       
       // Domain-specific methods
       async validateExampleState(id: string): Promise<void>;
       async processExampleAction(id: string): Promise<void>;
   }
   ```

#### Phase 3: Testing and Documentation
1. Update test patterns:
   - Add standard test cases for all services
   - Test relationship loading scenarios
   - Verify error handling patterns
   - Test transaction rollback cases

2. Enhance documentation:
   - Add detailed examples for each pattern
   - Document common pitfalls
   - Provide migration guides

### Implementation Timeline

1. Week 1: Base Pattern Updates
   - Update `ServiceBase` class
   - Create utility functions
   - Update documentation

2. Week 2-3: Service Refactoring
   - Refactor each service one at a time
   - Update tests for each service
   - Review and validate changes

3. Week 4: Testing and Validation
   - Comprehensive testing
   - Performance validation
   - Documentation updates

### Success Criteria

1. Code Consistency:
   - All services follow standard patterns
   - No duplicate validation methods
   - Consistent method naming

2. Error Handling:
   - Standardized error messages
   - Proper error contexts
   - Consistent error handling

3. Performance:
   - No N+1 query issues
   - Efficient relationship loading
   - Proper transaction usage

4. Maintainability:
   - Clear documentation
   - Comprehensive tests
   - Easy to understand patterns
