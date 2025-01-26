# API Specification

## API Group: Comments

## Related Specifications
- Models: [@model:Comment]
- Classes: [@class:Comment]
- Dependencies: [@api:Users, @api:Content]

## Base Path
`/api/v1/comments`

## Authentication
- Required: Yes
- Type: Bearer Token
- Roles: user, moderator, admin

## Rate Limiting
- Max Requests: 10/minute
- Burst: 15
- Recovery: 60s

## Endpoints

### POST /
- Purpose: Create new comment
- Auth Required: Yes
- Roles: user

#### Request
```typescript
interface Request {
  body: {
    content: string;
    contentId: string;
    parentId?: string;
  }
}
```

#### Response
```typescript
interface Response {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}
```

### PATCH /:id
- Purpose: Update comment
- Auth Required: Yes
- Roles: user (owner)

#### Request
```typescript
interface Request {
  params: {
    id: string;
  }
  body: {
    content: string;
  }
}
```

### DELETE /:id
- Purpose: Soft delete comment
- Auth Required: Yes
- Roles: user (owner), moderator, admin

### POST /:id/report
- Purpose: Report inappropriate content
- Auth Required: Yes
- Roles: user

#### Status Codes
| Code | Condition |
|------|-----------|
| 201 | Comment created |
| 200 | Comment updated/deleted |
| 403 | Edit window expired |
| 404 | Comment not found |

#### Error Responses
| Code | Error | Condition |
|------|-------|-----------|
| 400 | ValidationError | Invalid content |
| 403 | AuthError | Unauthorized |
| 429 | RateLimitError | Too many requests |

## Error Handling
| Scenario | Action | Response |
|----------|--------|----------|
| Rate limit | Block request | 429 with retry-after |
| Invalid content | Reject with details | 400 with validation errors |
| Thread depth | Reject creation | 400 with depth error |

## Implementation Constraints
- Validate all input
- Rate limit by user
- Check edit window
- Verify ownership
- Handle soft deletes
- Track moderation state

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: API follows generation rules for 10K user site scale.
