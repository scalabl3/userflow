# Entity Generation Guide - Part 1: Model, create and response DTOs, Migration (MDM)

## Instructions for Template Creation
- Replace `<EntityName>` with BillingProvider in PascalCase
- Replace `<timestamp>` with 1738084609
- Replace `<order>` with 009
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear

## Migration File Naming Convention
- For new entities: `<timestamp>-<order>-CREATE-<EntityPascalCase>.ts`
- For existing entities: `<timestamp>-<order>-ALTER-<OwnerEntityPascalCase>-WITH-<EntityPascalCase>.ts`
- For adding foreign key to entity: `<timestamp>-<order>-ADD-<EntityPascalCase>-<FK>-<TargetEntityPascalCase>.ts`

## Migration Class Naming Convention
- For new entities: `export class Create${EntityPascalCase}${timestamp}${order} implements MigrationInterface`
- For existing entities: `export class Alter${OwnerEntityPascalCase}With${EntityPascalCase}${timestamp}${order} implements MigrationInterface`
- For adding foreign key to entity: `export class Add${EntityPascalCase}Fk${TargetEntityPascalCase}${timestamp}${order} implements MigrationInterface`

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model, its essential DTOs, and migration. Focus on proper data modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
BillingProvider represents a payment provider supported by the system. Key aspects:
- Each provider has a unique name (e.g., Stripe, Apple Pay, Google Pay, PayPal)
- Providers can be enabled/disabled for system-wide use
- Providers can be made visible/invisible to users
- Provider type is an enum of supported providers
- Provider requires configuration and credentials (to be expanded later)
- Similar pattern to LoginProvider in terms of usage and management

### Files to Generate

1. Model (`my-app/packages/backend/src/models/BillingProvider.ts`)
   - Entity definition with decorators for billing provider
   - Unique constraint on name
   - Enum for provider type
   - Boolean flags for enabled/visible status
   - Timestamps for creation and modification

2. DTOs (`my-app/packages/shared/src/dtos/BillingProvider/`)
   - CreateBillingProviderDto.ts with validation
   - ResponseBillingProviderDto.ts with proper field exposure

3. Migration (`my-app/packages/backend/src/migrations/1738084609-009-CREATE-BillingProvider.ts`)
   - Create billing_provider table
   - Add unique index on name
   - Set up enabled/visible defaults
   - Include provider type enum

### Verification Checklist
- [ ] Entity follows TypeORM patterns with proper decorators
- [ ] Proper @Index decorator for unique name
- [ ] Comprehensive JSDoc documentation for billing provider
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set for enabled/visible
- [ ] DTOs have comprehensive OpenAPI examples for billing providers
- [ ] DTOs have proper validation messages for required fields
- [ ] Migration includes proper index for unique name
- [ ] Migration has proper up/down methods
- [ ] All imports are properly organized and exist

### Code Structure Guidelines

#### Model Structure
Required Imports:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
```

Key Points:
- Use appropriate TypeORM decorators for entity and columns
- Include class-validator decorators for validation
- Add indices for unique constraints
- Follow consistent naming conventions
- Include comprehensive JSDoc documentation
- Handle null/undefined cases properly
- Use proper column types and constraints
- Follow established patterns for timestamps

Example Pattern:
```typescript
@Entity('example_table')
@Index(['uniqueField'], { unique: true })
export class ExampleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty({ message: 'Field is required' })
    requiredField: string;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    optionalField?: string;

    @CreateDateColumn()
    createdAt: Date;
}
```

#### DTO Structure
Required Imports:
```typescript
// For Create DTO
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// For Response DTO
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
```

Create DTO Key Points:
- Include all required fields with proper validation
- Add comprehensive OpenAPI documentation
- Use appropriate class-validator decorators
- Handle optional fields correctly
- Include meaningful examples
- Add clear validation messages
- Follow consistent naming patterns

Example Create DTO Pattern:
```typescript
export class CreateExampleDto {
    @ApiProperty({
        description: 'Clear description of the field purpose',
        example: 'Example value'
    })
    @IsNotEmpty({ message: 'Clear validation message' })
    requiredField: string;

    @ApiProperty({
        description: 'Optional field description',
        required: false
    })
    @IsOptional()
    optionalField?: string;
}
```

Response DTO Key Points:
- Use class-transformer decorators appropriately
- Expose only necessary fields
- Include comprehensive OpenAPI documentation
- Handle date formatting consistently
- Manage sensitive data appropriately
- Follow established response patterns
- Include meaningful examples

Example Response DTO Pattern:
```typescript
@Exclude()
export class ResponseExampleDto {
    @Expose()
    @ApiProperty({
        description: 'Clear field description',
        example: 'Meaningful example'
    })
    field: string;

    @Expose()
    @ApiProperty({
        description: 'Timestamp field',
        example: '2024-01-01T00:00:00Z'
    })
    createdAt: Date;
}
```

#### Migration Structure
Required Imports:
```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
```

Key Points:
- Follow established naming convention
- Create tables with proper constraints
- Add appropriate indices
- Handle foreign keys properly
- Include both up and down methods
- Use transactions where appropriate
- Follow consistent column naming
- Handle default values appropriately

Example Migration Pattern:
```typescript
export class CreateExample_<timestamp>_<order> implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'example_table',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'required_field',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP'
                    }
                ],
                indices: [
                    new TableIndex({
                        name: 'IDX_EXAMPLE_UNIQUE_FIELD',
                        columnNames: ['unique_field'],
                        isUnique: true
                    })
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('example_table');
    }
} 