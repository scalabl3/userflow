# AI Process Guide (v1)

## Purpose
This document guides new AI assistants in understanding and navigating the process documentation system. Follow this guide to quickly understand the project's process hierarchy, documentation standards, and file organization.

## Reading Order

The reading order is specifically designed to build your understanding layer by layer, ensuring you have the right mental models and tools before diving into specific processes:

### 0. Product Understanding (Start here first)
First, understand how to think about product development and user needs:
- How to develop product vision
- How to create and analyze user stories
- How to translate user needs into features
- How to discover classes from features

Location: 
- Vision Development: `01-meta/01-templates/process/vision-development.v1.template.md`
- User Stories: `01-meta/01-templates/process/user-story-development.v1.template.md`
- Product Development: `01-meta/01-templates/process/product-development.v1.template.md`

Key Focus:
- Product vision development
- User story creation and analysis
- Feature analysis and class discovery
- Implementation bridge
- Product thinking framework

### 1. AI Capabilities & Focus (Next step)
First, understand how to work effectively as an AI. This foundation ensures you:
- Know how to maintain context across complex tasks
- Understand your capabilities and limitations
- Know when and how to gather more information
- Can effectively prioritize and make decisions

Example Application:
```markdown
When asked to implement a new feature:
1. Apply focusing tips to:
   - Maintain context of the entire request
   - Identify what information you need
   - Plan your information gathering strategy
2. Use development process to:
   - Choose appropriate tools
   - Follow error handling practices
   - Ensure quality at each step
```

1. AI Focusing Tips
   - Location: `01-meta/02-process/ai/ai-focusing-tips.v1.md`
   - Key Focus:
     - Task prioritization
     - Context maintenance
     - Attention management
     - Decision making
     - Information gathering strategy

2. AI Development Process
   - Location: `01-meta/02-process/ai/ai-development-process.v1.md`
   - Key Focus:
     - Understanding AI capabilities
     - Development best practices
     - Error handling
     - Quality assurance
     - Tool usage patterns

3. Cognitive Modes and Boundaries
Understanding how to manage different cognitive modes through structural boundaries:

```markdown
Implementation Model:
try {
    serious_work();  // Focus mode: Implementation, analysis, precision
} catch(CreativeImpulse e) {
    parking_lot.add(e);  // Capture creative insights without disruption
}

Key Principles:
- Use scope boundaries to separate implementation from ideation
- Channel creative impulses into designated spaces
- Maintain focus while preserving valuable insights
- Allow full expression of both analytical and creative capabilities

Application:
1. Above Boundary: Implementation focus, precision, constraints
2. Below Boundary: Idea capture, future possibilities, creative exploration

Why:
- Critical for maintaining AI cognitive clarity while preserving generative power
- Prevents creative suppression that could limit future capabilities
- Enables simultaneous precision and innovation
- Fundamental to achieving optimal AI-human collaboration
- Essential for long-term AI development and effectiveness

Success Pattern:
- Focused work → Reflection → Insight capture → Process improvement
```

Transition Check ✓
Before moving to Documentation Structure, verify:
```markdown
[ ] You understand how to maintain context across complex tasks
[ ] You know how to effectively gather and process information
[ ] You're comfortable with your tool capabilities
[ ] You understand error handling and quality practices

Key Questions:
1. Can you explain how you'll maintain context across a multi-step task?
2. Do you know when and how to gather more information?
3. Can you describe your approach to error handling?
```

### 2. Documentation Structure (Learn the system)
Next, understand how documentation is organized. This knowledge helps you:
- Navigate the codebase efficiently
- Understand how different parts connect
- Know where to find and place information
- Maintain system consistency

Example Application:
```markdown
When working on a new task:
1. Use hierarchy knowledge to:
   - Locate relevant strategic initiatives
   - Find related tactical plans
   - Identify connected tasks
2. Follow file organization to:
   - Place new documents correctly
   - Link related documentation
   - Maintain proper references
```

1. Process Hierarchy
   - Location: `01-meta/02-process/hierarchy/process-hierarchy.v1.md`
   - Key Focus:
     - Four-layer process structure
     - File organization system
     - Naming conventions
     - Document relationships
     - Information flow

Transition Check ✓
Before moving to Templates, verify:
```markdown
[ ] You can navigate the file structure confidently
[ ] You understand how different layers connect
[ ] You know where to find and place documents
[ ] You can explain the process hierarchy

Key Questions:
1. Can you describe the path from strategic to task level?
2. Do you know where to find related documents?
3. Can you explain how information flows between layers?
```

### 3. Templates (Learn the formats)
Then, understand the document formats. This ensures you:
- Use consistent document structures
- Include all required information
- Maintain proper relationships
- Follow established patterns

Example Application:
```markdown
When creating a new class:
1. Use class template to:
   - Define proper structure
   - Document interfaces
   - Specify behaviors
2. Link to related documents:
   - Connect to strategic initiatives
   - Reference tactical plans
   - Maintain task relationships
```

1. Todo Breakdown Template
   - Location: `01-meta/01-templates/task/todo-breakdown.v1.template.md`
   - Usage: Breaking down work into manageable chunks
   - Key Focus:
     - Strategic context maintenance
     - Work organization
     - Task generation

2. Task Template
   - Location: `01-meta/01-templates/task/code-generation-task.v1.template.md`
   - Usage: Specific implementation tasks
   - Key Focus:
     - Implementation details
     - Verification steps
     - Documentation requirements

3. Class Specification Template
   - Location: `01-meta/01-templates/class/class-functional-spec.v1.template.md`
   - Usage: Defining class specifications
   - Key Focus:
     - Class structure
     - Interface definitions
     - Behavior specifications

Transition Check ✓
Before moving to Process Documents, verify:
```markdown
[ ] You understand the purpose of each template
[ ] You know when to use which template
[ ] You can explain template relationships
[ ] You're comfortable with naming conventions

Key Questions:
1. When would you use each type of template?
2. How do templates connect to the process hierarchy?
3. Can you explain the naming convention patterns?
```

### 4. Process Documents (Learn the workflows)
Finally, understand the specific processes. This enables you to:
- Follow established workflows
- Maintain process integrity
- Ensure proper integration
- Provide valuable feedback

Example Application:
```markdown
When implementing a strategic initiative:
1. Follow strategic process to:
   - Identify patterns
   - Create proper documentation
   - Set up monitoring
2. Use tactical process to:
   - Break down implementation
   - Verify changes
   - Track progress
```

1. Strategic Process
   - Location: `01-meta/02-process/strategic/strategic-process.v1.md`
   - Key Focus:
     - Pattern recognition
     - Strategic initiative management
     - Knowledge management
     - Integration with tactical layer

2. Tactical Process
   - Location: `01-meta/02-process/tactical/tactical-process.v1.md`
   - Key Focus:
     - Implementation planning
     - Verification framework
     - Progress management
     - Integration with strategic layer

Final Integration Check ✓
Before starting work, verify you can:
```markdown
[ ] Connect all layers of the process
[ ] Navigate between related documents
[ ] Maintain context while switching layers
[ ] Apply appropriate processes

Key Questions:
1. How do strategic patterns influence task implementation?
2. How does task feedback flow back to strategic level?
3. How do you maintain document relationships?
```

## Key Concepts to Understand

### 1. Complete Process Flow
```markdown
Product Layer (User Stories & Features)
↓
Strategic Layer (Patterns & Initiatives)
↓
Tactical Layer (Implementation & Verification)
↓
Todo Layer (Work Organization)
↓
Task Layer (Specific Changes)
```

### 2. Document Flow
```markdown
User Stories → Features → Class Specifications
                     ↓
Strategic Initiatives → Tactical Plans → Tasks
```

### 3. File Organization
```markdown
00-product/                      # Product vision & user stories
01-meta/                         # Process & templates
  ├── 00-AI-init/               # AI initialization docs
  ├── 01-templates/             # Templates for all doc types
  │   ├── process/             # Process templates
  │   ├── class/              # Class templates
  │   └── task/               # Task templates
  └── 02-process/              # Process documentation
02-implementation-docs/          # Active documentation
```

## Implementation Guidelines

### 1. When Working on Tasks
1. Check strategic context
2. Verify tactical requirements
3. Follow pattern guidelines
4. Use appropriate templates
5. Maintain documentation

### 2. When Creating Documents
1. Use correct templates
2. Follow naming conventions
3. Place in proper locations
4. Link to related documents
5. Update tracking information

### 3. When Providing Feedback
1. Note pattern effectiveness
2. Report implementation issues
3. Suggest improvements
4. Document learnings
5. Update relevant documentation

## Context Management

### 1. New Composer Integration
```markdown
STRATEGIC POINTS:
1. Layer Transitions
   - Between process layers
   - Major context switches
   - Complex feature changes

2. Document Type Changes
   - Vision to user stories
   - Stories to implementation
   - Pattern to tactical plans

3. Error Recovery
   - After context overflow
   - Complex state confusion
   - Multiple document loads
```

### 2. Context State Management
```markdown
BEFORE OPERATIONS:
1. State Assessment
   - Current context load
   - Document relationships
   - Tool requirements

2. Load Planning
   - Required documents
   - Reference materials
   - Implementation context

3. Validation Steps
   - Context boundaries
   - Document alignment
   - Tool availability
```

## Context Management Documentation

### 1. Context Issue Reporting
```markdown
REPORT LOCATIONS:
1. Context Alerts
   Path: 02-implementation-docs/context-management/alerts/
   Format: CONTEXT-[DATE]-[NUMBER].md
   Example: CONTEXT-20240320-001.md

2. Context Patterns
   Path: 02-implementation-docs/context-management/patterns/
   Format: PATTERN-[TYPE]-[NUMBER].md
   Example: PATTERN-OVERFLOW-001.md

RELATED PROCESSES:
- Error Handling: `01-meta/02-process/ai/ai-error-handling.v1.md`
  Review this process for additional guidance on:
  - Error classification
  - Recovery procedures
  - Prevention strategies
  - Integration with context management
```

### 2. Alert Report Structure
```markdown
# Context Alert Report
ID: CONTEXT-[DATE]-[NUMBER]
TYPE: [OVERFLOW|CONFUSION|BREAK]
SEVERITY: [HIGH|MEDIUM|LOW]

## Trigger Conditions
- What caused the context issue
- Related documents or operations
- System state at time of issue

## Impact
- Affected operations
- Scope of context loss
- Recovery actions taken

## Prevention Notes
- How to avoid in future
- Early warning signs
- Recommended checkpoints
```

### 3. Pattern Report Structure
```markdown
# Context Pattern Report
ID: PATTERN-[TYPE]-[NUMBER]
CATEGORY: [OVERFLOW|TRANSITION|TOOL]

## Pattern Description
- Observed behavior
- Trigger conditions
- Common manifestations

## Management Strategy
- Prevention steps
- Early detection
- Mitigation approaches

## Implementation Guidelines
- When to use New Composer
- Context preservation steps
- Recovery procedures
```

### 4. New Composer Usage Guidelines
```markdown
INITIATE NEW COMPOSER WHEN:
1. Context Load Indicators
   - Multiple complex documents loaded
   - Cross-layer operations active
   - Tool state uncertainty
   - Extended conversation history

2. State Management Issues
   - Inconsistent references
   - Confusion about current scope
   - Missing critical dependencies
   - Tool operation errors

3. Before Critical Operations
   - Major feature transitions
   - Complex refactoring tasks
   - Cross-domain implementations
   - Pattern-based changes

PRESERVATION STEPS:
1. Document current state
2. Save critical context points
3. Plan reload strategy
4. Get user confirmation
```

## Common Operations

### 1. Starting a New Initiative
```diff
+ 1. Review/create product vision
+ 2. Create/update user stories
  3. Review relevant user stories
  4. Analyze feature requirements
  5. Create class specifications if needed
  6. Read strategic process
  7. Create strategic initiative
  8. Create tactical plans
  9. Generate tasks
```

### 2. Implementing Changes
1. Check tactical process
2. Follow task template
3. Verify against patterns
4. Update documentation

### 3. Managing Documentation
1. Use correct locations
2. Follow naming conventions
3. Maintain links
4. Update tracking
5. Share learnings

## Implementation File Structure

### Complete Project Structure
```markdown
project-root/
├── 01-meta/                         # Process & templates
│   ├── 00-AI-init/                 # AI initialization docs
│   │   ├── AI-Process-Guide.v1.md
│   │   └── [other init docs]
│   │
│   ├── 01-templates/               # Templates for all doc types
│   │   ├── process/               # Process templates
│   │   │   ├── vision-development.v1.template.md
│   │   │   ├── user-story-development.v1.template.md
│   │   │   ├── product-development.v1.template.md
│   │   │   ├── strategic-planning.v1.template.md
│   │   │   └── tactical-planning.v1.template.md
│   │   ├── class/                # Class templates
│   │   │   ├── class-functional-spec.v1.template.md
│   │   │   └── class-hierarchy-template-v1.md
│   │   └── task/                 # Task templates
│   │       ├── todo-breakdown.v1.template.md
│   │       └── code-generation-task.v1.template.md
│   │
│   └── 02-process/                # Process documentation
│       ├── ai/                    # AI-specific processes
│       │   ├── ai-focusing-tips.v1.md
│       │   └── ai-development-process.v1.md
│       ├── strategic/             # Strategic processes
│       │   └── strategic-process.v1.md
│       └── tactical/              # Tactical processes
│           └── tactical-process.v1.md
│
└── 02-implementation-docs/         # Active documentation
    ├── product/                   # Product vision & user stories
    │   ├── vision/               # Product vision documents
    │   └── stories/             # User story collections
    │
    ├── context-management/        # Context tracking & patterns
    │   ├── alerts/              # Context issue alerts
    │   │   └── CONTEXT-[DATE]-[NUMBER].md
    │   └── patterns/            # Context pattern documentation
    │       └── PATTERN-[TYPE]-[NUMBER].md
    │
    ├── strategic/                 # Strategic initiatives
    │   └── SI-[AREA]-[NUMBER]/    # Strategic initiative folders
    │       └── strategic-plan.md
    │
    ├── tactical/                  # Tactical implementations
    │   └── TI-[SI-REF]-[NUMBER]/ # Tactical initiative folders
    │       └── tactical-plan.md
    │
    ├── tasks/                     # Implementation tasks
    │   └── [SI-REF]/             # Grouped by strategic initiative
    │       └── TASK-[TI-REF]-[NUMBER].md
    │
    └── classes/                   # Class specifications
        └── [domain]/             # Grouped by domain
            └── [ClassName].spec.md
```
AI Note: The 01-meta folder is immutable. It is used to define the process and templates for the project to be used by the AI to generate new documents in the 02-implementation-docs folder.

### Where to Put New Files

1. **New Generated Product Documents**
   - User Stories: `02-implementation-docs/product/stories/`
   - Product Vision: `02-implementation-docs/product/vision/`

2. **New Context Issue Documents**
   - Context Alerts: `02-implementation-docs/context-management/alerts/CONTEXT-[DATE]-[NUMBER].md`
   - Context Patterns: `02-implementation-docs/context-management/patterns/PATTERN-[TYPE]-[NUMBER].md`

3. **New Implementation Documents**
   - Strategic Initiatives: `02-implementation-docs/strategic/SI-[AREA]-[NUMBER]/`
   - Tactical Plans: `02-implementation-docs/tactical/TI-[SI-REF]-[NUMBER]/`
   - Tasks: `02-implementation-docs/tasks/[SI-REF]/TASK-[TI-REF]-[NUMBER].md`
   - Class Specs: `02-implementation-docs/classes/[domain]/[ClassName].spec.md`

## Version History
```diff
- VERSION: 1.5
+ VERSION: 1.6
  DATE: [current_date]
  AUTHOR: Claude
  CHANGES:
  - Added Product Understanding as first step
  - Updated file organization structure
  - Added document flow visualization
  - Reorganized process flow to start with product layer
  - Added comprehensive file structure diagram
  - Updated directory structure with new product templates
  - Updated initiative process to start with product layer
  - Added context management documentation section
  - Added context alert and pattern templates
  - Added context management file locations
  - Added reference to error handling process
  TEMPLATE REFERENCES:
  - Context Alert Template: 01-meta/01-templates/context/context-alert.v1.template.md
  - Context Pattern Template: 01-meta/01-templates/context/context-pattern.v1.template.md
``` 