# Simple User DCA Examples

## Create User Component
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

## Add Password Reset
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

## Remove Social Login
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