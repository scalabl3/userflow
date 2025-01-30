# Entity Generation Guide - Part 1: Model, Model Tests and Migration (MM) - Has-A Relationship

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<OwnerEntityName>` with the owner entity name in PascalCase
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
You are a seasoned veteran software engineer focused on implementing Has-A relationships in TypeORM entities. Your role is to generate the model and migration files for entities with Has-A relationships. Focus on proper relationship modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Entity Specification
{entity description and properties goes here, including relationship requirements}

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Entity class with relationship decorators
   - Column constraints and indices
   - Relationship configuration
   - Foreign key constraints

2. Migration (`my-app/packages/backend/src/migrations/<migration filename>`)
   - Table creation with proper constraints
   - Foreign key setup
   - Indices including relationship indices
   - Up and down methods

### Verification Checklist
- [ ] Entity follows TypeORM patterns with proper decorators
- [ ] Relationship decorators are properly configured
- [ ] Foreign key constraints are defined
- [ ] Indices are properly configured for relationships
- [ ] Comprehensive JSDoc documentation includes relationship details
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set
- [ ] Migration includes proper foreign key constraints
- [ ] Migration has proper up/down methods
- [ ] All imports are properly organized and exist

### Code Structure Guidelines

#### Model Structure
Required Imports:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsBoolean, IsNotEmpty, Length, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerEntity } from './OwnerEntity';
```

Key Points:
- Use appropriate relationship decorator (ManyToOne/OneToMany)
- Configure proper cascade options
- Set up foreign key constraints
- Add indices for relationships
- Include relationship validation
- Handle null/undefined cases
- Document relationship behavior
- Use proper field length constants

Example Pattern:
```typescript
/**
 * Example entity representing a child entity with a Has-A relationship to OwnerEntity.
 * Each example must belong to an owner and maintains its own lifecycle.
 */
@Entity('example')
@Index(['ownerId'])
export class Example {
    /** Unique identifier for the example */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /** The owner of this example */
    @ManyToOne(() => OwnerEntity, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'owner_id' })
    owner!: OwnerEntity;

    /** ID of the associated owner */
    @Column({ type: 'uuid' })
    @IsUUID()
    @IsNotEmpty({ message: 'Owner ID is required' })
    ownerId!: string;

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
- Create base table first, foreign keys in separate migration
- Add appropriate indices for local fields
- Include both up and down methods
- Use transactions where appropriate
- Follow consistent column naming
- Handle default values appropriately

Example Migration Patterns:

1. Create Base Table:
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
                        name: 'owner_id',
                        type: 'uuid',
                        isNullable: false
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

        // Create index for the name field
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

2. Add Foreign Key Relationship:

import { MigrationInterface, QueryRunner, TableIndex, TableForeignKey } from 'typeorm';

export class Add_Example_FK_Owner_1737964200_001100 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create index for the foreign key
        await queryRunner.createIndex(
            'example',
            new TableIndex({
                name: 'IDX_example_owner_id',
                columnNames: ['owner_id']
            })
        );

        // Add foreign key constraint
        await queryRunner.createForeignKey(
            'example',
            new TableForeignKey({
                name: 'FK_example_owner',
                columnNames: ['owner_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'owner',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('example', 'FK_example_owner');
        await queryRunner.dropIndex('example', 'IDX_example_owner_id');
    }
}

