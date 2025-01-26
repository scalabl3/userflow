# Generation Rules Template

## Output Location
This template generates: `02-impl/config/generation-rules.ts`

## Site Scale
- Maximum Users: [number]
- User Type: [personal/small business/enterprise]
- Deployment: [single instance/multi-tenant]

## Feature Boundaries
- Authentication:
  - Methods: [email, oauth providers]
  - Security: [2FA types, password rules]
  - Session: [duration, refresh policy]
- Data Storage:
  - User Data: [limits per user]
  - Organization Data: [limits per org]
  - File Storage: [types, sizes]
- API Limits:
  - Rate: [requests/timeframe]
  - Payload: [max size]
  - Batch: [max items]

## Implementation Constraints
- Stack:
  - Frontend: [framework, versions]
  - Backend: [framework, versions]
  - Database: [type, version]
- Performance:
  - Response Times: [p95 targets]
  - Load Times: [target metrics]
  - Concurrent Users: [max number]
- Security:
  - Authentication: [requirements]
  - Authorization: [model]
  - Data Protection: [standards]

## Naming Conventions
- Models: PascalCase (User, Organization)
- DTOs: PascalCase + DTO (CreateUserDTO)
- APIs: Plural (Users, Organizations)
- Methods: camelCase (createUser)
- Properties: camelCase (firstName)

## Cross-Reference Rules
- All references must use @model:, @class:, @api: format
- Bidirectional references required
- Type consistency enforced
- No introducing new properties in references

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: These rules define implementation boundaries for a site under [X]K users.
Complex features should be noted as future extensions. 