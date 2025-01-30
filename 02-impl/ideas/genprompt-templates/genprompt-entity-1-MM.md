# Entity Generation Guide - Part 1: Model and Migration (MM)

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<timestamp>` with the current Unix timestamp (`date +%s`)
- Replace `<order>` with the sequence number for this migration (e.g., 001000, 002000)
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
- For new entities: `Create_${EntityPascalCase}_${timestamp}_${order}`
- For existing entities: `Alter_${OwnerEntityPascalCase}_With_${EntityPascalCase}_${timestamp}_${order}`
- For adding foreign key to entity: `Add_${EntityPascalCase}_FK_${TargetEntityPascalCase}_${timestamp}_${order}`

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model and its migration. Focus on proper data modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
{entity description and properties goes here}

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Entity definition with decorators
   - Column constraints and indices
   - Related interfaces/types

2. Migration (`my-app/packages/backend/src/migrations/<migration filename>`)
   - Table creation with proper constraints
   - Indices and foreign keys
   - Up and down methods

### Verification Checklist
- [ ] Entity follows TypeORM patterns with proper decorators
- [ ] Proper @Index decorators for unique columns
- [ ] Comprehensive JSDoc documentation
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set
- [ ] Migration includes proper indices
- [ ] Migration has proper up/down methods
- [ ] All imports are properly organized and exist

### Code Structure Guidelines

#### Model Structure
Required Imports:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsString, IsBoolean, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
```

Key Points:
- Use descriptive entity names
- Add proper validation decorators
- Include comprehensive documentation
- Configure column types explicitly
- Handle nullable fields appropriately
- Follow consistent naming conventions
- Use proper field length constants

Example Pattern:
```typescript
/**
 * Example entity representing a basic data model.
 * Contains standard fields and validation patterns.
 */
@Entity('example')
export class Example {
    /** Unique identifier for the example */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /** Name of the example with length constraints */
    @Column({ 
        type: 'varchar',
        length: FIELD_LENGTHS.NAME.max
    })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(FIELD_LENGTHS.NAME.min, FIELD_LENGTHS.NAME.max, { 
        message: `Name must be between ${FIELD_LENGTHS.NAME.min} and ${FIELD_LENGTHS.NAME.max} characters` 
    })
    name!: string;

    /** Description of the example */
    @Column({ 
        type: 'varchar',
        length: FIELD_LENGTHS.DESCRIPTION.max,
        nullable: true 
    })
    @IsString()
    @IsOptional()
    @Length(0, FIELD_LENGTHS.DESCRIPTION.max, { 
        message: `Description must not exceed ${FIELD_LENGTHS.DESCRIPTION.max} characters` 
    })
    description?: string;

    /** Flag indicating if the example is enabled */
    @Column({ 
        type: 'boolean',
        default: true 
    })
    @IsBoolean()
    isEnabled!: boolean;

    /** Timestamp of when the example was created */
    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    /** Timestamp of when the example was last modified */
    @UpdateDateColumn({ type: 'datetime' })
    modifiedAt!: Date;
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
export class Create_Example_1737964200_001000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'example',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '1000',
                        isNullable: true
                    },
                    {
                        name: 'is_enabled',
                        type: 'boolean',
                        default: true,
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false
                    },
                    {
                        name: 'modified_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                        isNullable: false
                    }
                ]
            }),
            true
        );

        await queryRunner.createIndex(
            'example',
            new TableIndex({
                name: 'IDX_example_name',
                columnNames: ['name']
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('example', 'IDX_example_name');
        await queryRunner.dropTable('example');
    }
} 