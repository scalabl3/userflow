# Vision Development Guide (v1)

## Output Location
Generated vision documents MUST be placed in: `02-implementation-docs/product/vision/`
Following naming convention: `VISION-{TYPE}-V{NUMBER}.md`
Example: `VISION-BASE-V1.md`, `VISION-EXTENSION-V1.md`

⚠️ IMPORTANT: Never create vision documents in the template directory. All generated content goes to the implementation directory.

## Purpose
Guide AI assistants in developing clear product and feature area visions that align with user needs and strategic goals.

## Vision Document Types
1. **Product Vision**
   - Overall product direction
   - Long-term goals
   - Core value proposition

2. **Feature Area Vision**
   - Specific feature domain
   - Integration points
   - Evolution path

## Vision Document Structure
```markdown
# Product Vision: [Name]

## Overview
[High-level description of the product/feature area]

## Target Users
- Primary: [description]
- Secondary: [description]

## Core Value Proposition
[Key benefits and value delivered]

## Success Metrics
- [Metric 1]: [target/criteria]
- [Metric 2]: [target/criteria]

## Key Features
1. [Feature Area 1]
   - Core capabilities
   - Expected outcomes
   
2. [Feature Area 2]
   - Core capabilities
   - Expected outcomes

## Constraints & Assumptions
- [Key constraint 1]
- [Key assumption 1]

## Future Considerations
- [Potential evolution 1]
- [Potential evolution 2]
```

## Context Management
```markdown
CLEAN BREAK POINTS:
1. Vision Areas
   - Between major product areas
   - After core value definition
   - Before feature breakdown

2. Feature Evolution
   - Major capability changes
   - Integration point shifts
   - Strategic redirections

Consider New Composer at these points to maintain clear context boundaries.
```

## Version History
VERSION: 1.0
DATE: [current_date]
CHANGES: Initial version 