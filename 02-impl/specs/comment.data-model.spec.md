# Data Model Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/comment.data-model.spec.md`

## Model Name: Comment

## Related Specifications
- APIs: [@api:Comment]
- Classes: [@class:Comment]

## Properties

### Required Properties
- id: string
  - Purpose: Unique identifier
  - Constraints: UUID
- content: string
  - Purpose: Comment text content
  - Constraints: Non-empty string
- contentItemId: string
  - Purpose: Reference to parent content
  - Constraints: Valid ID
- createdAt: Date
  - Purpose: Creation timestamp
  - Constraints: Valid date

### Optional Properties
None

## Relationships
- ContentItem: [@model:Content]
  - Nature: many-to-one
  - Purpose: Links comment to parent content

## Core Validation
- Content validation
  - Applies to: content
  - Logic: Must not be empty

## DTOs

### CreateDTO
```typescript
{
  content: string;
  contentItemId: string;
}
```

### UpdateDTO
```typescript
{
  content: string;
}
```

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for 10K user site scale.
Complex features noted as future extensions.
