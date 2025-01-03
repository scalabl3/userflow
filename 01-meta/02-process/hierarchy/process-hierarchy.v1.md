# Process Hierarchy Overview (v1)

## Purpose
This document defines the hierarchical relationship between different process layers, establishing clear responsibilities and information flow between levels.

## Process Layer Architecture

### 0. Product Layer (Foundation)
**Purpose**: User need understanding and vision development
**Sources**: 
- 01-meta/01-templates/process/vision-development.v1.template.md
- 01-meta/01-templates/process/user-story-development.v1.template.md
- 01-meta/01-templates/process/product-development.v1.template.md

```markdown
Key Responsibilities:
├── Vision Development
│   ├── Product direction
│   ├── Feature area evolution
│   └── Success metrics
├── User Story Creation
│   ├── Need identification
│   ├── Acceptance criteria
│   └── Feature mapping
└── Implementation Bridge
    ├── Feature analysis
    ├── Class discovery
    └── Solution design

Outputs:
- Product vision documents
- User story collections
- Feature specifications
- Implementation guidance
```

### 1. Strategic Layer (Macro)
**Purpose**: Pattern recognition and strategic decision making
**Source**: 01-meta/02-process/strategic/strategic-process.v1.md

```markdown
Key Responsibilities:
├── Pattern Recognition & Analysis
│   ├── Identify system-wide patterns
│   └── Map impact areas
├── Strategic Planning
│   ├── Define prevention mechanisms
│   └── Set success metrics
└── Knowledge Management
    ├── Document patterns
    └── Create solution templates

Outputs:
- Pattern documentation
- Strategic responses
- Prevention mechanisms
- Success metrics
```

### 2. Tactical Layer (Meso)
**Purpose**: Implementation planning and pattern enforcement
**Source**: 01-meta/02-process/tactical/tactical-process.v1.md

```markdown
Key Responsibilities:
├── Implementation Planning
│   ├── Pattern-based task organization
│   └── Dependency mapping
├── Execution Framework
│   ├── Verification checkpoints
│   └── Progress tracking
└── Quality Gates
    ├── Pre-implementation verification
    └── Post-implementation review

Outputs:
- Implementation plans
- Verification points
- Quality gates
- Progress metrics
```

### 3. Design Layer (Bridge)
**Purpose**: Bridge between tactical decisions and implementation by defining class structures and specifications
**Source**: 01-meta/02-process/design/design-process.v1.md

```markdown
Key Responsibilities:
├── Scale Understanding
│   ├── Requirements assessment
│   ├── Platform capabilities
│   └── Growth planning
├── Architecture Design
│   ├── Class hierarchies
│   ├── Interface contracts
│   └── Design patterns
└── Implementation Bridge
    ├── Component specifications
    ├── Integration points
    └── Todo structure

Outputs:
- Design specifications
- Class hierarchies
- Interface contracts
- Implementation guides
```

### 4. Todo Layer (Implementation Bridge)
**Purpose**: Bridge between strategy and implementation
**Source**: 01-meta/01-templates/task/todo-breakdown.v1.template.md

```markdown
Key Responsibilities:
├── Strategic Context Maintenance
│   ├── Link to patterns
│   └── Track outcomes
├── Work Organization
│   ├── Todo grouping
│   └── Priority management
└── Task Generation
    ├── Scope definition
    └── Dependency tracking

Outputs:
- Organized todo groups
- Task specifications
- Progress tracking
- Health metrics
```

### 5. Task Layer (Micro)
**Purpose**: Specific implementation details and verification
**Source**: 01-meta/01-templates/task/code-generation-task.v1.template.md

```markdown
Key Responsibilities:
├── Implementation Details
│   ├── Atomic changes
│   └── Test coverage
├── Verification Steps
│   ├── Pattern compliance
│   └── Solution validation
└── Documentation
    ├── Knowledge capture
    └── Pattern updates

Outputs:
- Verified changes
- Test coverage
- Documentation updates
- Pattern feedback
```

## Information Flow

```markdown
Product Layer
↓ Provides user needs, vision, and success criteria
Strategic Layer
↓ Provides patterns, metrics, and guidelines
Tactical Layer
↓ Provides implementation framework and verification
Design Layer
↓ Provides class structures and implementation guidance
Todo Layer
↓ Provides organized work items and context
Task Layer
↑ Provides feedback and pattern validation
```

## Cross-Layer Integration

### 1. Pattern Flow
```markdown
Product → Strategic:
- User needs
- Vision alignment
- Feature requirements

Strategic → Tactical:
- Pattern definitions
- Success metrics
- Prevention mechanisms

Tactical → Design:
- Implementation plans
- Pattern requirements
- Quality criteria
- Scale context

Design → Todo:
- Class structures
- Interface contracts
- Component specs
- Integration guides

Design → Tactical:
- Architecture validation
- Pattern applications
- Scale alignment

Todo → Task:
- Specific requirements
- Context maintenance
- Progress tracking

Task → Strategic:
- Pattern effectiveness
- Implementation feedback
- Knowledge updates
```

### 2. Quality Controls

```markdown
Each Layer Verifies:
├── Strategic
│   └── Pattern effectiveness
├── Tactical
│   └── Implementation alignment
├── Design
│   ├── Scale appropriateness
│   ├── Pattern application
│   └── Architecture cohesion
├── Todo
│   └── Work organization
└── Task
    └── Specific changes
```

### 3. Context Transition Points
```markdown
1. Layer Transitions
   PRODUCT → STRATEGIC:
   - After vision completion
   - Before pattern analysis

   STRATEGIC → TACTICAL:
   - After pattern documentation
   - Before implementation planning

   TACTICAL → DESIGN:
   - After implementation planning
   - Before class specification

   DESIGN → TODO:
   - After class specifications
   - Before task breakdown

2. Clean Break Points
   - Feature area switches
   - Major version updates
   - Complex refactoring starts
   - Pattern implementation shifts
```

## Usage Guidelines

1. **Top-Down Planning**
   - Start with strategic patterns
   - Flow through tactical planning
   - Create design specifications
   - Break into todos
   - Generate specific tasks

2. **Bottom-Up Feedback**
   - Task implementation feedback
   - Todo progress tracking
   - Tactical pattern validation
   - Strategic pattern updates

3. **Cross-Layer Verification**
   - Pattern consistency
   - Implementation alignment
   - Progress tracking
   - Knowledge capture

## Version History
```markdown
VERSION: 1.1
DATE: [current_date]
AUTHOR: Claude
CHANGES:
- Added Product Layer as foundation
- Updated information flow to start from Product Layer
- Added product-related templates and locations
- Added naming conventions for vision and story documents
```

## File Organization & Nomenclature

### Workflow Meta Directory Structure
```markdown
project-root/
├── 01-meta/                      # Process & templates
│   ├── 01-templates/            # All templates
│   │   ├── process/
│   │   │   ├── vision-development.v1.template.md
│   │   │   ├── user-story-development.v1.template.md
│   │   │   ├── product-development.v1.template.md
│   │   │   ├── strategic-planning.v1.template.md
│   │   │   ├── tactical-planning.v1.template.md
│   │   │   └── design-planning.v1.template.md
│   │   └── task/
│   │       ├── code-generation-task.v1.template.md
│   │       └── todo-breakdown.v1.template.md
```

### Naming Conventions

1. **Product Vision Documents**
   - Format: VISION-[AREA]-[VERSION]
   - Example: VISION-AUTH-V1

2. **User Stories**
   - Format: STORY-[AREA]-[NUMBER]
   - Example: STORY-AUTH-001

3. **Strategic Initiatives**
   - Format: SI-[AREA]-[NUMBER]
   - Example: SI-AUTH-001

4. **Tactical Initiatives**
   - Format: TI-[SI-REF]-[NUMBER]
   - Example: TI-AUTH001-001

5. **Design Documents**
   - Format: DESIGN-[AREA]-[NUMBER]
   - Example: DESIGN-AUTH-001

6. **Class Specifications**
   - Format: [Domain].[ClassName].spec.md
   - Example: auth.UserManager.spec.md

7. **Class Hierarchies**
   - Format: [Domain]-hierarchy.md
   - Example: auth-hierarchy.md

8. **Tasks**
   - Format: TASK-[TI-REF]-[NUMBER]
   - Example: TASK-AUTH001001-001

### Document Locations

1. **Product Documents**
   - Vision Documents: 02-implementation-docs/product/vision/[VISION-ID].md
   - User Stories: 02-implementation-docs/product/stories/[STORY-ID].md
   - Feature Specs: 02-implementation-docs/product/features/[FEATURE-ID].md

2. **Process Documents**
   - Strategic Process: 01-meta/02-process/strategic/strategic-process.v1.md
   - Tactical Process: 01-meta/02-process/tactical/tactical-process.v1.md
   - Design Process: 01-meta/02-process/design/design-process.v1.md

3. **Design Documents**
   - Design Docs: 02-implementation-docs/design/[DESIGN-ID]/design-doc.md
   - Class Specs: 02-implementation-docs/design/[DESIGN-ID]/specs/classes/[ClassName].spec.md
   - Class Hierarchies: 02-implementation-docs/design/[DESIGN-ID]/specs/hierarchy/[Domain]-hierarchy.md

4. **Active Documents**
   - Strategic Plans: 02-implementation-docs/strategic/[SI-ID]/strategic-plan.md
   - Tactical Plans: 02-implementation-docs/tactical/[TI-ID]/tactical-plan.md
   - Tasks: 02-implementation-docs/tasks/[SI-REF]/TASK-[ID].md
``` 