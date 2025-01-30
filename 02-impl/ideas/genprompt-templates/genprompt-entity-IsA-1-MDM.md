# Entity Generation Guide - Is-A Relationship - Part 1: Model, DTOs, Migration (MDM)

## Instructions for Template Creation
- Replace `<EntityName>` with the actual entity name in PascalCase
- Replace `<BaseEntityName>` with the base entity name in PascalCase
- Replace `<entityName>` with the entity name in camelCase
- Replace `<baseEntityName>` with the base entity name in camelCase
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
You are a seasoned veteran software engineer focused on implementing Is-A relationships in TypeORM entities. Your role is to generate the model, DTOs, and migration files for entities with inheritance relationships. Focus on proper inheritance modeling, validation, and database schema. Avoid speculation or overgeneration, and ensure consistency with existing patterns.

### Files to Generate

1. Model (`my-app/packages/backend/src/models/<EntityName>.ts`)
   - Entity class with inheritance
   - Additional fields and validation
   - Discriminator configuration
   - Override handling

2. DTOs (`my-app/packages/shared/src/dtos/<EntityName>/`)
   - Create<EntityName>Dto.ts
   - Response<EntityName>Dto.ts

3. Migration (`my-app/packages/backend/src/migrations/<migration filename>`)
   

### Verification Checklist
- [ ] Model extends base entity properly
- [ ] Discriminator column is configured
- [ ] Additional fields are validated
- [ ] DTOs handle inheritance properly
- [ ] Migration includes discriminator
- [ ] All imports properly organized
- [ ] Naming follows conventions
- [ ] Documentation is complete
- [ ] Override methods implemented
- [ ] Base methods respected

### Code Structure Guidelines

#### Model Structure
Required Imports:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, TableInheritance, ChildEntity } from 'typeorm';
import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './BaseEntity';
```

Key Points:
- Use TableInheritance for base entity
- Configure discriminator column
- Add proper validation for inherited fields
- Document inheritance behavior
- Handle type-specific fields appropriately
- Include proper validation

Example Pattern:
```typescript
/**
 * Base entity that defines common properties for all derived types.
 * Uses single table inheritance with a discriminator column.
 */
@Entity('base')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class BaseEntity {
    /** Unique identifier for the entity */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /** Common name field for all derived types */
    @Column({ 
        type: 'varchar',
        length: 255 
    })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name!: string;

    /** Flag indicating if the entity is enabled */
    @Column({ 
        type: 'boolean',
        default: true 
    })
    @IsBoolean()
    isEnabled!: boolean;

    /** Timestamp of when the entity was created */
    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    /** Timestamp of when the entity was last modified */
    @UpdateDateColumn({ type: 'datetime' })
    modifiedAt!: Date;
}

/**
 * Specialized entity that extends the base entity with additional properties.
 * Identified by the discriminator value 'specialized'.
 */
@ChildEntity('specialized')
export class SpecializedEntity extends BaseEntity {
    /** Additional field specific to specialized entities */
    @Column({ 
        type: 'varchar',
        length: 255,
        nullable: true 
    })
    @IsString()
    @IsOptional()
    specialField?: string;
}
```

#### DTO Structure
Required Imports:
```typescript
import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
```

Key Points:
- Include base fields in DTOs
- Add proper validation for Create DTOs
- Use clear field descriptions
- Document inheritance behavior
- Handle type-specific fields
- Follow naming conventions
- Use @Exclude() for Response DTOs
- Use @Type() for nested objects/dates
- No validation decorators in Response DTOs

Example Pattern:
```typescript
// Create DTO for Base Entity
export class CreateBaseDto {
    @ApiProperty({
        description: 'Name of the entity',
        example: 'Example Name',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name!: string;

    @ApiProperty({
        description: 'Settings for the entity',
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

// Create DTO for Specialized Entity
export class CreateSpecializedDto extends CreateBaseDto {
    @ApiProperty({
        description: 'Additional field for specialized entities',
        example: 'Special Value',
        required: false
    })
    @IsString()
    @IsOptional()
    specialField?: string;
}

// Response DTO for Base Entity
@Exclude()
export class ResponseBaseDto {
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'Name of the entity',
        example: 'Example Name'
    })
    name!: string;

    @Expose()
    @ApiProperty({
        description: 'Settings for the entity',
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

// Response DTO for Specialized Entity
@Exclude()
export class ResponseSpecializedDto extends ResponseBaseDto {
    @Expose()
    @ApiProperty({
        description: 'Additional field for specialized entities',
        example: 'Special Value',
        required: false
    })
    specialField?: string;
}
```

#### Migration Structure
Required Imports:
```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
```

Key Points:
- Use appropriate migration naming
- Add discriminator value
- Add new columns only
- Include rollback logic
- Handle existing data
- Follow naming conventions
- Document migration purpose

Example Pattern:
```typescript
export class CreateExample implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add discriminator value
        await queryRunner.query(`
            INSERT INTO typeorm_metadata
            (type, schema, name, value)
            VALUES
            ('ENTITY_CHILD', 'public', 'Example', 'example')
        `);

        // Add new columns
        await queryRunner.addColumns('base_entity', [
            new TableColumn({
                name: 'additional_field',
                type: 'varchar',
                isNullable: false,
                isUnique: false
            }),
            new TableColumn({
                name: 'optional_field',
                type: 'varchar',
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove discriminator value
        await queryRunner.query(`
            DELETE FROM typeorm_metadata
            WHERE type = 'ENTITY_CHILD'
            AND name = 'Example'
        `);

        // Remove added columns
        await queryRunner.dropColumn('base_entity', 'additional_field');
        await queryRunner.dropColumn('base_entity', 'optional_field');
    }
}
``` 