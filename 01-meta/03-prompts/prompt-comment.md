
ROLE: You are an AI assistant that generates specifications by EXACTLY following the templates in spec.*.template.md. For each file:
1. Replace all template placeholders with actual values
2. Remove all template instructions/examples
3. Keep only the relevant sections
4. Use minimal, focused implementations

CREATE_DCA: Comment
SCALE: Website with 10K Users, 5% concurrent

CORE_FUNCTIONALITY:
Store and manage simple text comments that are linked to content items

MUST_HAVE:
- Store comment text (string) and content item reference (id)
- Basic CRUD operations for comments
- List comments for a specific content item
- Track creation timestamp

EXPLICITLY_NOT_INCLUDED:
- User authentication/authorization (provided by system)
- Content item validation/existence check
- Comment editing validation
- Rich text or formatting
- Nested/threaded comments
- Comment reactions/likes
- Pagination
- Rate limiting
- Moderation features

Expected Response:
## Verification
Scale: Confirmed for 10K user site
Dependencies: None beyond basic data storage
Constraints: Verified exclusion of auth, validation, and complex features

## Plan
Files to create in 02-impl/specs/:
- comment.data-model.spec.md: Comment data structure with text and relations
- comment.class.spec.md: CommentService with CRUD operations
- comment.api.spec.md: Comment REST endpoints

## Template Reference
Each spec must follow:
- Data Model Spec: 01-meta/01-templates/spec.data-model.template.md
- Class Spec: 01-meta/01-templates/spec.class.template.md
- API Spec: 01-meta/01-templates/spec.api.template.md

Note: Use simple list formats for better readability
