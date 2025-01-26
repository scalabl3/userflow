# Class Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/comment.class.spec.md`

## Class Name: CommentService

## Related Specifications
- Models: [@model:Comment]
- APIs: [@api:Comment]

## Constructor
```typescript
constructor(
  private readonly repository: CommentRepository
)
```

## Properties
- repository: CommentRepository
  - Purpose: Data access layer
  - Access: private

## Core Methods

### create
- Purpose: Create new comment
- Parameters: CreateDTO
- Returns: Comment
- Errors: invalid input

### findById
- Purpose: Get comment by id
- Parameters: id: string
- Returns: Comment
- Errors: not found

### findByContentItem
- Purpose: Get content's comments
- Parameters: contentItemId: string
- Returns: Comment[]
- Errors: not found

### update
- Purpose: Update comment text
- Parameters: id: string, UpdateDTO
- Returns: Comment
- Errors: not found

### delete
- Purpose: Remove comment
- Parameters: id: string
- Returns: boolean
- Errors: not found

## Error Handling
Basic errors handled:
- Invalid input
- Not found
- Server error

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for 10K user site scale.
Complex features noted as future extensions.
