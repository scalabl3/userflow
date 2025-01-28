# Entity Generation Guide - Part 1: Model, create and response DTOs, Migration (MDM)

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
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model, its essential DTOs, and migration. Focus on proper data modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<timestamp>` with the current Unix timestamp (`date +%s`)
- Replace `<order>` with the sequence number for this migration (e.g., 001, 002)
- Ensure consistent casing across all files:
  - PascalCase for all TypeScript files
  - camelCase for properties and methods

### Entity Specification
{entity model stub goes here}

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Entity definition with decorators
   - Column constraints and indices
   - Related interfaces/types

2. DTOs (`my-app/packages/shared/src/dtos/`)
   - Create<EntityName>Dto.ts
   - Response<EntityName>Dto.ts

3. Migration (`my-app/packages/backend/src/migrations/<timestamp>_<order>_Create<EntityName>.ts`)
   - Table creation with class name: Create<EntityName>_<timestamp>_<order>
   - Indices
   - Foreign key constraints

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

### File Generation Guidelines

#### Model Guidelines
- Use `@Index` decorators for unique columns
- Organize imports: TypeORM first, class-validator, others
- Include comprehensive JSDoc documentation
- Export related interfaces and types
- Use proper null handling
- Include proper column constraints and defaults

#### DTO Guidelines
Create DTOs:
- Include comprehensive OpenAPI examples
- Include proper validation messages
- Organize imports properly
- Use class-validator decorators

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
- Follow naming convention: <timestamp>_<order>_Create<EntityName>.ts 

### Generic Stubs

#### Model Stub
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsUUID, IsBoolean } from 'class-validator';

/**
 * <EntityName> entity represents a core business object in the system.
 * It maintains [describe key relationships and purpose].
 */
@Entity('entity_name')
@Index(['uniqueField1', 'uniqueField2'], { unique: true })
export class <EntityName> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isEnabled: boolean;

    @Column({ type: 'uuid', nullable: true })
    @IsOptional()
    @IsUUID()
    ownerId?: string;

    @ManyToOne(() => Owner)
    @JoinColumn({ name: 'ownerId' })
    owner?: Owner;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date;
}
```

#### DTO Stubs

Create DTO:
```typescript
import { IsNotEmpty, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create<EntityName>Dto {
    @ApiProperty({
        description: 'The name of the entity',
        example: 'Sample Name',
    })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({
        description: 'Whether the entity is enabled',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;

    @ApiProperty({
        description: 'The ID of the owner entity',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsOptional()
    @IsUUID()
    ownerId?: string;
}
```

Response DTO:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Response<EntityName>Dto {
    @Expose()
    @ApiProperty({
        description: 'The unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @Expose()
    @ApiProperty({
        description: 'The name of the entity',
        example: 'Sample Name',
    })
    name: string;

    @Expose()
    @ApiProperty({
        description: 'Whether the entity is enabled',
        example: true,
    })
    isEnabled: boolean;

    @Expose()
    @ApiProperty({
        description: 'The creation timestamp',
        example: '2024-01-27T12:00:00Z',
    })
    createdAt: Date;

    @Expose()
    @ApiProperty({
        description: 'The last modification timestamp',
        example: '2024-01-27T12:00:00Z',
    })
    modifiedAt: Date;
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
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'isEnabled',
                        type: 'boolean',
                        isNullable: false,
                        default: true,
                    },
                    {
                        name: 'ownerId',
                        type: 'uuid',
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
                        name: 'IDX_ENTITY_NAME_UNIQUE',
                        columnNames: ['name', 'ownerId'],
                        isUnique: true,
                    }),
                ],
                foreignKeys: [
                    {
                        columnNames: ['ownerId'],
                        referencedTableName: 'owner',
                        referencedColumnNames: ['id'],
                        onDelete: 'SET NULL',
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('entity_name');
    }
} 