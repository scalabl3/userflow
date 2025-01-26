# Class Specification

## Class Name: Comment

## Related Specifications
- Model: @model:Comment
- API: @api:Comments
- Dependencies: [@class:User, @class:Content, @class:ModerationService]

## Constructor
### Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| content | string | Yes | Comment text |
| authorId | UUID | Yes | Author reference |
| contentId | UUID | Yes | Content reference |
| parentId | UUID | No | Parent comment |

### Initialization
- Validate content length and format
- Check author verification status
- Calculate thread depth if parent exists
- Set initial status to 'active'

## Properties
| Name | Type | Access | Mutable | Description |
|------|------|--------|---------|-------------|
| id | UUID | public | No | Unique identifier |
| content | string | public | Yes | Comment text |
| status | CommentStatus | public | Yes | Current state |
| editWindow | boolean | public | No | Can still edit |

## Methods

### create
- Access: public
- Purpose: Create new comment

#### Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| dto | CreateCommentDTO | Yes | Comment data |

#### Returns
- Type: Comment
- Description: Created comment instance

#### Errors
| Error | Condition | HTTP Code |
|-------|-----------|-----------|
| ValidationError | Invalid content | 400 |
| ThreadDepthError | Max depth exceeded | 400 |
| AuthError | Unverified author | 403 |

### update
- Access: public
- Purpose: Edit comment content

#### Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| dto | UpdateCommentDTO | Yes | Updated data |

#### Errors
| Error | Condition | HTTP Code |
|-------|-----------|-----------|
| TimeWindowError | Past 15min window | 403 |

### delete
- Access: public
- Purpose: Soft delete comment

### report
- Access: public
- Purpose: Flag inappropriate content

## Error Handling
| Scenario | Action | Recovery |
|----------|--------|----------|
| Rate limit exceeded | Block creation | Wait period |
| Edit window expired | Prevent update | None |
| Thread too deep | Reject creation | Create new thread |

## Implementation Constraints
- Enforce 15-minute edit window
- Check rate limits before operations
- Validate thread depth on creation
- Maintain audit trail of changes
- Handle moderation state transitions

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Class follows generation rules for 10K user site scale.
