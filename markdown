# Data Model Specification

## Model Name: Comment

## Related Specifications
- Class: @class:Comment
- API: @api:Comments
- Related Models: [@model:User, @model:Content]

## Properties
- id (UUID) - required, unique, default=uuid(): Primary key
- content (string) - required=Y, unique=N, default=null: The comment text content
- userId (UUID) - required=Y, unique=N, default=null: Reference to user who created comment
- contentId (UUID) - required=Y, unique=N, default=null: Reference to content being commented on
- createdAt (DateTime) - required=Y, unique=N, default=now(): Timestamp of creation
- updatedAt (DateTime) - required=Y, unique=N, default=now(): Timestamp of last update

## Relationships
- @model:User (belongsTo) - Comment creator - one user can have many comments
- @model:Content (belongsTo) - Commented content - one content can have many comments

## Indexes
- comment_user_idx ([userId], btree) - Index for finding user's comments
- comment_content_idx ([contentId], btree) - Index for finding content's comments
- comment_timestamps_idx ([createdAt, updatedAt], btree) - Index for time-based queries

## Validation Rules
- content - minLength(1): Comment cannot be empty
- content - maxLength(1000): Comment cannot exceed 1000 characters
- userId - exists: Must reference valid user
- contentId - exists: Must reference valid content

## DTOs
### CreateCommentDto
- content (string) - required=Y: The comment text
- contentId (UUID) - required=Y: ID of content being commented on

### UpdateCommentDto
- content (string) - required=Y: The updated comment text

## Constraints
- Maximum 1000 characters per comment
- Users can only edit their own comments
- Soft deletion for comment history preservation
- No nested/threaded comments in base implementation

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for 10K user site scale.
Complex features like threading, reactions, or formatting noted as future extensions.
