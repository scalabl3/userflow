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

### 3. Todo Layer (Bridge)
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

### 4. Task Layer (Micro)
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

Tactical → Todo:
- Implementation guidelines
- Verification requirements
- Quality gates

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
   - Consider New Composer

   STRATEGIC → TACTICAL:
   - After pattern documentation
   - Before implementation planning
   - Consider New Composer

   TACTICAL → IMPLEMENTATION:
   - Before code generation
   - After major refactoring
   - Consider New Composer

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

### Directory Structure
```markdown
project-root/
├── 01-meta/                      # Process & templates
│   ├── 01-templates/            # All templates
│   │   ├── process/
│   │   │   ├── vision-development.v1.template.md
│   │   │   ├── user-story-development.v1.template.md
│   │   │   ├── product-development.v1.template.md
│   │   │   ├── strategic-planning.v1.template.md
│   │   │   └── tactical-planning.v1.template.md
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

5. **Tasks**
   - Format: TASK-[TI-REF]-[NUMBER]
   - Example: TASK-AUTH001001-001

6. **Class Specifications**
   - Format: [Domain].[ClassName].spec.md
   - Example: auth.UserManager.spec.md

7. **Class Hierarchies**
   - Format: [Domain]-classes.md
   - Example: auth-classes.md

### Document Locations

1. **Product Documents**
   - Vision Documents: 02-implementation-docs/product/vision/[VISION-ID].md
   - User Stories: 02-implementation-docs/product/stories/[STORY-ID].md
   - Feature Specs: 02-implementation-docs/product/features/[FEATURE-ID].md

2. **Process Documents**
   - Strategic Process: 01-meta/02-process/strategic/strategic-process.v1.md
   - Tactical Process: 01-meta/02-process/tactical/tactical-process.v1.md

3. **Active Documents**
   - Strategic Plans: 02-implementation-docs/strategic/[SI-ID]/strategic-plan.md
   - Tactical Plans: 02-implementation-docs/tactical/[TI-ID]/tactical-plan.md
   - Class Specs: 02-implementation-docs/class-specs/[domain]/[ClassName].spec.md
   - Tasks: 02-implementation-docs/tasks/[SI-REF]/TASK-[ID].md

### Template Usage

1. **Product Development**
   - Vision Development: vision-development.v1.template.md
   - User Story Development: user-story-development.v1.template.md
   - Product Development: product-development.v1.template.md
   - Location: 01-meta/01-templates/process/

2. **Strategic Planning**
   - Use: strategic-planning.v1.template.md
   - Location: 01-meta/01-templates/process/

3. **Tactical Planning**
   - Use: tactical-planning.v1.template.md
   - Location: 01-meta/01-templates/process/

4. **Class Specifications**
   - Use: class-functional-spec.v1.template.md
   - Location: 01-meta/01-templates/class/
``` 