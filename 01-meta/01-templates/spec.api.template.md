# API Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/[name].api.spec.md`

## API Group: [PascalCase]

## Related Specifications
- Models: [@model:Name]
- Classes: [@class:Name]

## Base Path
`/api/v1/[resource]`

## Core Endpoints

### POST /
- Purpose: Create [resource]
- Request: content fields needed for creation
```typescript
{
  [field]: [type]  // core fields only
}
```
- Response: created resource
- Errors: invalid input (400), not found (404)

### GET /:id
- Purpose: Retrieve [resource]
- Response: resource data
- Errors: not found (404)

### PUT /:id
- Purpose: Update [resource]
- Request: fields that can be updated
```typescript
{
  [field]: [type]  // updatable fields only
}
```
- Response: updated resource
- Errors: invalid input (400), not found (404)

### DELETE /:id
- Purpose: Remove [resource]
- Response: success confirmation
- Errors: not found (404)

## Error Handling
Basic errors listed as: error (code)
- Invalid input (400)
- Not found (404)
- Server error (500)

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: API follows generation rules for [X]K user site scale.
Complex features noted as future extensions. 