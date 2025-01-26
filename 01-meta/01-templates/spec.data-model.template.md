# Data Model Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/[name].data-model.spec.md`

## Model Name: [PascalCase]

## Related Specifications
- APIs: [@api:Name]
- Classes: [@class:Name]

## Properties

### Required Properties
- [name]: [type]
  - Purpose: [brief description]
  - Constraints: [if any]

### Optional Properties  
- [name]: [type]
  - Purpose: [brief description]
  - Default: [if any]

## Relationships
- [Type]: [@model:Name]
  - Nature: [one-to-one/many]
  - Purpose: [brief description]

## Core Validation
- [rule description]
  - Applies to: [fields]
  - Logic: [brief description]

## DTOs

### CreateDTO
```typescript
{
  [field]: [type]  // required fields
}
```

### UpdateDTO
```typescript
{
  [field]?: [type]  // optional fields
}
```

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for [X]K user site scale.
Complex features noted as future extensions. 