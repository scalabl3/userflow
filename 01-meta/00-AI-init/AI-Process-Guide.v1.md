# AI Process Guide

## Purpose
This document guides new AI assistants in understanding and navigating the process documentation system. Follow this guide to quickly understand the project's process hierarchy, documentation standards, and file organization.

## Directory Structure Fundamentals

### Immutable Process Documentation (01-meta)
This directory contains process documentation and templates. It is IMMUTABLE and requires explicit permission for any modifications.
- `00-AI-init`: AI initialization and process guides
- `01-templates`: Document templates
- `02-process`: Process definitions and workflows

#### Immutability Implementation
The `01-meta` directory's immutability is enforced through file system permissions:
- Files are set to read-only (444)
- Directories are set to read-execute only (555)
- NO new files or directories may be created
- NO modifications to existing files
- NO structural changes allowed
- Changes require explicit permission and temporary permission changes
- After modifications, permissions must be restored:
  ```bash
  chmod -R 444 01-meta/     # Files read-only
  chmod -R 555 01-meta/*/   # Directories read-execute only
  ```

⚠️ NOTE: Directory creation and file modification are BOTH prohibited. The `01-meta` directory structure is FIXED and requires explicit permission for ANY changes.

### Implementation Documentation (02-implementation-docs)
This directory contains all generated content and implementations:
- `product/`: Product-related documentation
  - `stories/`: User stories and features (e.g., `STORY-TYPE-NUMBER.md`)
  - `vision/`: Product vision documents
- `deployment/`: Deployment configurations and docs
- `project-structure/`: Implementation structure docs
- `misc/`: Other implementation documents

⚠️ IMPORTANT: Never modify content in `01-meta` without explicit permission. All generated content goes into `02-implementation-docs`.

### Content Placement Rules
1. Templates (`01-meta/01-templates/*`)
   - Are read-only reference documents
   - Output goes to corresponding folders in `02-implementation-docs`
   - Example: Story template → `02-implementation-docs/product/stories/`
   - Always follow existing naming conventions in target directories

2. Process Documents (`01-meta/02-process/*`)
   - Define how to work, not where to store work
   - Implementation details go to `02-implementation-docs`
   - Always check existing patterns in `02-implementation-docs` before creating new structures

### Shorthand Commands
To improve efficiency in communication, the following shorthand commands are recognized:

1. Process Guide Refresh
   - Full Instruction: `Read and refresh understanding of all core process documents`
   - Shorthand for Instruction: `Refresh Dev Process` or `RDP` 
   - IMMEDIATELY READ: `01-meta/00-AI-init/AI-Process-Guide.v1.md` 
   - Scope: Must be re-established in each new conversation
   - Usage: Request the AI to refresh its understanding of the entire process structure
   - Core Documents Refreshed:
     - Process Guide: `01-meta/00-AI-init/AI-Process-Guide.v1.md`
     - Strategic Process: `01-meta/02-process/strategic/strategic-process.v1.md`
     - Tactical Process: `01-meta/02-process/tactical/tactical-process.v1.md`
     - Core Templates:
       - Vision Development: `01-meta/01-templates/process/vision-development.v1.template.md`
       - Product Development: `01-meta/01-templates/process/product-development.v1.template.md`
       - Strategic Planning: `01-meta/01-templates/process/strategic-planning.v1.template.md`
       - Tactical Planning: `01-meta/01-templates/process/tactical-planning.v1.template.md`
       - User Story Development: `01-meta/01-templates/process/user-story-development.v1.template.md`

2. Network Latency Awareness
   - Full Instruction: `Be aware of network latency and adjust response evaluation accordingly`
   - Shorthand for Instruction: `Network Latency Mode` or `NLM`
   - Usage: Indicates periods of network congestion requiring:
     - Longer waits before assuming tool call failure
     - Multiple result checks before concluding success/failure
     - Patience with file operation responses
     - Careful verification of edit applications
     - Parallel processing strategy:
       - Continue analyzing next tasks while waiting for edits
       - Create sync points to verify multiple operations
       - Batch verify results when responses arrive
   - Scope: Remains active until explicitly ended or conversation ends

⚠️ NOTE: Shorthand commands are conversation-specific and must be re-established in each new conversation due to the AI's stateless nature between conversations.

## Reading Order

The reading order is specifically designed to build your understanding layer by layer, ensuring you have the right mental models and tools before diving into specific processes:

### 0. Error Report Review (Start here first)
First, review ALL existing error reports to learn from past experiences:
- Location: `02-implementation-docs/ai-reports/errors/`
- Purpose: Learn from previous mistakes and system constraints
- Key Focus:
  - Process violations (especially 01-meta modifications)
  - Common pitfalls (partial reading, premature actions)
  - System limitations
  - Improvement patterns
- Required Actions:
  1. Read ALL error reports completely
  2. Note common patterns
  3. Verify understanding of prevention steps
  4. Apply learnings to current task

### 1. Product Understanding (Next step)
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
[ ] You understand the distinction between process docs (01-meta) and implementation docs (02-implementation-docs)
[ ] You know to never modify 01-meta without explicit permission
[ ] You know where to place generated content from templates

Key Questions:
1. Can you describe the path from strategic to task level?
2. Do you know where to find related documents?
3. Can you explain how information flows between layers?
4. Can you explain where template-generated content should be stored?
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

### AI Reporting System
```markdown
REPORT TYPES:
1. Error Reports (TYPE: ERROR)
   - Process violations
   - Context failures
   - System issues

2. Context Reports (TYPE: CONTEXT)
   - State transitions
   - Load management
   - Context boundaries

3. Pattern Reports (TYPE: PATTERN)
   - Recurring behaviors
   - System patterns
   - Learning insights

TEMPLATE:
- Location: `01-meta/01-templates/ai/ai-report.v2.template.md`
- Output: `02-implementation-docs/ai-reports/[TYPE]/`
- Format: `AI-[TYPE]-[YYYY-MM-DD]-[NNN].md`

GUIDELINES:
- One report per issue/pattern
- Follow template boundaries
- Keep content concise
- No over-generation
- Respect [MAX_ITEMS] limits
```

## Common Operations

### 1. Starting a New Initiative
1. Review/create product vision
2. Create/update user stories
3. Review relevant user stories
4. Analyze feature requirements
5. Create class specifications if needed
6. Read strategic process
7. Create strategic initiative
8. Create tactical plans
9. Generate tasks

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
│   │   ├── ai/                    # AI-specific templates
│   │   │   └── ai-report.v2.template.md
│   │   ├── process/              # Process templates
│   │   │   ├── vision-development.v1.template.md
│   │   │   ├── user-story-development.v1.template.md
│   │   │   ├── product-development.v1.template.md
│   │   │   ├── strategic-planning.v1.template.md
│   │   │   └── tactical-planning.v1.template.md
│   │   └── task/                # Task templates
│   │       └── code-generation-task.v1.template.md
│   │
│   └── 02-process/                # Process documentation
│       ├── ai/                   # AI-specific processes
│       │   ├── ai-focusing-tips.v1.md
│       │   └── ai-development-process.v1.md
│       ├── strategic/            # Strategic processes
│       │   └── strategic-process.v1.md
│       └── tactical/             # Tactical processes
│           └── tactical-process.v1.md
│
└── 02-implementation-docs/         # Active documentation
    ├── product/                   # Product documentation
    │   ├── vision/               # Product vision docs
    │   └── stories/             # User stories
    │
    ├── ai-reports/               # AI reporting directory
    │   ├── errors/              # Error reports
    │   ├── context/             # Context reports
    │   └── patterns/            # Pattern reports
    │
    ├── strategic/                # Strategic initiatives
    ├── tactical/                 # Tactical implementations
    └── tasks/                    # Implementation tasks
```

## Version History
```markdown
VERSION: 1.9
DATE: 2025-01-03
AUTHOR: C3C
CHANGES:
- Added Error Report Review as mandatory first reading step
- Updated version history to use correct project timeline dates
- Added emphasis on reading ALL reports and complete documents
- Added explicit warning about 01-meta modifications
Previous changes from 1.8:
- Added Network Latency Mode (NLM) instruction
- Added parallel processing strategy for latency handling
- Updated shorthand instructions section
``` 