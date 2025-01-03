# Design Process (v1)

## Template Reference
Use template at: `01-meta/01-templates/process/design-planning.v1.template.md` for creating design documents.

## File Nomenclature
- Design Document: DESIGN-[AREA]-[NUMBER]
- Design Location: 02-implementation-docs/design/[DESIGN-ID]/design-doc.md
- Design Specs: 02-implementation-docs/design/[DESIGN-ID]/specs/
- Class Specs: 02-implementation-docs/design/[DESIGN-ID]/specs/classes/

## Purpose
Bridge tactical planning with implementation by providing clear, right-sized design specifications that guide todo creation and task implementation.

## Core Responsibilities

### 1. Scale Assessment
- Clarify user base size and growth expectations
- Define concurrent user requirements
- Identify performance needs
- Document scaling assumptions

### 2. Architecture Right-Sizing
- Evaluate platform capabilities first
- Choose appropriate service levels
- Prevent over-engineering
- Plan for reasonable growth

### 3. Design Specification
- Create class specifications
- Define interfaces
- Document relationships
- Specify behaviors

### 4. Implementation Guidance
- Bridge to todo breakdown
- Guide task creation
- Maintain design consistency
- Ensure pattern compliance

## Process Workflows

### 1. Scale Analysis Process
```markdown
1. Requirement Gathering (ALWAYS ASK USER)
   - "What is your expected total user base?"
   - "What percentage will be concurrent users?"
   - "What is your growth timeline?"
   - "Any specific performance requirements?"

2. Platform Assessment (VERIFY WITH USER)
   - "Which platform services are you using?"
   - "Are there specific platform features you want to leverage?"
   - "Any platform constraints to be aware of?"
   - "Any required integration points?"

3. Design Scoping (CONFIRM WITH USER)
   - "Are these the correct boundaries?"
   - "Are these constraints accurate?"
   - "Do these assumptions match your expectations?"
   - "Is this evolution path aligned with your plans?"
```

### 2. Design Process
```markdown
1. Architecture Planning
   - Review tactical plan
   - Identify components
   - Map relationships
   - Define interfaces

2. Component Design
   - Specify classes
   - Define behaviors
   - Document APIs
   - Set boundaries

3. Implementation Planning
   - Create todo structure
   - Define tasks
   - Set checkpoints
   - Plan verification
```

### 3. Right-Sizing Process
```markdown
1. Service Evaluation
   - Check platform services
   - Assess built-in features
   - Review managed options
   - Identify gaps

2. Build vs Use Decision
   - Standard functionality → Use platform
   - Custom needs → Build minimal
   - Future needs → Document path
   - Complex features → Validate need

3. Complexity Management
   - Start simple
   - Plan iterations
   - Document decisions
   - Track assumptions
```

## Design Gates

### 1. Scale Gate
```markdown
[ ] User scale documented
[ ] Growth expectations clear
[ ] Performance needs defined
[ ] Platform capabilities assessed
```

### 2. Architecture Gate
```markdown
[ ] Components identified
[ ] Relationships mapped
[ ] Interfaces defined
[ ] Evolution path clear
```

### 3. Implementation Gate
```markdown
[ ] Specifications complete
[ ] Tasks identified
[ ] Verification points set
[ ] Documentation ready
```

## Integration Points

### 1. From Tactical Layer
- Receive implementation plans
- Get pattern requirements
- Understand context
- Get success metrics

### 2. To Todo Layer
- Provide specifications
- Set implementation guidance
- Define task structure
- Maintain context

## Right-Sizing Guidelines

### 1. Use Platform Services When
```markdown
- Standard functionality needed
- Platform handles scaling
- Maintenance handled externally
- Industry standard solutions exist
```

### 2. Build Custom When
```markdown
- Unique business requirements
- Special integration needs
- Platform limitations
- Strategic differentiation needed
```

### 3. Complexity Checklist
```markdown
Before adding complexity, ASK:
[ ] "Is this needed for your current scale?"
[ ] "What user numbers would justify this?"
[ ] "Can we simplify this for your needs?"
[ ] "Should we defer this optimization?"
```

## Version History
```markdown
VERSION: 1.0
DATE: 2024-01-07
AUTHOR: C3C
CHANGES:
- Initial design process definition
- Added right-sizing guidelines
- Defined scale assessment process
- Created integration points
``` 