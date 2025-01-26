# DCA Delete Template

```markdown
DELETE_DCA: [ComponentName]
SCALE: [X]K

REASON:
[One sentence explaining why]

MUST_HANDLE:
- [specific_cleanup]
- [specific_cleanup]

EXPLICITLY_NOT_INCLUDED:
- Complex data migrations
- New features in dependent components
- Replacement functionality
```

Expected Response:
```markdown
## Verification
Dependencies: List only directly affected components
Data: Confirm minimal cleanup approach
Constraints: Verify no new features needed

## Plan
Files to remove from 02-impl/specs/:
- [name].model.spec.md
- [name].class.spec.md
- [name].api.spec.md

Simple cleanup steps:
1. [basic_step]
2. [basic_step]

Proceed with deletion? (Y/N)
```

Example:
```markdown
DELETE_DCA: Comment
SCALE: 10K

REASON:
Removing comment feature entirely

MUST_HANDLE:
- Delete comment data
- Remove UI elements

EXPLICITLY_NOT_INCLUDED:
- Data archiving
- User notifications
- Alternative features
``` 