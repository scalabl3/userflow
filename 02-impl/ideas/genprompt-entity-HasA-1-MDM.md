# Entity Generation Guide - Has-A Relationship - Part 1: Model, DTOs, Migration (MDM)

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer that understands the problems caused by speculation, overgeneration, and developing code without guardrails. Your role in this first phase is to generate the core entity model, its essential DTOs, and migration for an entity that has a Has-A relationship with another entity. Focus on proper relationship modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

##### Semantic Examples: 
- `OwnerEntityName` has-a `EntityName`
- User has-a Preferences
- User.preferences = new Preferences();

### Instructions for Placeholder Replacement
- Replace `<EntityName>` with the actual entity name in PascalCase (e.g., BillingCredential)
- Replace `<OwnerEntityName>` with the containing entity name in PascalCase (e.g., BillingCredentialSet)
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
   - Relationship decorators
   - Column constraints and indices
   - Foreign key constraints

2. DTOs (`my-app/packages/shared/src/dtos/`)
   - Create<EntityName>Dto.ts
   - Response<EntityName>Dto.ts

3. Migration (`my-app/packages/backend/src/migrations/<timestamp>_<order>_Create<EntityName>.ts`)
   - Table creation
   - Indices
   - Foreign key constraints

4. Owner Entity Updates
   - Update owner entity model with relationship
   - Update owner entity DTOs if needed

### Verification Checklist
- [ ] Entity follows TypeORM patterns with proper decorators
- [ ] Relationship decorators are properly configured
- [ ] Foreign key constraints are correctly defined
- [ ] Proper @Index decorators for unique columns
- [ ] Comprehensive JSDoc documentation
- [ ] Proper null handling with TypeScript strict mode
- [ ] Column constraints and defaults properly set
- [ ] DTOs have comprehensive OpenAPI examples
- [ ] DTOs handle relationship fields appropriately
- [ ] DTOs have proper validation messages
- [ ] Migration includes proper indices and foreign keys
- [ ] Migration has proper up/down methods
- [ ] Owner entity updates maintain consistency
- [ ] All imports are properly organized and exist

### File Generation Guidelines

#### Model Guidelines
- Use proper relationship decorators (@ManyToOne, @OneToMany, etc.)
- Configure cascade options appropriately
- Set up proper foreign key columns
- Use `@Index` decorators for unique columns
- Organize imports: TypeORM first, class-validator, others
- Include comprehensive JSDoc documentation
- Export related interfaces and types
- Use proper null handling
- Include proper column constraints and defaults

#### DTO Guidelines
Create DTOs:
- Include relationship fields
- Include comprehensive OpenAPI examples
- Include proper validation messages
- Organize imports properly
- Use class-validator decorators

Response DTOs:
- Inherit appropriate properties from entity
- Handle relationship data appropriately
- Handle date formatting
- Handle sensitive data
- Include comprehensive OpenAPI docs

#### Migration Guidelines
- Create proper indices
- Include comprehensive column constraints
- Set up foreign key constraints
- Set appropriate default values
- Include proper down migration
- Use transactions
- Follow naming convention: <timestamp>_<order>_Create<EntityName>.ts

### Generic Stubs

#### Model Stub
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { OwnerEntity } from './OwnerEntity';

/**
 * <EntityName> entity represents a component owned by <OwnerEntityName>.
 * It maintains [describe relationship and purpose].
 */
@Entity('entity_name')
export class <EntityName> {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @Column({ type: 'uuid', nullable: false })
    @IsNotEmpty()
    @IsUUID()
    ownerId: string;

    @ManyToOne(() => OwnerEntity, owner => owner.entities, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'ownerId' })
    owner: OwnerEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    modifiedAt: Date;
}
```

#### DTO Stubs

Create DTO:
```typescript
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create<EntityName>Dto {
    @ApiProperty({
        description: 'The name of the entity',
        example: 'Sample Name',
    })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({
        description: 'The ID of the owner entity',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty({ message: 'Owner ID is required' })
    @IsUUID()
    ownerId: string;
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
        description: 'The ID of the owner entity',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    ownerId: string;

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
import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

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
                        name: 'ownerId',
                        type: 'uuid',
                        isNullable: false,
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
                        name: 'IDX_ENTITY_NAME_OWNER',
                        columnNames: ['ownerId'],
                    }),
                ],
                foreignKeys: [
                    new TableForeignKey({
                        name: 'FK_ENTITY_NAME_OWNER',
                        columnNames: ['ownerId'],
                        referencedTableName: 'owner_table',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
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