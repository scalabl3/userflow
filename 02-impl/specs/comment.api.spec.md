# API Specification

## API Group: Comments

## Related Specifications
- Models: [@model:Comment]
- Classes: [@class:Comment]
- Dependencies: [@api:Users, @api:Content]

## Base Path
`/api/v1/comments`

## Authentication
- Required: Y
- Type: Bearer Token
- Roles: authenticated users

## Rate Limiting
- Max Requests: 100/minute
- Burst: 20
- Recovery: 60s

## Endpoints

### POST /
- Purpose: Create new comment
- Auth Required: Y
- Roles: authenticated

#### Request
```typescript
interface Request {
  body: {
    content: string;    // Comment text
    contentId: string;  // UUID of content being commented on
  }
}
```

#### Response
```typescript
interface Response {
  id: string;          // Comment UUID
  content: string;     // Comment text
  userId: string;      // Creator UUID
  contentId: string;   // Content UUID
  createdAt: string;   // ISO timestamp
  updatedAt: string;   // ISO timestamp
}
```

#### Status Codes
- 201 - Comment created
- 400 - Invalid input
- 401 - Not authenticated
- 404 - Content not found

### GET /:id
- Purpose: Retrieve single comment
- Auth Required: Y
- Roles: authenticated

#### Request
```typescript
interface Request {
  params: {
    id: string;        // Comment UUID
  }
}
```

#### Response
```typescript
interface Response {
  id: string;          // Comment UUID
  content: string;     // Comment text
  userId: string;      // Creator UUID
  contentId: string;   // Content UUID
  createdAt: string;   // ISO timestamp
  updatedAt: string;   // ISO timestamp
}
```

#### Status Codes
- 200 - Success
- 404 - Not found

### PUT /:id
- Purpose: Update comment
- Auth Required: Y
- Roles: comment owner

#### Request
```typescript
interface Request {
  params: {
    id: string;        // Comment UUID
  }
  body: {
    content: string;   // Updated text
  }
}
```

#### Response
```typescript
interface Response {
  id: string;          // Comment UUID
  content: string;     // Updated text
  userId: string;      // Creator UUID
  contentId: string;   // Content UUID
  createdAt: string;   // ISO timestamp
  updatedAt: string;   // ISO timestamp
}
```

#### Status Codes
- 200 - Updated
- 400 - Invalid input
- 401 - Not authenticated
- 403 - Not authorized
- 404 - Not found

### DELETE /:id
- Purpose: Delete comment
- Auth Required: Y
- Roles: comment owner

#### Request
```typescript
interface Request {
  params: {
    id: string;        // Comment UUID
  }
}
```

#### Response
```typescript
interface Response {
  success: boolean;    // True if deleted
}
```

#### Status Codes
- 200 - Deleted
- 401 - Not authenticated
- 403 - Not authorized
- 404 - Not found

## Error Handling
- Invalid input - Return 400 with validation details
- Not found - Return 404
- Unauthorized - Return 401/403 with reason
- Server error - Return 500 with error ID

## Implementation Constraints
- Maximum comment length: 1000 chars
- Only owners can edit/delete their comments
- Soft deletion preserves comment history
- No nested/threaded comments

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: API follows generation rules for 10K user site scale.
Complex features like threading, reactions, or formatting noted as future extensions.
