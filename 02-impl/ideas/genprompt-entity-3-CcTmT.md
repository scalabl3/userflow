# Entity Generation Guide - Part 3: Controller, Tests (CcTmT)

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
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this third phase is to generate the controller layer and comprehensive tests. Focus on API design, request handling, and thorough testing. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods

### Entity Specification
{entity model stub goes here}

### Files to Generate

1. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
   - REST endpoints
   - Request/Response handling
   - Error handling
   - OpenAPI documentation

2. Tests
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
     - Endpoint tests
     - Error handling tests
     - Request validation tests
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)
     - Validation tests
     - Constraint tests
     - Relationship tests

### Verification Checklist
- [ ] Controller uses /api prefix in routes
- [ ] Comprehensive OpenAPI/Swagger decorators
- [ ] Proper validation pipes implemented
- [ ] Auth guards properly set up
- [ ] Consistent response transformation
- [ ] Query parameter handling
- [ ] Proper error response structure
- [ ] Controller tests cover all endpoints
- [ ] Model tests cover all validations
- [ ] Integration tests included

### File Generation Guidelines

#### Controller Guidelines
- Use `/api` prefix in routes
- Include comprehensive OpenAPI/Swagger decorators
- Implement proper validation pipes
- Include proper auth guards
- Transform responses consistently
- Handle query parameters properly
- Include specialized endpoints
- Follow consistent error response structure
- Use proper HTTP status codes
- Handle file uploads/downloads if needed

#### Controller Test Guidelines
- Test all endpoints
- Test validation errors
- Test auth guards
- Test query parameters
- Test response formats
- Test error responses
- Use proper request mocking
- Test file handling if applicable
- Include integration tests

#### Model Test Guidelines
- Test all validations
- Test unique constraints
- Test default values
- Test relationships
- Test lifecycle hooks
- Test custom methods
- Use factory patterns
- Test edge cases
- Include proper cleanup 