# Complex Organization DCA Examples

## Create Organization Component
```markdown
CREATE_DCA: Organization
SCALE: 10K

PURPOSE:
Manage multi-team organizations with hierarchical permissions

REQUIREMENTS:
- Team management
- Member roles
- Resource sharing

SECURITY:
- Role-based access
- Resource isolation
- Audit logging

DEPENDENCIES:
- @model:User
- @class:RBAC
- @api:Auth
```

## Add Team Hierarchy
```markdown
MODIFY_DCA: Organization
SCALE: 10K
OPERATION: ADD team hierarchy

PURPOSE:
Enable nested team structures with inherited permissions

CHANGES:
- Add parent/child relationships
- Add permission inheritance
- Update member resolution

DEPENDENCIES:
- @class:RBAC
- @class:TeamResolver
- @api:Permission
```

## Remove Organization
```markdown
DELETE_DCA: Organization
SCALE: 10K

PURPOSE:
Deprecate organization feature for single-user focus

DEPENDENCIES:
- @model:User
- @model:Team
- @class:RBAC
- @api:Permission

DATA:
- Export org structures
- Archive team data
- Migrate user roles
``` 