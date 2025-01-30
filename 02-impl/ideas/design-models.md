# Model Layer Design and Standards

## Overview
This document defines our model layer standards and patterns, established through careful consideration and implementation across our core models.

## Standardized Patterns

### 1. Migration Structure
```typescript
/**
 * Clear, comprehensive documentation including:
 * - Core Fields and their constraints
 * - Relationships and their behaviors
 * - Indices and their purposes
 * - State management details
 */
export class CreateEntity implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get relationship configurations first
        const relationship = getManyToOneRelation(
            'entityId',
            'entity',
            true,  // required
            'RESTRICT'  // deletion behavior
        );

        await queryRunner.createTable(
            new Table({
                name: 'entity_name',
                columns: [
                    getIdColumn(queryRunner),
                    // Core fields with explicit constraints
                    // Relationship columns using helpers
                    // State management fields
                    ...getTimestampColumns(queryRunner)
                ],
                indices: [
                    {
                        name: 'IDX_ENTITY_FIELD',  // Standardized naming
                        columnNames: ['field'],
                        isUnique: true  // When needed
                    }
                ],
                foreignKeys: [
                    relationship.constraint
                ]
            })
        );
    }
}
```

### 2. Migration Naming Conventions

#### File Naming Pattern
- For new entities: `<timestamp>-<order>-CREATE-<EntityPascalCase>.ts`
  - Example: `1737964200-001000-CREATE-LoginProvider.ts`
- For existing entities: `<timestamp>-<order>-ALTER-<OwnerEntityPascalCase>-WITH-<EntityPascalCase>.ts`
  - Example: `1737964200-001100-ALTER-User-WITH-Organization.ts`
- For adding foreign key to entity: `<timestamp>-<order>-ADD-<EntityPascalCase>-<FK>-<TargetEntityPascalCase>.ts`
  - Example: `1737964200-001200-ADD-User-FK-Organization.ts`
- For adding indices: `<timestamp>-<order>-ADD-<EntityPascalCase>-INDEX-<FieldsPascalCase>.ts`
  - Example: `1737964200-001300-ADD-User-INDEX-UniqueFields.ts`

#### Class Naming Pattern
- For new entities: `export class Create${EntityPascalCase}${timestamp}${order} implements MigrationInterface`
  - Example: `export class CreateLoginProvider1737964200001000 implements MigrationInterface`
- For existing entities: `export class Alter${OwnerEntityPascalCase}With${EntityPascalCase}${timestamp}${order} implements MigrationInterface`
  - Example: `export class AlterUserWithOrganization1737964200001100 implements MigrationInterface`
- For adding foreign key to entity: `export class Add${EntityPascalCase}Fk${TargetEntityPascalCase}${timestamp}${order} implements MigrationInterface`
  - Example: `export class AddUserFkOrganization1737964200001200 implements MigrationInterface`
- For adding indices: `export class Add${EntityPascalCase}Index${FieldsPascalCase}${timestamp}${order} implements MigrationInterface`
  - Example: `export class AddUserIndexUniqueFields1737964200001300 implements MigrationInterface`

#### Best Practices
- Use consistent timestamp format (UNIX timestamp) bash: `date +%s`
- Document dependencies between migrations
- Keep migrations atomic (one logical change per migration)
- Include comments explaining complex changes
- Test both up and down migrations

#### Migration Ordering Strategy
Format: `EEESNN`
- `EEE`: Entity number (000-999)
- `S`: Step type (0=core, 1=related, 2=FK, 3=indices)
- `NN`: Sequence within step (00-99)

Examples:
```
Entity 1:
001000 - CREATE-EntityOne.ts
001100 - ALTER-EntityOne-WITH-Something.ts
001200 - ADD-EntityOne-FK-Something.ts
001300 - ADD-EntityOne-INDEX-UniqueFields.ts

Entity 2:
002000 - CREATE-EntityTwo.ts
002100 - ALTER-EntityTwo-WITH-Something.ts
002200 - ADD-EntityTwo-FK-Something.ts
002300 - ADD-EntityTwo-INDEX-UniqueFields.ts

Entity 10:
010000 - CREATE-EntityTen.ts
010100 - ALTER-EntityTen-WITH-Something.ts
010200 - ADD-EntityTen-FK-Something.ts
010300 - ADD-EntityTen-INDEX-UniqueFields.ts

Entity 100:
100000 - CREATE-EntityHundred.ts
100100 - ALTER-EntityHundred-WITH-Something.ts
100200 - ADD-EntityHundred-FK-Something.ts
100300 - ADD-EntityHundred-INDEX-UniqueFields.ts
```

This pattern allows for:
- Up to 1000 core entities (000-999)
- 4 standard step types (0-3):
  - 0: Core entity creation
  - 1: Related alterations
  - 2: Foreign key relationships
  - 3: Index additions
- Up to 99 migrations within each step type (00-99)
- Clear visual grouping by entity and step type
- Easy insertion of new migrations within any step
- Consistent 6-digit format throughout

Best Practices:
- Reserve first 10 entities (001xxx-009xxx) for core system entities
- Use logical groupings for entity numbers (e.g., 010xxx-019xxx for auth-related entities)
- Document entity number assignments in migration README
- Leave gaps between entity numbers for related future entities
- Use sequence numbers sparingly, leaving room for insertions



### 2. Model Field Standards

#### Primary Keys and UUIDs
```typescript
// Primary Keys
@PrimaryGeneratedColumn('uuid')  // TypeORM handles database-specific UUID generation
id!: string;

// Foreign Keys (Required)
@Column({ type: 'uuid' })
@IsUUID()
entityId!: string;

// Foreign Keys (Optional)
@Column({ type: 'uuid', nullable: true })
@IsUUID()
@IsOptional()
entityId?: string;
```

#### Enums
```typescript
@Column({
    type: 'varchar',  // Always use varchar for database compatibility
    enum: EnumType    // Keep enum for TypeScript & validation
})
@IsEnum(EnumType)    // Always include validation
enumField!: EnumType;
```

#### Timestamps
```typescript
// Creation/Update Timestamps
@CreateDateColumn({ 
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP'
})
createdAt!: Date;

@UpdateDateColumn({ 
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP'
})
modifiedAt!: Date;

// Other Date Fields
@Column({ 
    type: 'datetime',
    nullable: true
})
@IsDate()
@IsOptional()
someDate?: Date;
```

#### JSON Fields
```typescript
// Using the helper function
@Column(getJsonColumn(queryRunner, 'data', true))
@IsObject()
@ValidateNested()
@Type(() => DataType)
@IsOptional()
data?: DataType;

// Best practices:
// 1. Always use getJsonColumn helper
// 2. Define explicit types (no Record<string, any>)
// 3. Use class-validator decorators
// 4. Use class-transformer for type conversion
// 5. Consider default values
// 6. Keep structures simple and flat
// 7. Avoid complex queries in SQLite
```

#### Standard Field Types
```typescript
// Varchar Fields
{
    name: 'field',
    type: 'varchar',
    length: '255',  // Explicit length
    isNullable: false
}

// Boolean Flags
{
    name: 'isEnabled',
    type: 'boolean',
    isNullable: false,
    default: true  // Explicit default
}
```

### 3. Helper Functions

#### UUID and Primary Keys
```typescript
// Primary Key helper
getIdColumn(queryRunner)  // Standard UUID PK

// Relationship helpers
getManyToOneRelation(    // M:1 relationships
    columnName,
    referencedTable,
    required,
    onDelete
)

getOneToOneRelation(     // 1:1 relationships
    columnName,
    referencedTable,
    required,
    unique,
    onDelete
)
```

#### Data Type Helpers
```typescript
// Enum helper
getEnumColumn(name, values, nullable)  // Type-safe enums

// JSON helper
getJsonColumn(          // Database-specific JSON
    queryRunner,
    name,
    nullable,
    defaultValue
)

// Common Fields
getTimestampColumns(queryRunner)  // created/modified
```

### 4. Naming Conventions
- Tables: Singular, snake_case (e.g., `login_provider`)
- Columns: camelCase
- Indices: `IDX_TABLE_FIELD`
- Foreign Keys: Generated by relationship helpers
- Enums: Named types (e.g., `credential_type`)

### 5. Relationship Standards
```typescript
// Required relationship
@Column({ type: 'uuid' })
@IsUUID()
entityId!: string;

@ManyToOne(() => Entity)
@JoinColumn({ name: 'entityId' })
entity!: Entity;

// Best practices:
// 1. Always specify both @Column and relationship decorator
// 2. Use consistent nullable specifications
// 3. Include @JoinColumn decorator
// 4. Document relationship cardinality
// 5. Consider deletion behavior
```

### 6. Field Organization
```typescript
@Entity()
export class EntityName {
    // 1. Primary Key
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 2. Required Core Fields
    @Column()
    required!: string;

    // 3. Optional Core Fields
    @Column({ nullable: true })
    optional?: string;

    // 4. Relationship Fields
    @Column({ type: 'uuid' })
    entityId!: string;

    @ManyToOne(() => Entity)
    @JoinColumn({ name: 'entityId' })
    entity!: Entity;

    // 5. Timestamps
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    modifiedAt!: Date;
}
```

### 7. Model Validation Strategy
```typescript
// Standard validation pattern
@Entity()
export class EntityName {
    // Basic string validation with standard lengths
    @Column({ type: 'varchar', length: 30 })
    @IsString()
    @Length(1, 30)
    name!: string;

    // Email validation
    @Column({ type: 'varchar', length: 255 })
    @IsEmail()
    @Length(5, 255)
    email!: string;

    // Conditional validation for specific types
    @ValidateIf(o => o.type === CredentialType.PASSWORD)
    @Column({ nullable: true })
    @IsString()
    @Length(1, 255)
    passwordHash?: string;
}
```

Key standards:
1. Consistent length constraints (30 chars for names, 255 for emails)
2. Required validation decorators for all fields
3. Conditional validation using @ValidateIf
4. Explicit nullability in both Column and validation
5. Standard error messages through Length decorator

## Implementation Examples

### 1. Authentication System
- **LoginProvider**: Root entity with code/name pattern
- **LoginCredential**: Complex entity with conditional fields
- **BaseUser**: Parent entity with core user fields
- **User**: Extended entity with organization relationship

### 2. Organization System
- **Organization**: Entity with admin relationship
- **User**: Entity with organization membership

### 3. Billing System
- **BillingProvider**: Entity with type-based behavior

## Best Practices

### 1. Relationship Management
- Use appropriate helper for relationship type
- Consider deletion behavior carefully
- Document relationship constraints
- Add indices for foreign keys

### 2. Documentation
- Document all fields and constraints
- Explain relationship behaviors
- Note future considerations
- Include usage examples

### 3. Migration Organization
- CREATE migrations for table structure
- Separate ADD-FK migrations for relationships
- Clear dependency order
- Reversible changes

### 4. Data Safety
- Explicit nullability
- Proper length constraints
- Appropriate defaults
- Type safety with enums

## Verification Checklist
- [ ] Uses appropriate helper functions
- [ ] Has comprehensive documentation
- [ ] Follows naming conventions
- [ ] Includes proper indices
- [ ] Handles relationships correctly
- [ ] Specifies field constraints
- [ ] Provides proper defaults
- [ ] Considers database compatibility

## Pending Standards

### 1. Testing Patterns
Current state:
- Basic unit tests exist
- No standardized factory pattern
- Inconsistent test data creation

Needs standardization:
```typescript
// Proposed test factory pattern
export class EntityFactory {
    static create(overrides = {}): Entity {
        return {
            id: uuid(),
            field: 'default',
            ...overrides
        };
    }

    static createMany(count: number, overrides = {}): Entity[] {
        return Array.from({ length: count }, () => this.create(overrides));
    }
}

// Proposed test structure
describe('Entity', () => {
    describe('Validation', () => {
        // Standard validation tests
    });

    describe('Relationships', () => {
        // Standard relationship tests
    });

    describe('Business Logic', () => {
        // Model-specific logic tests
    });
});
```

To be defined:
1. Test data factory standards
2. Common test scenarios
3. Mocking strategies
4. Integration test patterns
5. Test database handling

### 2. DTO Alignment
Current state:
- DTOs don't consistently match models
- Validation duplicated between DTOs and models
- Inconsistent transformation patterns

Needs standardization:
```typescript
// Proposed DTO pattern
export class CreateEntityDto {
    // Match model field names unless specific reason not to
    @IsString()
    @Length(1, 255)
    field!: string;

    // Explicit transformations
    @Transform(({ value }) => value.toLowerCase())
    email!: string;

    // Nested DTO handling
    @ValidateNested()
    @Type(() => NestedDto)
    nested?: NestedDto;
}

// Response DTO pattern
export class EntityResponseDto {
    // Standard fields always included
    id!: string;
    createdAt!: Date;

    // Configurable field inclusion
    @Expose({ groups: ['detailed'] })
    details?: string;

    // Computed fields
    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
```

To be defined:
1. DTO naming conventions
2. Transform strategies
3. Validation sharing between models and DTOs
4. Response DTO field exposure patterns
5. Nested DTO handling

## Next Steps
1. Implement validation strategy
   - Define standard decorators
   - Create validation message format
   - Document validation groups

2. Establish testing patterns
   - Create test factory base class
   - Define common test scenarios
   - Document mocking approach

3. Align DTOs with models
   - Update existing DTOs to match standards
   - Implement transform strategies
   - Create response DTO patterns

4. Create implementation guides
   - Step-by-step validation guide
   - Testing implementation guide
   - DTO creation guide