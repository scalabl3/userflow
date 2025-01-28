# Entity Generation Guide - Is-A Relationship - Part 1: Model, DTOs, Migration (MDM)

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model, its essential DTOs, and migration for an entity that has an Is-A relationship with another entity. Focus on proper inheritance modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples:
- `EntityName` is-a `BaseEntityName`
- AdminUser is-a User
- class AdminUser extends User {}

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase (e.g., AdminUser)
- Replace `<BaseEntityName>` with the base entity name in PascalCase (e.g., User)
- Replace `<timestamp>` with the current Unix timestamp (`date +%s`)
- Replace `<order>` with the sequence number for this migration (e.g., 001, 002)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods

### Entity Specification
{entity properties goes here}

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Entity definition with inheritance
   - Additional fields specific to this entity
   - Column constraints and indices
   - Inherited field overrides if needed

2. DTOs (`my-app/packages/shared/src/dtos/`)
   - Create<EntityName>Dto.ts (extends base Create DTO)
   - Response<EntityName>Dto.ts (extends base Response DTO)

3. Migration (`my-app/packages/backend/src/migrations/<timestamp>_<order>_Create<EntityName>.ts`)
   - Table creation with inheritance
   - Additional columns
   - Indices
   - Inheritance constraints

### Verification Checklist
- [ ] Entity properly extends base entity
- [ ] Entity follows TypeORM inheritance pattern
- [ ] Proper @Index decorators for unique columns
- [ ] Comprehensive JSDoc documentation
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set
- [ ] DTOs properly extend base DTOs
- [ ] DTOs have comprehensive OpenAPI examples
- [ ] DTOs have proper validation messages
- [ ] Migration handles inheritance correctly
- [ ] Migration includes proper indices
- [ ] Migration has proper up/down methods
- [ ] All imports are properly organized and exist

### File Generation Guidelines

#### Model Guidelines
- Use proper inheritance pattern (@ChildEntity or table inheritance)
- Override base properties where needed
- Add new fields specific to child entity
- Use `@Index` decorators for unique columns
- Organize imports: TypeORM first, class-validator, others
- Include comprehensive JSDoc documentation
- Export related interfaces and types
- Use proper null handling
- Include proper column constraints and defaults

#### DTO Guidelines
Create DTOs:
- Extend base Create DTO
- Add fields specific to child entity
- Include comprehensive OpenAPI examples
- Include proper validation messages
- Organize imports properly
- Use class-validator decorators

Response DTOs:
- Extend base Response DTO
- Add fields specific to child entity
- Handle date formatting
- Handle sensitive data
- Include comprehensive OpenAPI docs

#### Migration Guidelines
- Handle inheritance pattern correctly
- Create proper indices
- Include comprehensive column constraints
- Set appropriate default values
- Include proper down migration
- Use transactions
- Follow naming convention: <timestamp>_<order>_Create<EntityName>.ts

### Generic Stubs

#### Model Stub
```typescript
import { ChildEntity, Column } from 'typeorm';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { BaseEntity } from './BaseEntity';

/**
 * <EntityName> entity extends <BaseEntityName> with additional functionality.
 * It adds [describe additional features and purpose].
 */
@ChildEntity()
export class <EntityName> extends <BaseEntityName> {
    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty({ message: 'Special field is required' })
    specialField: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isSpecial: boolean;

    @Column({ type: 'varchar', nullable: true })
    @IsOptional()
    additionalInfo?: string;
}
```

#### DTO Stubs

Create DTO:
```typescript
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Create<BaseEntityName>Dto } from '../<BaseEntityName>/Create<BaseEntityName>Dto';

export class Create<EntityName>Dto extends Create<BaseEntityName>Dto {
    @ApiProperty({
        description: 'The special field specific to this entity',
        example: 'Special Value',
    })
    @IsNotEmpty({ message: 'Special field is required' })
    specialField: string;

    @ApiProperty({
        description: 'Whether the entity is special',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isSpecial?: boolean;

    @ApiProperty({
        description: 'Additional information specific to this entity',
        example: 'Additional details',
        required: false,
    })
    @IsOptional()
    additionalInfo?: string;
}
```

Response DTO:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Response<BaseEntityName>Dto } from '../<BaseEntityName>/Response<BaseEntityName>Dto';

export class Response<EntityName>Dto extends Response<BaseEntityName>Dto {
    @Expose()
    @ApiProperty({
        description: 'The special field specific to this entity',
        example: 'Special Value',
    })
    specialField: string;

    @Expose()
    @ApiProperty({
        description: 'Whether the entity is special',
        example: true,
    })
    isSpecial: boolean;

    @Expose()
    @ApiProperty({
        description: 'Additional information specific to this entity',
        example: 'Additional details',
        required: false,
    })
    additionalInfo?: string;
}
```

#### Migration Stub
```typescript
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Create<EntityName>_<timestamp>_<order> implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'entity_name',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'specialField',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'isSpecial',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    {
                        name: 'additionalInfo',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'modifiedAt',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
                indices: [
                    new TableIndex({
                        name: 'IDX_ENTITY_NAME_SPECIAL',
                        columnNames: ['specialField'],
                        isUnique: true,
                    }),
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('entity_name');
    }
}
``` 