# Entity Generation Guide - Part 1: Model, create and response DTOs, Migration (MDM)

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<timestamp>` with the current Unix timestamp (`date +%s`)
- Replace `<order>` with the sequence number for this migration (e.g., 001, 002)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear

## Migration File Naming Convention
- For new entities: `<timestamp>_<order>-Create<EntityName>.ts`
- For existing entities: `<timestamp>_<order>-Modify<OwnerEntityName>With<EntityName>.ts`

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model, its essential DTOs, and migration. Focus on proper data modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
{entity description and properties goes here}

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Entity definition with decorators
   - Column constraints and indices
   - Related interfaces/types

2. DTOs (`my-app/packages/shared/src/dtos/`)
   - Create<EntityName>Dto.ts
   - Response<EntityName>Dto.ts

3. Migration (`my-app/packages/backend/src/migrations/<migration filename>`)
   

### Verification Checklist
- [ ] Entity follows TypeORM patterns with proper decorators
- [ ] Proper @Index decorators for unique columns
- [ ] Comprehensive JSDoc documentation
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set
- [ ] DTOs have comprehensive OpenAPI examples
- [ ] DTOs have proper validation messages
- [ ] Migration includes proper indices
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