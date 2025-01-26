# Data Model Specification

## Model Name: Comment

## Related Specifications
- Class: @class:Comment
- API: @api:Comments
- Related Models: [@model:User, @model:Content]

## Properties
| Name | Type | Required | Unique | Default | Description |
|------|------|----------|---------|---------|-------------|
| id | UUID | Yes | Yes | uuid() | Primary key |
| content | string | Yes | No | - | Comment text, max 1000 chars |
| authorId | UUID | Yes | No | - | Reference to User |
| contentId | UUID | Yes | No | - | Reference to Content item |
| parentId | UUID | No | No | null | Parent comment for threading |
| depth | integer | Yes | No | 0 | Thread depth level (0-3) |
| status | enum | Yes | No | 'active' | active/deleted/flagged |
| createdAt | timestamp | Yes | No | now() | Creation timestamp |
| updatedAt | timestamp | Yes | No | now() | Last update timestamp |
| deletedAt | timestamp | No | No | null | Soft delete timestamp |

## Relationships
| Model | Type | Through | Description | Constraints |
|-------|------|---------|-------------|-------------|
| @model:User | belongsTo | - | Comment author | Required |
| @model:Content | belongsTo | - | Parent content | Required |
| @model:Comment | belongsTo | - | Parent comment | Optional |
| @model:Comment | hasMany | - | Child comments | Max depth 3 |

## Indexes
| Name | Fields | Type | Description |
|------|--------|------|-------------|
| content_comments_idx | [contentId] | btree | Find comments for content |
| author_comments_idx | [authorId] | btree | Find user's comments |
| parent_comments_idx | [parentId] | btree | Find child comments |
| comment_status_idx | [status] | btree | Filter by status |

## Validation Rules
| Field | Rule | Message |
|-------|------|---------|
| content | length <= 1000 | Comment exceeds maximum length |
| content | not empty | Comment cannot be empty |
| depth | <= 3 | Maximum thread depth exceeded |

## DTOs
### CreateDTO
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | Yes | Comment text |
| contentId | UUID | Yes | Target content |
| parentId | UUID | No | Parent comment |

### UpdateDTO
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | Yes | Updated text |

## Constraints
- Comments can only be edited within 15 minutes of creation
- Soft deletion preserves thread structure
- Author must be verified user
- Rate limiting: 10 comments per minute per user
- Thread depth cannot exceed 3 levels

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for 10K user site scale.
Complex features like real-time updates and rich text noted as future extensions.
