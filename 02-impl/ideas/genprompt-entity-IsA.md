# Entity Generation Guide - Is-A Relationship

## Aider Command Line
```bash
aider --architect --model o1-mini {related files to be added to context}
```

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in these tasks is to generate a complete entity implementation that establishes an Is-A relationship with an existing entity. Focus on creating proper inheritance relationships while maintaining data integrity. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples:
- `EntityName` is-a `BaseEntityName`
- AdminUser is-a User
- class AdminUser extends User {}

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase (e.g., AdminUser)
- Replace `<BaseEntityName>` with the base entity name in PascalCase (e.g., User)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files (models, services, controllers, DTOs)
  - camelCase for properties and methods (e.g., adminUserId)

### Entity Specification
{when generating this prompt we will put the entity model stub here: name, attributes, methods with description}

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Extends `<BaseEntityName>`
   - Adds new fields specific to this entity
2. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
   - Extends base service patterns
   - Handles specialized operations
3. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
4. DTOs (`my-app/packages/shared/src/dtos/`)
   - Create<EntityName>Dto.ts (extends base Create DTO)
   - Update<EntityName>Dto.ts (extends base Update DTO)
   - Response<EntityName>Dto.ts (extends base Response DTO)
5. Migration (`my-app/packages/backend/src/migrations/<timestamp>-Create<EntityName>.ts`)
6. Tests
   - Service Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)

### Verification Checklist
- [ ] Proper inheritance from base entity
- [ ] All imports are properly defined and exist
- [ ] Entity follows TypeORM inheritance pattern
- [ ] DTOs properly extend base DTOs
- [ ] Migration handles inheritance correctly
- [ ] Tests cover inherited and new functionality
- [ ] Service methods respect base entity constraints
- [ ] Controller endpoints follow REST conventions
- [ ] Error handling is consistent with base entity patterns
