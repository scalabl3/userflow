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
import { Entity, Column, ChildEntity } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseEntityName } from './BaseEntityName';
```

Key Points:
- Use @ChildEntity decorator with discriminator
- Extend base entity class
- Add only new fields
- Override methods when needed
- Document inheritance behavior
- Handle validation properly
- Respect base entity contract

Example Pattern:
```typescript
@ChildEntity('example')
export class Example extends BaseEntity {
    @Column()
    @IsNotEmpty()
    additional_field: string;

    @Column({ nullable: true })
    @IsOptional()
    optional_field?: string;

    // Override base method if needed
    override someMethod(): string {
        return `Example: ${super.someMethod()}`;
    }
}
```

#### DTO Structure
Required Imports:
```typescript
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CreateBaseEntityDto, ResponseBaseEntityDto } from '../BaseEntity';
```

Key Points:
- Extend base entity DTOs
- Add only new fields
- Include inheritance documentation
- Handle validation properly
- Use clear field descriptions
- Follow naming conventions

Example Pattern:
```typescript
// Create DTO
export class CreateExampleDto extends CreateBaseEntityDto {
    @ApiProperty({
        description: 'Additional field specific to Example',
        example: 'example value'
    })
    @IsNotEmpty()
    additional_field: string;
}

// Response DTO
export class ResponseExampleDto extends ResponseBaseEntityDto {
    @Expose()
    @ApiProperty({
        description: 'Additional field specific to Example',
        example: 'example value'
    })
    additional_field: string;
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