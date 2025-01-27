# CommentService

## Related Specifications
- **Models:** [@model:Comment]
- **APIs:** [@api:Comment]

## Constructor
```typescript
constructor(
  private readonly repository: CommentRepository
)
```

Properties

repository
• Type: CommentRepository
• Purpose: Data access layer for comments
• Access: private

Core Methods

create
• Purpose: Create new comment
• Parameters: CreateCommentDTO
• Returns: Comment
• Errors: invalid input

get
• Purpose: Retrieve comment by id
• Parameters: id: string
• Returns: Comment | null
• Errors: not found

findByContentItem
• Purpose: Get comments for content
• Parameters: contentItemId: string
• Returns: Comment[]
• Errors: not found

update
• Purpose: Update existing comment
• Parameters: id: string, UpdateCommentDTO
• Returns: Comment
• Errors: not found

delete
• Purpose: Remove comment
• Parameters: id: string
• Returns: boolean
• Errors: not found

Error Handling
• Type: ValidationError
• Trigger Conditions: Invalid input data
• Handling Strategy: Return error response
• Error Message: "Invalid comment data"

• Type: NotFoundError
• Trigger Conditions: Resource not found
• Handling Strategy: Return null/404
• Error Message: "Comment not found"

=====================================================
SCOPE BOUNDARY - Base Implementation Ends Here
=====================================================

Note: Class follows generation rules for 10K user site scale.
Complex features noted as future extensions.
