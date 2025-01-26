# Data Model Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/[name].model.spec.ts`

## Model Name: [PascalCase]

## Related Specifications
- Class: @class:[Name]
- API: @api:[Names]
- Related Models: [@model:RelatedModel1, @model:RelatedModel2]

## Properties
Properties listed as: name (type) - required, unique, default: description
- id (UUID) - required, unique, default=uuid(): Primary key
- [propertyName] ([type]) - required=[Y/N], unique=[Y/N], default=[value]: [description]

## Relationships
Relationships listed as: Model (type, through) - description - constraints
- @model:Model ([hasOne/hasMany/belongsTo], [@model:Junction]) - [description] - [limits/rules]

## Indexes
Indexes listed as: name (fields, type) - description
- [name]_idx ([fields], [type]) - [description]

## Validation Rules
Rules listed as: field - rule: message
- [field] - [rule]: [message]

## DTOs
### CreateDTO
Fields listed as: field (type) - required: description
- [field] ([type]) - required=[Y/N]: [description]

### UpdateDTO
Fields listed as: field (type) - required: description
- [field] ([type]) - required=[Y/N]: [description]

## Constraints
- Data limits
- Business rules
- Cascade behaviors

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for [X]K user site scale.
Complex features noted as future extensions. 