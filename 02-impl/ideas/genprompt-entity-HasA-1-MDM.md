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
- For new entities: `<timestamp>-<order>-CREATE-<EntityPascalCase>.ts`
- For existing entities: `<timestamp>-<order>-ALTER-<OwnerEntityPascalCase>-WITH-<EntityPascalCase>.ts`
- For adding foreign key to entity: `<timestamp>-<order>-ADD-<EntityPascalCase>-<FK>-<TargetEntityPascalCase>.ts`

## Migration Class Naming Convention
- For new entities: `export class Create${EntityPascalCase}${timestamp}${order} implements MigrationInterface`
- For existing entities: `export class Alter${OwnerEntityPascalCase}With${EntityPascalCase}${timestamp}${order} implements MigrationInterface`
- For adding foreign key to entity: `export class Add${EntityPascalCase}Fk${TargetEntityPascalCase}${timestamp}${order} implements MigrationInterface`



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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerEntity } from './OwnerEntity';
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
/**
 * Example entity represents a child entity with a Has-A relationship to OwnerEntity.
 * Each example must belong to an owner and maintains its own lifecycle.
 */
@Entity('example')
@Index(['ownerId'])
export class Example {
    /** Unique identifier for the example */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /** The owner of this example */
    @ManyToOne(() => OwnerEntity, owner => owner.examples, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'ownerId' })
    owner!: OwnerEntity;

    /** ID of the associated owner */
    @Column({ type: 'uuid' })
    @IsUUID()
    @IsNotEmpty({ message: 'Owner ID is required' })
    ownerId!: string;

    /** Optional field specific to this example */
    @Column({ 
        type: 'varchar',
        length: 255,
        nullable: true 
    })
    @IsString()
    @IsOptional()
    description?: string;

    /** Timestamp of when the example was created */
    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    /** Timestamp of when the example was last modified */
    @UpdateDateColumn({ type: 'datetime' })
    modifiedAt!: Date;
}
```

#### DTO Structure
Required Imports:
```typescript
import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseOwnerDto } from '../Owner/ResponseOwnerDto';
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
        description: 'ID of the associated owner',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty({ message: 'Owner ID is required' })
    ownerId!: string;

    @ApiProperty({
        description: 'Optional description of the example',
        example: 'Detailed description',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;
}

// Response DTO
@Exclude()
export class ResponseExampleDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'ID of the associated owner',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    ownerId!: string;

    @Expose()
    @Type(() => ResponseOwnerDto)
    @ApiProperty({
        description: 'The owner of this example',
        type: () => ResponseOwnerDto
    })
    owner?: ResponseOwnerDto;

    @Expose()
    @ApiProperty({
        description: 'Optional description of the example',
        example: 'Detailed description',
        required: false
    })
    description?: string;

    @Expose()
    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'Last modification timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    modifiedAt!: Date;
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
}