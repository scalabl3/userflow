# Entity Creation Process

## Overview
This document outlines the step-by-step process for creating new entities in the system. Each step builds upon the previous, ensuring proper domain modeling, data persistence, and API exposure.

## Order of Operations

### 1. Model & Migration Layer
- Create entity model following `design-models.md` standards
- Define core fields, relationships, and validation rules
- Create corresponding migration to set up database structure
- Verify model builds and migration runs
- Write model tests following `design-model-tests.md` standards

### 2. DTO Layer
- Create DTOs based on model structure
- Define create/update/response contracts
- Map relationships to appropriate DTO forms
- Document API shape and constraints
- Reference `design-dto.md` for standards

### 3. Mock Layer
- Create mock data following `design-mocks.md` standards
- Provide model instances for model/test layer
- Provide DTO instances for service/controller layer
- Set up relationships between mocks
- Ensure mocks support all test scenarios

### 4. Test Layer
- Write model tests (validate model behavior)
- Write service tests (validate business logic)
- Write controller tests (validate API contracts)
- Use appropriate mocks for each layer
- Follow layer-specific test standards

### 5. Service Layer
- Implement service following `design-services.md`
- Convert between DTOs and models
- Implement business logic and validation
- Handle relationships and cascading operations
- Ensure proper error handling

### 6. Controller Layer
- Implement controller following `design-controllers.md`
- Define routes and HTTP methods
- Handle DTO validation
- Delegate to service layer
- Implement proper error responses

## Dependencies

When creating entities with relationships:
1. Parent entities must be fully implemented first
2. Child entities reference existing parents
3. Circular dependencies must be carefully managed
4. Consider database constraints and cascades

## Implementation Flow Example

Creating a new `Comment` entity that belongs to a `Post`:

1. **Model & Migration**
   - Ensure Post model exists and is stable
   - Create Comment model with Post relationship
   - Create migration with foreign key to posts
   - Write model tests
   - Verify build and migration

2. **DTOs**
   - Create CommentDtos referencing post by ID
   - Define input/output contracts
   - Document API structure

3. **Mocks**
   - Create comment.mock.ts
   - Set up relationship with post.mock.ts
   - Support both model and DTO testing

4. **Tests**
   - Write Comment model tests
   - Write CommentService tests
   - Write CommentController tests

5. **Service**
   - Implement CommentService
   - Handle Post relationship
   - Implement business rules

6. **Controller**
   - Implement CommentController
   - Define REST endpoints
   - Handle Comment-Post operations

## Verification Checklist

For each layer:

### Model Layer
- [ ] Follows model standards
- [ ] Relationships properly defined
- [ ] Validation rules in place
- [ ] Migration handles all fields
- [ ] Model tests passing

### DTO Layer
- [ ] Contracts match requirements
- [ ] Relationships properly mapped
- [ ] Validation rules defined
- [ ] Documentation complete

### Mock Layer
- [ ] Supports model testing
- [ ] Supports DTO testing
- [ ] Relationships configured
- [ ] Test variations provided

### Test Layer
- [ ] Model behavior verified
- [ ] Business logic verified
- [ ] API contracts verified
- [ ] Edge cases covered

### Service Layer
- [ ] Business rules implemented
- [ ] Proper error handling
- [ ] Relationship management
- [ ] Transaction handling

### Controller Layer
- [ ] REST endpoints defined
- [ ] DTO validation
- [ ] Error responses
- [ ] Documentation

## Success Criteria
- Each layer builds without errors
- All tests pass
- Relationships work correctly
- API contracts are satisfied
- Error cases are handled
- Documentation is complete 