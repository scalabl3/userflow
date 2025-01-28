# Entity Generation Guide - Has-A Relationship

## Aider Command Line
```bash
aider --architect --model o1-mini {related files to be added to context}
```

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in these tasks is to generate a complete entity implementation that establishes a Has-A relationship with an existing entity. Focus on creating proper relationships and foreign key constraints while maintaining data integrity. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples: 
- `OwnerEntityName` has-a `EntityName`
- User has-a Preferences
- User.preferences = new Preferences();

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase (e.g., BillingCredential)
- Replace `<OwnerEntityName>` with the containing entity name in PascalCase (e.g., BillingCredentialSet)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files (models, services, controllers, DTO folder, DTOs)
  - camelCase for properties and methods (e.g., billingCredential)

### Entity Specification
{when generating this prompt we will put the entity model stub here: name, attributes, methods with description; this will include if it's 1:1, 1:M}

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Includes relationship decorators
   - Foreign key constraints
2. Service (`my-app/packages/backend/src/services/<EntityName>Service.ts`)
   - Handles relationship operations
   - Maintains referential integrity
3. Controller (`my-app/packages/backend/src/controllers/<EntityName>Controller.ts`)
4. DTOs (`my-app/packages/shared/src/dtos/`)
   - Create<EntityName>Dto.ts
   - Update<EntityName>Dto.ts
   - Response<EntityName>Dto.ts
5. Migrations
   - (`my-app/packages/backend/src/migrations/<timestamp>-Create<EntityName>.ts`)
   - (`my-app/packages/backend/src/migrations/<timestamp>-Add<EntityName>ForeignKeys.ts`)
6. Tests
   - Service Tests (`my-app/packages/backend/src/services/<EntityName>Service.spec.ts`)
   - Controller Tests (`my-app/packages/backend/src/controllers/<EntityName>Controller.spec.ts`)
   - Model Tests (`my-app/packages/backend/src/models/<EntityName>.spec.ts`)
7. Owner Entity Updates
   - Update owner entity model with relationship
   - Update owner entity DTOs if needed
   - Update owner entity tests

### Verification Checklist
- [ ] All imports are properly defined and exist
- [ ] Entity relationships are properly decorated
- [ ] Foreign key constraints are correctly defined
- [ ] DTOs handle relationship fields appropriately
- [ ] Migrations include both table and foreign key creation
- [ ] Tests cover relationship operations
- [ ] Service methods maintain referential integrity
- [ ] Controller endpoints follow REST conventions
- [ ] Owner entity is correctly updated
- [ ] Error handling covers relationship scenarios
