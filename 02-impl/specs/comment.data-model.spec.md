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
  - Purpose: Unique identifier for the comment
  - Constraints: UUID v4
- content: string
  - Purpose: The text content of the comment
  - Constraints: Non-empty, max 1000 chars
- authorId: string
  - Purpose: Reference to the user who created the comment
  - Constraints: Valid user ID
- contentItemId: string
  - Purpose: Reference to the content item being commented on
  - Constraints: Valid content item ID
- createdAt: Date
  - Purpose: Timestamp of comment creation
  - Constraints: Valid ISO date

### Optional Properties  
- updatedAt: Date
  - Purpose: Timestamp of last update
  - Default: null

## Relationships
- Author: [@model:User]
  - Nature: many-to-one
  - Purpose: Links comment to its creator
- ContentItem: [@model:Content]
  - Nature: many-to-one
  - Purpose: Links comment to its parent content

## Core Validation
- Content length validation
  - Applies to: content
  - Logic: Must be between 1-1000 characters
- Author validation
  - Applies to: authorId
  - Logic: Must reference existing user
- Content item validation
  - Applies to: contentItemId
  - Logic: Must reference existing content item

## DTOs

### CreateDTO
```typescript
{
  content: string;
  contentItemId: string;
  // authorId added by system
}
```

### UpdateDTO
```typescript
{
  content?: string;
}
```

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for 10K user site scale.
Complex features noted as future extensions.
