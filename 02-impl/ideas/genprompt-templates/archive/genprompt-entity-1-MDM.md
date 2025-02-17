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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
        length: 255 
    })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
    name!: string;

    /** Description of the example */
    @Column({ 
        type: 'varchar',
        length: 1000,
        nullable: true 
    })
    @IsString()
    @IsOptional()
    @Length(0, 1000, { message: 'Description must not exceed 1000 characters' })
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

#### DTO Structure
Required Imports:
```typescript
import { IsString, IsBoolean, IsNotEmpty, Length, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
```

Key Points:
- Use clear field descriptions
- Add proper validation for Create DTOs
- Include example values
- Document required vs optional fields
- Follow consistent naming
- Handle nullable fields appropriately
- Use @Exclude() for Response DTOs
- Use @Type() for nested objects/dates
- No validation decorators in Response DTOs

Example Pattern:
```typescript
// Create DTO
export class CreateExampleDto {
    @ApiProperty({
        description: 'Name of the example',
        example: 'Example Name',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(1, 255, { message: 'Name must be between 1 and 255 characters' })
    name!: string;

    @ApiProperty({
        description: 'Settings for the example',
        example: {
            theme: 'light',
            notifications: true
        },
        required: false
    })
    @IsOptional()
    @IsObject()
    @Type(() => Object)
    settings?: {
        theme?: string;
        notifications?: boolean;
    };
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
        description: 'Name of the example',
        example: 'Example Name'
    })
    name!: string;

    @Expose()
    @ApiProperty({
        description: 'Settings for the example',
        example: {
            theme: 'light',
            notifications: true
        },
        required: false
    })
    @Type(() => Object)
    settings?: {
        theme?: string;
        notifications?: boolean;
    };

    @Expose()
    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    @Type(() => Date)
    createdAt!: Date;

    @Expose()
    @ApiProperty({
        description: 'Last modification timestamp',
        example: '2024-01-28T12:00:00.000Z'
    })
    @Type(() => Date)
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