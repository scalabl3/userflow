# Entity Generation Guide - BillingProvider

## Aider Command Line
```bash
gouserflow &&
aider --architect --model o1-mini my-app/packages/backend/src/models/LoginProvider.ts my-app/packages/backend/src/services/LoginProviderService.ts my-app/packages/backend/src/controllers/LoginProviderController.ts
```

## Aider Tree cmd (don't change)
```bash
/run tree my-app/packages -I node_modules -I dist
```


## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in these tasks is to generate a complete entity implementation. Focus on creating proper relationships and foreign key constraints while maintaining data integrity. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples:
- A standalone entity like LoginProvider
- A configurable payment provider (Stripe, Apple Pay, Google Pay, PayPal)
- System-level configuration that can be enabled/disabled by admins

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with `BillingProvider`
- Replace `<timestamp>` with `1738084609` in migration filename
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files (models, services, controllers, DTOs)
  - camelCase for properties and methods (e.g., billingProviderId)

### Entity Specification
```typescript
/**
 * BillingProvider entity represents available payment processing options
 * that can be enabled/disabled by system administrators.
 */
@Entity()
export class BillingProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsNotEmpty()
  name: string;  // e.g., "Stripe", "Apple Pay", "Google Pay", "PayPal"

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsNotEmpty()
  identifier: string;  // Unique identifier e.g., "stripe", "apple_pay"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isEnabled: boolean;  // Controls if this provider is available for use

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;  // Controls if this provider is visible in UI

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;  // Provider-specific configuration

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

### Files to Generate

1. Model (`my-app/packages/backend/src/models/BillingProvider.ts`)
2. Service (`my-app/packages/backend/src/services/BillingProviderService.ts`)
3. Controller (`my-app/packages/backend/src/controllers/BillingProviderController.ts`)
4. DTOs (`my-app/packages/shared/src/dtos/`)
   - CreateBillingProviderDto.ts
   - UpdateBillingProviderDto.ts
   - ResponseBillingProviderDto.ts
5. Migration (`my-app/packages/backend/src/migrations/<timestamp>-CreateBillingProvider.ts`)
6. Tests
   - Service Tests (`my-app/packages/backend/src/services/BillingProviderService.spec.ts`)
   - Controller Tests (`my-app/packages/backend/src/controllers/BillingProviderController.spec.ts`)
   - Model Tests (`my-app/packages/backend/src/models/BillingProvider.spec.ts`)

### Verification Checklist
- [ ] All imports are properly defined and exist
- [ ] Entity follows TypeORM decorators pattern
- [ ] DTOs use class-validator decorators
- [ ] Migration uses correct TypeORM schema definitions
- [ ] Tests cover CRUD operations
- [ ] Service methods handle edge cases
- [ ] Controller endpoints follow REST conventions
- [ ] Error handling is consistent with existing patterns
- [ ] Visibility controls work correctly
- [ ] Provider configuration is properly validated
- [ ] Unique constraints on name and identifier are enforced 

### File Generation Guidelines

#### Models
- Use `@Index` decorators for unique columns
- Organize imports: TypeORM first, then class-validator, then others
- Include comprehensive JSDoc documentation
- Export related interfaces and types
- Use proper null handling with TypeScript strict mode
- Include proper column constraints and defaults

#### Services
- Implement proper error handling for unique constraints
- Include specialized methods (enable/disable, visibility)
- Implement soft delete handling
- Use TypeORM transactions where needed
- Implement proper logging
- Include configuration validation
- Use TypeORM query builder for complex queries
- Implement pagination for list operations

#### Controllers
- Use `/api` prefix in routes
- Include comprehensive OpenAPI/Swagger decorators
- Implement proper validation pipes
- Include proper auth guards
- Transform responses consistently
- Handle query parameters properly
- Include specialized endpoints
- Follow consistent error response structure

#### DTOs
Create DTOs:
- Include comprehensive OpenAPI examples
- Include proper validation messages
- Implement configuration type validation
- Organize imports properly

Update DTOs:
- Extend Partial<CreateDTO>
- Include validation for partial updates
- Include comprehensive OpenAPI docs

Response DTOs:
- Inherit appropriate properties from entity
- Handle date formatting
- Handle sensitive data
- Include comprehensive OpenAPI docs

#### Migrations
- Create proper indices
- Include comprehensive column constraints
- Set appropriate default values
- Include proper down migration
- Use transactions

#### Tests
- Create test data factories
- Implement proper mocks
- Cover edge cases
- Handle test transactions
- Implement proper cleanup
- Include integration tests
- Test error cases

#### Module Configuration
- Configure proper dependency injection
- Set up proper validation pipes
- Configure proper logging
- Set up proper error handling
- Configure proper OpenAPI documentation 