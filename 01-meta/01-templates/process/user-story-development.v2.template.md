# Story Development Template (v2)

## Output Location
Generated stories MUST be placed in: `02-implementation-docs/product/stories/`
Following naming convention: `STORY-{TYPE}-{NUMBER}.md`
Example: `STORY-USER-001.md`, `STORY-DEPLOY-001.md`

⚠️ IMPORTANT: Never create stories in the template directory. All generated content goes to the implementation directory.

## Story Structure
```markdown
# [Type] Stories

## Story Relationships
1. STORY-XXX-001 ([Name])
   - Provides: [Core capability provided]
   - Required by: [Dependencies]
   - Enhances: [What it improves]

2. STORY-YYY-001 ([Name])
   - Provides: [Core capability provided]
   - Required by: [Dependencies]
   - Enhances: [What it improves]

## Epic: [Name]
As a [type of user]
I want to [achieve something]
So that [benefit/value]

### STORY-XXX-001: [Name]
As a [type of user]
I want to [perform action]
So that [achieve outcome]

**Acceptance Criteria:**
1. Given [context]
   When [action]
   Then I should:
   - [Result 1]
   - [Result 2]
   - [Result 3]
   And [final state]

2. Given [context]
   When [action]
   Then I should:
   - [Result 1]
   - [Result 2]
   - [Result 3]
   And [final state]

### Technical Notes

### Core Requirements
- Essential feature group 1
  - Requirement 1
  - Requirement 2
  - Requirement 3
- Essential feature group 2
  - Requirement 1
  - Requirement 2
  - Requirement 3

### Implementation Constraints
- Must [requirement 1]
- Must [requirement 2]
- Must [requirement 3]
- Must [requirement 4]
- Must [requirement 5]

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Focus is on essential features for sites under 10K users.
Complex features can be added as sites grow.
```

## Story Development Guidelines

1. **Story Relationships**
   - Always use Provides/Required by/Enhances pattern
   - Keep relationships focused and clear
   - List core stories first, then supporting stories

2. **Epic Level**
   - Focus on user value
   - Keep it simple and clear
   - Align with template goals

3. **Story Level**
   - Clear user perspective
   - Specific actions
   - Measurable outcomes

4. **Acceptance Criteria**
   - Given/When/Then format
   - Bullet points for clarity
   - "And" for final state

5. **Technical Notes**
   - Essential requirements only
   - Clear constraints
   - Simple implementation

## Version History
VERSION: 2.0
DATE: [current_date]
CHANGES: 
- Added consistent story relationships pattern
- Simplified structure for 10K user focus
- Added clear scope boundary
- Removed complex feature sections 