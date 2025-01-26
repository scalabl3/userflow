# DCA Modify Template

```markdown
MODIFY_DCA: [ComponentName]
SCALE: [X]K
OPERATION: [ADD/REMOVE specific feature]

CORE_CHANGE:
[One sentence describing the essential change]

MUST_MODIFY:
- [specific_change]
- [specific_change]

EXPLICITLY_NOT_INCLUDED:
- New auth/roles (unless specified)
- New peripheral features
- Changes to existing constraints
```

Expected Response:
```markdown
## Verification
Scale: Confirm still within [X]K limit
Impact: List only affected components
Constraints: Confirm no scope creep

## Plan
Files to modify in 02-impl/specs/:
- [name].model.spec.md: [specific data changes]
- [name].class.spec.md: [specific behavior changes]
- [name].api.spec.md: [specific endpoint changes]

Proceed with changes? (Y/N)
```

Example:
```markdown
MODIFY_DCA: Comment
SCALE: 10K
OPERATION: ADD edit timestamp

CORE_CHANGE:
Track when comments are edited

MUST_MODIFY:
- Add lastEdited timestamp
- Update edit endpoint response

EXPLICITLY_NOT_INCLUDED:
- Edit history
- User notifications
- Admin features
``` 