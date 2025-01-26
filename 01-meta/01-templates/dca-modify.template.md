# DCA Modify Template

```markdown
MODIFY_DCA: [ComponentName]
SCALE: [X]K
OPERATION: [ADD/CHANGE/REMOVE feature]

PURPOSE:
[One clear sentence]

CHANGES:
- [change1]
- [change2]

DEPENDENCIES:
- [@type:Name]
```

Expected Response:
```markdown
## Impact
- Breaking changes
- Data migration needs
- API version impact

## Plan
Files to modify in 02-impl/specs/:
- [name].model.spec.ts: [brief changes]
- [name].class.spec.ts: [brief changes]
- [name].api.spec.ts: [brief changes]

Migration steps:
[Brief bullet points]

Proceed with changes? (Y/N)
```

Example:
```markdown
MODIFY_DCA: User
SCALE: 10K
OPERATION: ADD password reset

PURPOSE:
Add secure password reset via email

CHANGES:
- Add reset token handling
- Add reset endpoints

DEPENDENCIES:
- @class:EmailService
``` 