# Entity Generation Guide - Has-A Relationship (MDM)

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<OwnerEntityName>` with the owner entity name in PascalCase
- Replace `<entityName>` with the entity name in camelCase
- Replace `<ownerEntityName>` with the owner entity name in camelCase
- Ensure consistent casing across all files:
  - PascalCase for classes and types
  - camelCase for methods and properties
- Verify all paths and imports are correct
- Remove any unnecessary code or comments
- Keep examples minimal but clear

## Migration File Naming Convention
- For new entities: `<timestamp>_<order>-Create<EntityName>.ts`
- For existing entities: `<timestamp>_<order>-Modify<OwnerEntityName>With<EntityName>.ts`

## Aider Prompt Template

### AI Role
You are a seasoned veteran software engineer focused on implementing Has-A relationships in TypeORM entities. Your role is to generate the model, DTOs, and migration files for entities with Has-A relationships. Focus on proper relationship modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Entity class with relationship decorators
   - Validation rules
   - Indices and constraints
   - Relationship configuration

2. DTOs (`my-app/packages/shared/src/dtos/<EntityName>/`)
   - Create<EntityName>Dto.ts
   - Response<EntityName>Dto.ts

3. Migration (`my-app/packages/backend/src/migrations/<migration filename>`)
   

### Verification Checklist
- [ ] Model has proper relationship decorators
- [ ] Foreign key constraints are defined
- [ ] Indices are properly configured
- [ ] Validation rules are comprehensive
- [ ] DTOs handle relationship fields
- [ ] Migration includes proper constraints
- [ ] All imports properly organized
- [ ] Naming follows conventions
- [ ] Documentation is complete
- [ ] Relationship cascade options set

### Code Structure Guidelines

#### Model Structure
Required Imports:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { OwnerEntityName } from './OwnerEntityName';
```

Key Points:
- Use appropriate relationship decorator (ManyToOne/OneToMany)
- Configure proper cascade options
- Set up foreign key constraints
- Add indices for performance
- Include relationship validation
- Handle null/undefined cases
- Document relationship behavior

Example Pattern:
```typescript
@Entity()
export class Example {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OwnerEntity, owner => owner.examples, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'owner_id' })
    owner: OwnerEntity;

    @Column()
    @Index()
    owner_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
```

#### DTO Structure
Required Imports:
```typescript
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
```

Key Points:
- Include relationship fields in DTOs
- Add proper validation for foreign keys
- Use clear field descriptions
- Include relationship documentation
- Handle nested objects appropriately
- Follow naming conventions

Example Pattern:
```typescript
// Create DTO
export class CreateExampleDto {
    @ApiProperty({
        description: 'The ID of the owner entity',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsNotEmpty()
    @IsUUID()
    owner_id: string;
}

// Response DTO
export class ResponseExampleDto {
    @Expose()
    @ApiProperty({
        description: 'The unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @Expose()
    @ApiProperty({
        description: 'The owner of this entity',
        type: () => ResponseOwnerDto
    })
    owner: ResponseOwnerDto;
}
```

#### Migration Structure
Required Imports:
```typescript
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
```

Key Points:
- Use appropriate migration naming
- Create proper foreign key constraints
- Add necessary indices
- Include rollback logic
- Handle existing data
- Follow naming conventions
- Document migration purpose

Example Pattern:
```typescript
// For new entities
export class CreateExample implements MigrationInterface {
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
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            'example',
            new TableForeignKey({
                columnNames: ['owner_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'owner',
                onDelete: 'CASCADE'
            })
        );

        await queryRunner.createIndex(
            'example',
            new TableIndex({
                name: 'IDX_EXAMPLE_OWNER',
                columnNames: ['owner_id']
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('example');
    }
}

// For existing entities
export class ModifyOwnerWithExample implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'owner',
            new TableColumn({
                name: 'example_id',
                type: 'uuid',
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            'owner',
            new TableForeignKey({
                columnNames: ['example_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'example',
                onDelete: 'SET NULL'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('owner', 'example_id');
    }
}