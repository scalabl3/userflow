# Entity Generation Guide - Standalone Entity

## Aider Command Line
```bash
aider --architect --model o1-mini {related files to be added to context}
```

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in these tasks is to generate a complete entity implementation. Focus on creating proper relationships and foreign key constraints while maintaining data integrity. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples:
- A standalone entity like User or Organization
- An entity with its own lifecycle and identity
- Independent data that other entities may reference

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase (e.g., Organization)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files (models, services, controllers, DTOs)
  - camelCase for properties and methods (e.g., organizationId)

### Entity Specification
{when generating this prompt we will put the entity model stub here: name, attributes, methods with description}


### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
2. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
3. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
4. DTOs (`my-app/packages/shared/src/dtos/`)
   - Create<EntityName>Dto.ts
   - Update<EntityName>Dto.ts
   - Response<EntityName>Dto.ts
5. Migration (`my-app/packages/backend/src/migrations/<timestamp>-Create<EntityName>.ts`)
6. Tests
   - Service Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)

### Verification Checklist
- [ ] All imports are properly defined and exist
- [ ] Entity follows TypeORM decorators pattern
- [ ] DTOs use class-validator decorators
- [ ] Migration uses correct TypeORM schema definitions
- [ ] Tests cover CRUD operations
- [ ] Service methods handle edge cases
- [ ] Controller endpoints follow REST conventions
- [ ] Error handling is consistent with existing patterns
