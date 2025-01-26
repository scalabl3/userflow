# API Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/[name].api.spec.md`

## API Group: [PascalCase]

## Related Specifications
- Models: [@model:Name1, @model:Name2]
- Classes: [@class:Name1, @class:Name2]
- Dependencies: [@api:Dependency1, @api:Dependency2]

## Base Path
`/api/v1/[resource]`

## Authentication
- Required: [Y/N]
- Type: [Bearer Token/API Key/None]
- Roles: [roles that can access these endpoints]

## Rate Limiting
- Max Requests: [number]/[timeframe]
- Burst: [number]
- Recovery: [time]

## Endpoints

### [HTTP Method] [path]
- Purpose: [clear description]
- Auth Required: [Y/N]
- Roles: [allowed roles]

#### Request
```typescript
interface Request {
  params: {
    [param: string]: [type]
  }
  query: {
    [param: string]: [type]
  }
  body: {
    [field: string]: [type]
  }
}
```

#### Response
```typescript
interface Response {
  [field: string]: [type]
}
```

#### Status Codes
Status codes listed as: code - condition
- [code] - [when returned]

#### Error Responses
Errors listed as: code (error) - condition
- [code] ([error]) - [when occurs]

#### Behavior
1. Validation steps
2. Processing steps
3. Response formation
4. Side effects

#### Dependencies
- Required services
- External calls
- State changes

## Error Handling
Scenarios listed as: scenario - action - response
- [scenario] - [action] - [response]

## Implementation Constraints
- Performance requirements
- Caching rules
- Security requirements
- Input validation
- Response formatting

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: API follows generation rules for [X]K user site scale.
Complex features noted as future extensions. 