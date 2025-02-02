# Model Test Design Standards

## Overview
This document outlines the standards for unit testing model classes. These tests focus on the behavior of the model classes themselves, not their interaction with TypeORM or other frameworks.

## Test Scope

### What to Test
1. Property getters and setters
2. Default values
3. Computed properties
4. Class methods
5. Type safety
6. Basic property initialization

### What NOT to Test
1. ❌ TypeORM decorators
2. ❌ Database operations
3. ❌ Framework configurations
4. ❌ Validation decorators
5. ❌ Relationship loading

## Test Structure Standards

### Required Test Categories
```typescript
describe('EntityName', () => {
    let entity: EntityName;
    
    beforeEach(() => {
        entity = new EntityName();
        // Only set REQUIRED defaults
        // No relationship setup
    });

    describe('initialization', () => {
        // Instance creation
        // Default values
        // Required state
    });

    describe('properties', () => {
        // Basic properties by group
        // Optional properties
        // Enum properties
    });

    describe('timestamps', () => {
        // Created/Modified timestamps
        // Custom timestamps (e.g., lastLoginAt)
    });

    describe('computed properties', () => {
        // Getters
        // Derived values
    });

    describe('state management', () => {
        // State transitions
        // Status flags
        // Enabled/disabled
    });

    describe('methods', () => {
        // By method name
        // Parameters
        // Return values
        // Error cases
    });
});
```

### Test Naming Standards

#### Initialization Tests
```typescript
it('should create a valid instance')
it('should initialize with correct defaults')
```

#### Property Tests
```typescript
it('should get and set propertyName')
it('should handle optional propertyName')
it('should enforce propertyName constraints')
```

#### Timestamp Tests
```typescript
it('should track creation time')
it('should track modification time')
it('should handle custom timestamp propertyName')
```

#### Computed Property Tests
```typescript
it('should compute propertyName from dependencies')
it('should handle edge cases in computation')
```

#### State Tests
```typescript
it('should transition state from X to Y')
it('should manage enabled/disabled status')
```

#### Method Tests
```typescript
it('should methodName with valid parameters')
it('should handle methodName errors appropriately')
```

### Setup Standards

#### Do
```typescript
beforeEach(() => {
    entity = new Entity();
    entity.requiredProp = 'default';  // Only if required
});
```

#### Don't
```typescript
beforeEach(() => {
    entity = new Entity();
    related = new Related();  // ❌ No relationships
    entity.optionalProp = 'value';  // ❌ No optional setup
});
```

### Assertion Standards

#### Property Assertions
```typescript
// Value Tests
expect(entity.prop).toBe(value);
expect(entity.prop).toBeUndefined();
expect(entity.array).toEqual([]);

// Type Tests
expect(typeof entity.prop).toBe('string');
expect(entity.date).toBeInstanceOf(Date);
expect(Array.isArray(entity.items)).toBe(true);

// State Tests
expect(entity.state).toBe(State.ACTIVE);
expect(entity.isEnabled).toBe(true);

// Method Tests
expect(() => entity.method()).not.toThrow();
expect(entity.method()).toEqual(expectedValue);
```

## What NOT to Test in Model Tests

### Relationship Behavior
❌ Don't test these (move to integration tests):
```typescript
it('should handle bidirectional relationship', () => {
    const related = new Related();
    entity.related = related;
    expect(related.entity).toBe(entity);  // ❌ Integration test
});
```

### Database Operations
❌ Don't test these (move to integration tests):
```typescript
it('should cascade delete', () => {
    entity.related = new Related();
    await entity.remove();  // ❌ Database operation
});
```

### Framework Features
❌ Don't test these (framework's responsibility):
```typescript
it('should validate using decorators', () => {
    entity.name = '';
    const errors = await validate(entity);  // ❌ Framework test
});
```

## Implementation Order

### By Entity Complexity
1. Simple Entities (e.g., Organization)
   - Basic properties
   - Standard timestamps
   - Few or no methods

2. Base Entities (e.g., BaseUser)
   - Inheritance base
   - State management
   - Common properties

3. Derived Entities (e.g., User)
   - Inherited behavior
   - Additional properties
   - Overridden methods

4. Complex Entities (e.g., LoginCredential)
   - Multiple states
   - Many properties
   - Complex methods

### By Test Category
1. Initialization Tests
2. Property Tests
3. Timestamp Tests
4. Computed Properties
5. State Management
6. Methods

## Migration Steps

### For Each Entity
1. Create new test structure
2. Move existing tests to categories
3. Remove relationship tests
4. Add missing standard tests
5. Clean up duplicates
6. Verify coverage

### Clean Up Steps
1. Remove relationship setup
2. Remove framework-specific tests
3. Remove database operations
4. Consolidate duplicate tests
5. Standardize test names
6. Add missing tests per category

## Examples

### Simple Entity Test
```typescript
describe('Organization', () => {
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization();
    });

    it('should set and get name', () => {
        organization.name = 'Test Org';
        expect(organization.name).toBe('Test Org');
    });

    it('should initialize with default values', () => {
        expect(organization.visible).toBe(false);
        expect(organization.users).toEqual([]);
    });
});
```

### Complex Entity Test
```typescript
describe('User', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
    });

    describe('properties', () => {
        it('should set and get basic properties', () => {
            user.firstName = 'John';
            user.lastName = 'Doe';
            user.email = 'john@example.com';
            
            expect(user.firstName).toBe('John');
            expect(user.lastName).toBe('Doe');
            expect(user.email).toBe('john@example.com');
        });
    });

    describe('computed properties', () => {
        it('should compute full name', () => {
            user.firstName = 'John';
            user.lastName = 'Doe';
            expect(user.fullName).toBe('John Doe');
        });
    });

    describe('methods', () => {
        it('should update last login', () => {
            const date = new Date();
            user.updateLastLogin(date);
            expect(user.lastLoginAt).toBe(date);
        });
    });
});
```

### Relationship Field Testing Standards

#### Foreign Key Tests
```typescript
describe('relationships', () => {
    describe('foreign keys', () => {
        it('should get and set xxxId', () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';
            entity.xxxId = id;
            expect(entity.xxxId).toBe(id);
        });

        it('should require xxxId when relationship is required', () => {
            // Only test required foreign keys
            expect(entity.xxxId).toBeUndefined();
            expect(() => validate(entity)).rejects.toHaveProperty('constraints.isUuid');
        });

        it('should allow undefined xxxId when relationship is optional', () => {
            // Only test optional foreign keys
            expect(entity.xxxId).toBeUndefined();
            expect(() => validate(entity)).resolves.toBe(true);
        });
    });
});
```

#### Collection Initialization Tests
```typescript
describe('relationships', () => {
    describe('collections', () => {
        it('should initialize xxx collection as empty array', () => {
            expect(entity.xxx).toBeDefined();
            expect(Array.isArray(entity.xxx)).toBe(true);
            expect(entity.xxx).toHaveLength(0);
        });
    });
});
```

#### What NOT to Test

❌ **Don't Test Relationship Loading**
```typescript
// ❌ DON'T DO THIS
it('should load related entity', async () => {
    const related = await entity.xxx;  // Don't test lazy loading
    expect(related).toBeDefined();
});
```

❌ **Don't Test Cascading**
```typescript
// ❌ DON'T DO THIS
it('should cascade delete related entities', async () => {
    await entity.remove();  // Don't test database operations
    expect(await Related.count()).toBe(0);
});
```

❌ **Don't Test Bidirectional Updates**
```typescript
// ❌ DON'T DO THIS
it('should update both sides of relationship', () => {
    const related = new Related();
    entity.xxx = related;
    expect(related.entity).toBe(entity);  // Don't test ORM behavior
});
```

#### Implementation Examples

1. **Required One-to-One Tests**
```typescript
describe('adminUser relationship', () => {
    describe('foreign key', () => {
        it('should get and set adminUserId', () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';
            organization.adminUserId = id;
            expect(organization.adminUserId).toBe(id);
        });

        it('should require adminUserId', async () => {
            expect(organization.adminUserId).toBeUndefined();
            const errors = await validate(organization);
            expect(errors[0].constraints).toHaveProperty('isUuid');
        });
    });
});
```

2. **Optional Many-to-One Tests**
```typescript
describe('organization relationship', () => {
    describe('foreign key', () => {
        it('should get and set organizationId', () => {
            const id = '123e4567-e89b-12d3-a456-426614174000';
            user.organizationId = id;
            expect(user.organizationId).toBe(id);
        });

        it('should allow undefined organizationId', async () => {
            expect(user.organizationId).toBeUndefined();
            const errors = await validate(user);
            expect(errors).toHaveLength(0);
        });
    });
});
```

3. **Collection Tests**
```typescript
describe('loginCredentials relationship', () => {
    describe('collection', () => {
        it('should initialize loginCredentials as empty array', () => {
            expect(baseUser.loginCredentials).toBeDefined();
            expect(Array.isArray(baseUser.loginCredentials)).toBe(true);
            expect(baseUser.loginCredentials).toHaveLength(0);
        });
    });
});
```

#### Test Implementation Checklist
- [ ] Foreign key getter/setter tests
- [ ] Required foreign key validation tests
- [ ] Optional foreign key validation tests
- [ ] Collection initialization tests
- [ ] No relationship loading tests
- [ ] No cascade operation tests
- [ ] No bidirectional update tests
- [ ] Clear test descriptions
- [ ] Proper UUID format in examples
- [ ] Validation error checks
