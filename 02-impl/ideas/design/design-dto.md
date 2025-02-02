# DTO Layer Design and Standards

## Overview
This document defines our Data Transfer Object (DTO) layer standards and patterns, established through careful consideration and implementation across our core models.

## Standardized Patterns

### 1. DTO Types and Structure

#### Create DTOs
```typescript
export class CreateEntityDto {
    // Required Core Fields
    @ApiProperty({
        description: 'Clear field description',
        example: 'Realistic example value',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @Length(1, 255)
    name!: string;

    // Optional Fields with Defaults
    @ApiProperty({
        description: 'Clear field description',
        example: true,
        default: false,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean = false;

    // Relationship Fields (IDs only)
    @ApiProperty({
        description: 'ID of the related entity',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    relatedEntityId!: string;

    // Enum Fields
    @ApiProperty({
        description: 'Type of entity',
        enum: EntityType,
        example: EntityType.STANDARD,
        enumName: 'EntityType'
    })
    @IsEnum(EntityType)
    type!: EntityType;
}
```

#### Update DTOs
```typescript
export class UpdateEntityDto {
    // All fields optional
    @ApiProperty({
        description: 'Clear field description',
        example: 'Realistic example value',
        minLength: 1,
        maxLength: 255,
        required: false
    })
    @IsString()
    @Length(1, 255)
    @IsOptional()
    name?: string;

    // Maintain same validation rules as Create DTO
    @ApiProperty({
        description: 'Type of entity',
        enum: EntityType,
        example: EntityType.STANDARD,
        enumName: 'EntityType',
        required: false
    })
    @IsEnum(EntityType)
    @IsOptional()
    type?: EntityType;
}
```

#### Response DTOs
```typescript
@Exclude()
export class ResponseEntityDto {
    // Standard Fields
    @Expose()
    @ApiProperty({
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id!: string;

    @Expose()
    @ApiProperty({
        description: 'Entity name',
        example: 'Example Name'
    })
    name!: string;

    // Nested Objects
    @Expose()
    @Type(() => ResponseRelatedDto)
    @ApiProperty({
        description: 'Related entity details',
        type: () => ResponseRelatedDto
    })
    relatedEntity?: ResponseRelatedDto;

    // Standard Timestamps
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

### 2. Naming Conventions

#### File Structure
```
src/dtos/
├── Entity/
│   ├── CreateEntityDto.ts
│   ├── UpdateEntityDto.ts
│   ├── ResponseEntityDto.ts
│   └── index.ts
```

#### Class Names
- Create DTOs: `Create${Entity}Dto`
- Update DTOs: `Update${Entity}Dto`
- Response DTOs: `Response${Entity}Dto`
- Nested DTOs: `${Entity}${Purpose}Dto`

### 3. Validation Standards

#### Required Fields
```typescript
// String Fields
@IsString({ message: 'Field must be a string' })
@IsNotEmpty({ message: 'Field is required' })
@Length(2, 255, { message: 'Field must be between 2 and 255 characters' })
field!: string;

// Enum Fields
@IsEnum(EntityType, { message: 'Invalid entity type' })
@IsNotEmpty({ message: 'Type is required' })
type!: EntityType;

// UUID Fields
@IsUUID(undefined, { message: 'Invalid UUID format' })
@IsNotEmpty({ message: 'ID is required' })
id!: string;
```

#### Optional Fields
```typescript
// Optional with Default
@IsBoolean({ message: 'Must be a boolean value' })
@IsOptional()
isEnabled?: boolean = false;

// Optional without Default
@IsString({ message: 'Must be a string value' })
@IsOptional()
description?: string;
```

### 4. Documentation Standards

#### API Property Decorators
```typescript
@ApiProperty({
    description: 'Clear, concise description of the field',
    example: 'Realistic example value',
    required: true,  // or false for optional
    type: () => Type,  // for complex types
    enum: Enum,  // for enum fields
    enumName: 'EnumName',  // for swagger docs
    default: defaultValue,  // if applicable
    minimum: 0,  // for number constraints
    maximum: 100,  // for number constraints
    minLength: 1,  // for string constraints
    maxLength: 255,  // for string constraints
})
```

### 5. Relationship Handling

Our DTOs follow a strict pattern for handling relationships:
- Create/Update DTOs use IDs only
- Response DTOs include full objects
- No mixed patterns allowed

#### Create/Update DTOs
```typescript
export class CreateEntityDto {
    // Single Relationships
    @ApiProperty({
        description: 'ID of the parent entity',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty({ message: 'Parent ID is required' })
    parentId!: string;

    // Optional Single Relationships
    @ApiProperty({
        description: 'ID of the optional related entity',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    relatedId?: string;

    // Many Relationships
    @ApiProperty({
        description: 'IDs of the related entities',
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String],
        required: false
    })
    @IsArray()
    @IsUUID(undefined, { each: true })
    @IsOptional()
    relatedIds?: string[];
}

// ❌ INCORRECT - Never include nested objects in Create/Update DTOs
export class WrongCreateEntityDto {
    @Type(() => CreateRelatedDto)  // Don't do this
    related!: CreateRelatedDto;
}
```

#### Response DTOs
```typescript
@Exclude()
export class ResponseEntityDto {
    // Single Relationships
    @Expose()
    @Type(() => ResponseParentDto)
    @ApiProperty({
        description: 'Parent entity details',
        type: () => ResponseParentDto
    })
    parent!: ResponseParentDto;  // Required relationship

    // Optional Single Relationships
    @Expose()
    @Type(() => ResponseRelatedDto)
    @ApiProperty({
        description: 'Related entity details',
        type: () => ResponseRelatedDto,
        required: false
    })
    related?: ResponseRelatedDto;  // Optional relationship

    // Many Relationships
    @Expose()
    @Type(() => ResponseChildDto)
    @ApiProperty({
        description: 'Child entities',
        type: [ResponseChildDto],
        required: false
    })
    children: ResponseChildDto[] = [];  // Initialize empty array

    // ❌ INCORRECT - Never expose just IDs in Response DTOs
    @Expose()
    parentId!: string;  // Don't do this
}
```

#### Circular References
For circular references (e.g., User -> Organization -> User):

```typescript
@Exclude()
export class ResponseUserDto {
    // ... other fields ...

    @Expose()
    @Type(() => ResponseOrganizationDto)
    @ApiProperty({
        description: 'User\'s organization',
        type: () => ResponseOrganizationDto
    })
    organization?: ResponseOrganizationDto;
}

@Exclude()
export class ResponseOrganizationDto {
    // ... other fields ...

    @Expose()
    @Type(() => ResponseUserDto)
    @ApiProperty({
        description: 'Organization\'s users',
        type: [ResponseUserDto]
    })
    users: ResponseUserDto[] = [];
}
```

#### Best Practices
1. **Create/Update DTOs**
   - Always use IDs for relationships
   - Validate UUIDs with `@IsUUID()`
   - Use clear ID field names (`parentId`, not `parent`)
   - Initialize array relationships as undefined

2. **Response DTOs**
   - Always return full objects
   - Use `@Type()` decorator for proper transformation
   - Initialize arrays as empty arrays
   - Use proper TypeScript optionality

3. **General Rules**
   - No mixed patterns allowed
   - Clear, consistent naming
   - Proper documentation
   - Handle circular references through lazy loading

### 6. Type Inheritance

#### Base DTOs
```typescript
// Base create DTO
export class CreateBaseEntityDto {
    @ApiProperty({
        description: 'Entity name',
        example: 'Example Name'
    })
    @IsString()
    @Length(1, 255)
    name!: string;
}

// Extended create DTO
export class CreateSpecificEntityDto extends CreateBaseEntityDto {
    @ApiProperty({
        description: 'Additional field',
        example: 'Additional value'
    })
    @IsString()
    additionalField!: string;
}
```

## Best Practices

### 1. Field Organization
1. Required core fields first
2. Optional core fields second
3. Relationship fields third
4. Computed/derived fields last
5. Group related fields together

### 2. Validation Strategy
1. Use class-validator decorators consistently
2. Include clear error messages
3. Share validation rules with models where appropriate
4. Handle nested validation properly

### 3. Documentation
1. Use OpenAPI decorators for all fields
2. Include realistic example values
3. Document all constraints
4. Maintain API versioning information

### 4. Performance Considerations
1. Use appropriate field types
2. Consider response size
3. Handle pagination properly
4. Optimize nested objects

## Common Patterns

### 1. Pagination Response
```typescript
@Exclude()
export class PaginatedResponseDto<T> {
    @Expose()
    @ApiProperty({ description: 'List of items' })
    items!: T[];

    @Expose()
    @ApiProperty({ description: 'Total number of items' })
    total!: number;

    @Expose()
    @ApiProperty({ description: 'Current page number' })
    page!: number;

    @Expose()
    @ApiProperty({ description: 'Number of items per page' })
    pageSize!: number;
}
```

### 2. Error Response
```typescript
@Exclude()
export class ErrorResponseDto {
    @Expose()
    @ApiProperty({ description: 'Error message' })
    message!: string;

    @Expose()
    @ApiProperty({ description: 'Error code' })
    code!: string;

    @Expose()
    @ApiProperty({ description: 'Additional error details' })
    details?: Record<string, unknown>;
}
```

## Success Criteria
- [ ] DTOs follow consistent naming conventions
- [ ] All fields have appropriate validation rules
- [ ] Documentation is complete and accurate
- [ ] Relationships are handled properly
- [ ] Error messages are clear and helpful
- [ ] Performance considerations are addressed
- [ ] Common patterns are followed
