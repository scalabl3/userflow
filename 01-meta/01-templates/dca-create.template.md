# DCA Create Template

```markdown
CREATE_DCA: [ComponentName]
SCALE: [X]K

CORE_FUNCTIONALITY:
[One sentence describing the essential function]

MUST_HAVE:
- [core_requirement]
- [core_requirement]

EXPLICITLY_NOT_INCLUDED:
- Authentication/roles (unless specified)
- Rate limiting
- Audit logging
- Moderation features
```

Expected Response:
```markdown
## Verification
Scale: Confirm within [X]K limit
Dependencies: List only existing components needed
Constraints: Confirm features NOT included

## Plan
Files to create in 02-impl/specs/:
- [name].model.spec.md: Core data structure
- [name].class.spec.md: Essential behavior
- [name].api.spec.md: Basic CRUD endpoints

## Template Reference
Each spec should follow these templates:
- data-model.template.md: 01-meta/01-templates/data-model.template.md
- class-spec.template.md: 01-meta/01-templates/class-spec.template.md
- api-spec.template.md: 01-meta/01-templates/api-spec.template.md

Note: All specs use simple list formats instead of tables for better readability. For example:
- Properties: name (type) - required, unique, default: description
- Methods: name (args) - returns: description
- Endpoints: method path - purpose: description

Proceed with implementation? (Y/N)
```

Example:
```markdown
CREATE_DCA: Comment
SCALE: 10K

CORE_FUNCTIONALITY:
Allow users to add text comments to content

MUST_HAVE:
- Create/read comment
- Edit own comment
- Delete own comment

EXPLICITLY_NOT_INCLUDED:
- Authentication/roles
- Rate limiting
- Moderation features
- Reporting system
``` 