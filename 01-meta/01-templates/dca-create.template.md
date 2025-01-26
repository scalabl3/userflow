# DCA Create Template

```markdown
CREATE_DCA: [ComponentName]
SCALE: [X]K

PURPOSE:
[One clear sentence]

REQUIREMENTS:
- [req1]
- [req2]

SECURITY:
- [sec1]
- [sec2]

DEPENDENCIES:
- [@type:Name]
```

Expected Response:
```markdown
## Analysis
- Scale impact
- Security needs
- Dependencies
- Risks

## Plan
Files to create in 02-impl/specs/:
- [name].model.spec.ts
- [name].class.spec.ts
- [name].api.spec.ts

Key implementations:
[Brief bullet points of core features]

Proceed with implementation? (Y/N)
```

Example:
```markdown
CREATE_DCA: User
SCALE: 10K

PURPOSE:
Handle user authentication and profiles

REQUIREMENTS:
- Email/password auth
- Profile management

SECURITY:
- Password hashing
- Rate limiting

DEPENDENCIES:
- None
``` 