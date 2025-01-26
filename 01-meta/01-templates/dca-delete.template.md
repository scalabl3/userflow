# DCA Delete Template

```markdown
DELETE_DCA: [ComponentName]
SCALE: [X]K

PURPOSE:
[One clear sentence]

DEPENDENCIES:
- [@type:Name]

DATA:
- [preservation need]
- [cleanup need]
```

Expected Response:
```markdown
## Impact
- Direct dependencies
- Indirect dependencies
- Client systems affected

## Plan
Files to remove from 02-impl/specs/:
- [name].model.spec.ts
- [name].class.spec.ts
- [name].api.spec.ts

Steps:
1. [deprecation]
2. [data handling]
3. [removal sequence]

Proceed with deletion? (Y/N)
```

Example:
```markdown
DELETE_DCA: SocialLogin
SCALE: 10K

PURPOSE:
Remove unused social login feature

DEPENDENCIES:
- @class:User
- @api:Auth

DATA:
- Export social connections
- Remove OAuth configs
``` 