# API Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/comment.api.spec.md`

## API Group: Comment

## Related Specifications
- Models: [@model:Comment]
- Classes: [@class:Comment]

## Base Path
`/api/v1/comments`

## Core Endpoints

### POST /
- Purpose: Create comment
- Request: content fields needed for creation
```typescript
{
  content: string,
  contentItemId: string
}
```
- Response: created comment
- Errors: invalid input (400)

### GET /:id
- Purpose: Retrieve comment
- Response: comment data
- Errors: not found (404)

### GET /content/:contentItemId
- Purpose: List content's comments
- Response: comment[] data
- Errors: not found (404)

### PUT /:id
- Purpose: Update comment
- Request: fields that can be updated
```typescript
{
  content: string
}
```
- Response: updated comment
- Errors: not found (404)

### DELETE /:id
- Purpose: Remove comment
- Response: success confirmation
- Errors: not found (404)

## Error Handling
Basic errors listed as: error (code)
- Invalid input (400)
- Not found (404)
- Server error (500)

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: API follows generation rules for 10K user site scale.
Complex features noted as future extensions.
