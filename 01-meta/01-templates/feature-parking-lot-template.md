# Feature Parking Lot Template

## Purpose
Systematically capture and track potential features and improvements without disrupting the current development process or creating implementation artifacts.

## Success Criteria
- Each feature is documented without impacting current tasks
- Ideas are captured with sufficient context for future evaluation
- No implementation details or artifacts are created
- Clear separation between current work and future possibilities

## Failure Criteria
- Creating implementation artifacts for parked features
- Mixing future features with current requirements
- Losing focus on current tasks
- Incomplete or ambiguous feature descriptions

## Feature Catalog

### Quick Capture
```markdown
🔒 ##### Model Reference:
QUICK_FEATURE:
- Name: [feature name]
- Source: [where idea came from]
- Value: [potential benefit]
- Category: [ENHANCEMENT/NEW_FEATURE/OPTIMIZATION]
🔒 End Model
```

### Detailed Analysis
```markdown
🔒 ##### Model Reference:
FEATURE_ANALYSIS:
- Name: [feature name]
- Category: [type]
- Business Value:
  - Primary: [main benefit]
  - Secondary: [other benefits]
- Dependencies: [related systems/features]
- Complexity: [HIGH/MEDIUM/LOW]
- Integration Points: [affected systems]
🔒 End Model
```

### Strategic Grouping
```markdown
🔒 ##### Model Reference:
FEATURE_GROUP:
Category: [category name]
Description: [category purpose]
Features:
1. [feature name]
   - Value: [benefit]
   - Dependencies: [list]
2. [feature name]
   - Value: [benefit]
   - Dependencies: [list]
🔒 End Model
```

## Usage Guidelines
1. Capture ideas immediately without disrupting current work
2. Document sufficient context for future understanding
3. Group related features when patterns emerge
4. Avoid implementation details
5. Focus on business value and dependencies
6. Keep descriptions clear and concise

## Feature Log
```markdown
DATE: [date]
CONTEXT: [current work context]

NEW_FEATURES:
1. [feature name]
   - Trigger: [what prompted the idea]
   - Value: [potential benefit]
   - Category: [type]
   - Notes: [relevant context]

PATTERN_GROUPS:
- [category]:
  - [feature 1]
  - [feature 2]
```

## Version History
```markdown
VERSION: 1.0
DATE: [current_date]
AUTHOR: Claude
CHANGES:
1. Initial template creation
2. Structured feature capture process
3. Added categorization system
``` 