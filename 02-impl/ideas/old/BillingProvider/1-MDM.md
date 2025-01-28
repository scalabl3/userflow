# Entity Generation Guide - Part 1: Model, DTOs, Migration (MDM)

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model, its essential DTOs, and migration for the BillingProvider entity. Focus on proper data modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
BillingProvider represents a payment provider supported by the system. Key aspects:
- Each provider has a unique name (e.g., Stripe, Apple Pay, Google Pay, PayPal)
- Providers can be enabled/disabled for system-wide use
- Providers can be made visible/invisible to users
- Provider type is an enum of supported providers
- Provider requires configuration and credentials (to be expanded later)
- Similar pattern to LoginProvider in terms of usage and management

Properties:
- id: UUID (primary key)
- name: string (unique, required) - Display name for the provider
- providerType: enum (required) - Type of provider (STRIPE, APPLE_PAY, GOOGLE_PAY, PAYPAL)
- isEnabled: boolean (default: false) - Whether the provider is enabled for use
- isVisible: boolean (default: false) - Whether the provider is visible to users
- description: string (optional) - Description of the provider
- createdAt: Date (auto-generated)
- modifiedAt: Date (auto-generated)

### Files to Generate

1. Enum (`my-app/packages/shared/src/enums/BillingProviderType.ts`)
   - Provider type enum definition
   - Export for use in both backend and frontend
   - Include JSDoc documentation
   - Define values: STRIPE, APPLE_PAY, GOOGLE_PAY, PAYPAL

2. Model (`my-app/packages/backend/src/models/BillingProvider.ts`)
   - Entity definition with TypeORM decorators
   - Column constraints and indices
   - Import provider type enum from shared package
   - Include validation decorators
   - Add comprehensive JSDoc documentation

3. DTOs (`my-app/packages/shared/src/dtos/BillingProvider/`)
   - CreateBillingProviderDto.ts with validation and OpenAPI docs
   - ResponseBillingProviderDto.ts with class-transformer decorators

4. Migration (`my-app/packages/backend/src/migrations/1738084609_009-CreateBillingProvider.ts`)
   - Table creation with proper column types
   - Unique index on name column
   - Provider type enum handling
   - Up and down methods

### Verification Checklist
- [ ] Enum is properly defined in shared package
- [ ] Entity follows TypeORM patterns with proper decorators
- [ ] Proper @Index decorators for unique columns
- [ ] Comprehensive JSDoc documentation
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set
- [ ] DTOs have comprehensive OpenAPI examples
- [ ] DTOs have proper validation messages
- [ ] Migration includes proper indices
- [ ] Migration has proper up/down methods
- [ ] All imports properly organized and exist

### File Generation Guidelines

#### Enum Guidelines
- Define in shared package for cross-package use
- Use clear, descriptive names
- Include JSDoc documentation
- Follow existing enum patterns

#### Model Guidelines
- Use `@Index` decorators for unique columns
- Organize imports: TypeORM first, class-validator, others
- Include comprehensive JSDoc documentation
- Export related interfaces/types
- Use proper null handling
- Include proper column constraints and defaults
- Import provider type enum from shared package

#### DTO Guidelines
Create DTOs:
- Include comprehensive OpenAPI examples
- Include proper validation messages
- Organize imports properly
- Use class-validator decorators
- Import provider type enum from shared package

Response DTOs:
- Inherit appropriate properties from entity
- Handle date formatting
- Handle sensitive data
- Include comprehensive OpenAPI docs

#### Migration Guidelines
- Create proper indices
- Include comprehensive column constraints
- Set appropriate default values
- Include proper down migration
- Use transactions
- Follow naming convention: 1738084609-009-CreateBillingProvider.ts

### Code Structure Examples

The following sections provide guidance on the expected structure and patterns for each file type. Do not copy these directly; they are for reference to understand the patterns to follow.

#### Enum Structure
- Export enum with JSDoc documentation
- Use uppercase values
- Include all supported provider types

#### Model Structure
- Use TypeORM decorators for entity and columns
- Include validation decorators
- Add indices for unique constraints
- Include comprehensive JSDoc
- Follow strict null handling

#### DTO Structure
Create DTO:
- Include all required fields with validation
- Add OpenAPI documentation
- Use proper types and imports

Response DTO:
- Use class-transformer decorators
- Include all entity fields
- Add OpenAPI documentation

#### Migration Structure
- Implement MigrationInterface
- Create enum type in database
- Create table with proper columns
- Add indices
- Include both up and down methods 