# Data Model Specification

## Model Name: Comment

## Properties
- id (UUID) - required=Y, unique=Y, default=uuid(): Primary identifier for the comment
- content (string) - required=Y, unique=N, default=null: The actual comment text
- userId (UUID) - required=Y, unique=N, default=null: Reference to the comment author
- contentId (UUID) - required=Y, unique=N, default=null: Reference to the commented content
- createdAt (DateTime) - required=Y, unique=N, default=now(): Creation timestamp
- updatedAt (DateTime) - required=Y, unique=N, default=now(): Last update timestamp
- isDeleted (boolean) - required=Y, unique=N, default=false: Soft deletion flag

## Relationships
- @model:User (belongsTo) - Each comment belongs to one user
- @model:Content (belongsTo) - Each comment belongs to one content item

## Indexes
- PRIMARY KEY (id)
- comment_user_idx (userId)
- comment_content_idx (contentId)
- comment_timestamps_idx (createdAt, updatedAt)

## Validation Rules
- content:
  - Required
  - String
  - Min length: 1 character
  - Max length: 1000 characters
- userId:
  - Required
  - Must reference valid User
- contentId:
  - Required
  - Must reference valid Content

## DTOs

### CreateCommentDto
- content (string) - required=Y: Comment text content
- contentId (UUID) - required=Y: ID of content being commented on

### UpdateCommentDto
- content (string) - required=Y: Updated comment text

## Constraints
- Maximum comment length: 1000 characters
- Soft deletion only
- No nested/threaded comments
- No formatting/HTML allowed in content

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for 10K user site scale.
Complex features like threading, reactions, or formatting noted as future extensions.
