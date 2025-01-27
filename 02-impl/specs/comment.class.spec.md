# CommentService

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

### repository
- Type: CommentRepository
- Purpose: Data access for comments
- Access: private

## Core Methods

### create
- Purpose: Create new comment
- Parameters: CreateCommentDTO
- Returns: Comment
- Errors: invalid input

### findById
- Purpose: Get single comment
- Parameters: id: string
- Returns: Comment | null
- Errors: not found

### findByContentItem
- Purpose: List content's comments
- Parameters: contentItemId: string
- Returns: Comment[]
- Errors: not found

### update
- Purpose: Modify comment text
- Parameters: id: string, UpdateCommentDTO
- Returns: Comment
- Errors: not found

### delete
- Purpose: Remove comment
- Parameters: id: string
- Returns: boolean
- Errors: not found

## Error Handling
- Invalid input validation
- Not found checks
- Server errors

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Class follows generation rules for 10K user site scale.
Complex features noted as future extensions.
