# Data Model Specification Template

## Output Location
Generated file should be placed in: `02-impl/specs/[name].model.spec.ts`

## Model Name: [PascalCase]

## Related Specifications
- Class: @class:[Name]
- API: @api:[Names]
- Related Models: [@model:RelatedModel1, @model:RelatedModel2]

## Properties
| Name | Type | Required | Unique | Default | Description |
|------|------|----------|---------|---------|-------------|
| id   | UUID | Yes      | Yes     | uuid()  | Primary key |
| [propertyName] | [type] | [Y/N] | [Y/N] | [value] | [description] |

## Relationships
| Model | Type | Through | Description | Constraints |
|-------|------|---------|-------------|-------------|
| @model:Model | [hasOne/hasMany/belongsTo] | [@model:Junction] | [description] | [limits/rules] |

## Indexes
| Name | Fields | Type | Description |
|------|--------|------|-------------|
| [name]_idx | [fields] | [type] | [description] |

## Validation Rules
| Field | Rule | Message |
|-------|------|---------|
| [field] | [rule] | [message] |

## DTOs
### CreateDTO
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| [field] | [type] | [Y/N] | [description] |

### UpdateDTO
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| [field] | [type] | [Y/N] | [description] |

## Constraints
- Data limits
- Business rules
- Cascade behaviors

# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================

Note: Model follows generation rules for [X]K user site scale.
Complex features noted as future extensions. 