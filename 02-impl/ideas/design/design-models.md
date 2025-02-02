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

#### Property Initialization
Use TypeScript property initialization for defaults instead of constructors:

```typescript
// ✅ DO: Property Initialization
export class Entity {
    // Simple defaults
    isEnabled: boolean = false;
    items: Item[] = [];
    status: Status = Status.PENDING;
    
    // With TypeORM columns
    @Column({ type: 'varchar', length: 255 })
    name: string = '';

    @Column({ type: 'boolean' })
    visible: boolean = false;

    @Column({ type: 'simple-array' })
    tags: string[] = [];
}

// ❌ DON'T: Constructor Initialization
export class Entity {
    constructor() {
        this.isEnabled = false;  // Could override DB values
        this.items = [];
    }
}
```

**When to Use Defaults**
1. **Always Default**
   - Arrays (empty array)
   - Boolean flags
   - Status/State enums
   - Collection properties

2. **Optional Default**
   - Strings (empty or undefined)
   - Numbers (if zero is meaningful)
   - Dates (if current time is meaningful)

3. **Never Default**
   - Foreign keys
   - Required relationships
   - Unique identifiers
   - Required string fields

**Rationale**
- TypeORM Compatibility: Works correctly with hydration
- Code Clarity: Defaults visible at property declaration
- Maintainability: No constructor overhead or inheritance complications
- Testing: Clear expectations for default values

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

### Relationship Field Standards

#### Foreign Key and Relation Naming
```typescript
// ALWAYS use xxxId for foreign keys and xxx for relation objects
class Example {
    // One-to-One or Many-to-One (owning side)
    @Column(getModelRelationConfig(true, 'RESTRICT').columnOptions)
    @IsUUID()
    adminUserId!: string;  // Foreign key field

    @OneToOne(() => User, getModelRelationConfig(true, 'RESTRICT').relationOptions)
    @JoinColumn({ name: 'adminUserId' })
    adminUser!: User;  // Relation object

    // One-to-Many (inverse side)
    @OneToMany(() => LoginCredential, credential => credential.baseUser)
    loginCredentials: LoginCredential[] = [];  // Collection relation
}
```

#### Relationship Configuration
1. **Required Relationships**
   - Use `!` suffix for required foreign keys and relation objects
   - Use `getModelRelationConfig(true, ...)` for required relationships
   - Always specify deletion behavior ('RESTRICT', 'CASCADE', etc.)

2. **Optional Relationships**
   - Use `?` suffix for optional foreign keys and relation objects
   - Use `getModelRelationConfig(false, ...)` for optional relationships
   - Initialize collections as empty arrays

3. **Bidirectional Relationships**
   - Always specify both sides of the relationship
   - Use proper back-reference in decorators
   - Follow consistent naming on both sides

#### Examples

1. **Required One-to-One (Organization -> Admin User)**
```typescript
// Organization side (owning)
@Column(getModelRelationConfig(true, 'RESTRICT').columnOptions)
@IsUUID()
adminUserId!: string;

@OneToOne(() => User, getModelRelationConfig(true, 'RESTRICT').relationOptions)
@JoinColumn({ name: 'adminUserId' })
adminUser!: User;

// User side (inverse)
@OneToOne(() => Organization, org => org.adminUser)
adminOfOrganization?: Organization;
```

2. **Required Many-to-One (LoginCredential -> BaseUser)**
```typescript
// LoginCredential side (owning)
@Column(getModelRelationConfig(true, 'RESTRICT').columnOptions)
@IsUUID()
baseUserId!: string;

@ManyToOne(() => BaseUser, baseUser => baseUser.loginCredentials, 
          getModelRelationConfig(true, 'RESTRICT').relationOptions)
@JoinColumn({ name: 'baseUserId' })
baseUser!: BaseUser;

// BaseUser side (inverse)
@OneToMany(() => LoginCredential, credential => credential.baseUser)
loginCredentials: LoginCredential[] = [];
```

3. **Optional Many-to-One (User -> Organization)**
```typescript
// User side (owning)
@Column(getModelRelationConfig(false, 'SET NULL').columnOptions)
@IsUUID()
@IsOptional()
organizationId?: string;

@ManyToOne(() => Organization, org => org.users,
          getModelRelationConfig(false, 'SET NULL').relationOptions)
@JoinColumn({ name: 'organizationId' })
organization?: Organization;

// Organization side (inverse)
@OneToMany(() => User, user => user.organization)
users: User[] = [];
```

#### Implementation Checklist
- [ ] Foreign keys use `xxxId` naming
- [ ] Relation objects use `xxx` naming (no Id suffix)
- [ ] Required fields marked with `!`
- [ ] Optional fields marked with `?`
- [ ] Collections initialized as empty arrays
- [ ] Proper deletion behavior specified
- [ ] JoinColumn decorators used on owning side
- [ ] Back-references properly configured
- [ ] Appropriate helper functions used
- [ ] Validation decorators included

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

### 1. Property Management
- Use property initialization instead of constructors
- Follow "When to Use Defaults" guidelines
- Keep required properties marked with `!`
- Use optional properties marked with `?`
- Initialize collections as empty arrays
- Set explicit boolean defaults
- Use enum defaults for state fields

### 2. Type Safety
- Use strict TypeScript configuration
- Leverage enum types for constrained values
- Avoid `any` type
- Use proper types for all properties
- Define explicit types for JSON fields
- Use class-validator decorators consistently
- Include proper type imports

### 3. Relationship Management
- Use appropriate helper for relationship type
- Consider deletion behavior carefully
- Document relationship constraints
- Add indices for foreign keys
- Keep foreign key naming consistent
- Use explicit JoinColumn decorators
- Consider lazy/eager loading implications

### 4. Data Integrity
- Set appropriate field lengths
- Use explicit nullability
- Add proper validation decorators
- Include business rule validations
- Set meaningful default values
- Use appropriate column types
- Consider database compatibility
- Add unique constraints where needed

### 5. Documentation
- Document all fields and constraints
- Explain relationship behaviors
- Note future considerations
- Include usage examples
- Document default values
- Explain validation rules
- Add JSDoc comments
- Keep documentation up to date

### 6. Testing Considerations
- Test default property values
- Verify required fields
- Test validation rules
- Check type safety
- Test enum values
- Verify computed properties
- Test business rules
- Keep tests focused on model behavior

### 7. Code Organization
- Follow field organization order
- Group related properties
- Keep validation near properties
- Organize imports logically
- Use consistent decorator order
- Maintain clear separation of concerns
- Follow naming conventions strictly

### 8. Performance and Scalability
- Consider index impact
- Use appropriate fetch strategies
- Keep JSON fields simple
- Consider query performance
- Use efficient data types
- Plan for data growth
- Consider migration impact
- Think about cache implications

## Verification Checklist
- [ ] Uses appropriate helper functions
- [ ] Has comprehensive documentation
- [ ] Follows naming conventions
- [ ] Includes proper indices
- [ ] Handles relationships correctly
- [ ] Specifies field constraints
- [ ] Provides proper defaults
- [ ] Considers database compatibility