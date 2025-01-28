# Entity Generation Guide - Part 2: Service, Update DTO, Service Tests (SDsT)

## Aider Command Line
```bash
gouserflow && rm -rf .aider.tags.cache.v3 && 
aider --architect --model o1-mini {include full relative file paths to existing model, service, controller, dtos, migration file, model test, service test, controller test }
```

## Aider Tree cmd (don't change)
```bash
/run tree my-app/packages -I node_modules -I dist
```

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this second phase is to generate the service layer, update DTOs, and comprehensive service tests. Focus on business logic, data integrity, and proper error handling. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods

### Entity Specification
{entity model stub goes here}

### Files to Generate

1. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
   - CRUD operations
   - Business logic methods
   - Error handling
   - Transaction handling

2. DTOs (`my-app/packages/shared/src/dtos/`)
   - Update<EntityName>Dto.ts

3. Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
   - CRUD operation tests
   - Business logic tests
   - Error handling tests

### Verification Checklist
- [ ] Service implements proper error handling
- [ ] Service includes specialized business methods
- [ ] Proper transaction handling implemented
- [ ] Logging properly implemented
- [ ] Update DTO extends Partial<CreateDTO>
- [ ] Update DTO has proper validation
- [ ] Tests cover all service methods
- [ ] Tests include error cases
- [ ] Tests use proper mocking
- [ ] Tests handle transactions correctly

### File Generation Guidelines

#### Service Guidelines
- Implement proper error handling for unique constraints
- Include specialized methods (enable/disable, visibility)
- Implement soft delete handling
- Use TypeORM transactions where needed
- Implement proper logging
- Include configuration validation
- Use TypeORM query builder for complex queries
- Implement pagination for list operations

#### Update DTO Guidelines
- Extend Partial<CreateDTO>
- Include validation for partial updates
- Include comprehensive OpenAPI docs
- Handle nested object updates properly
- Include proper validation messages

#### Service Test Guidelines
- Create test data factories
- Implement proper mocks
- Cover edge cases
- Handle test transactions
- Test error scenarios
- Test business logic thoroughly
- Implement proper cleanup
- Use test database
- Mock external services 