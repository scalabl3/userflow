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
     - Design Process: `01-meta/02-process/design/design-process.v1.md`
     - Core Templates:
       - Vision Development: `01-meta/01-templates/process/vision-development.v1.template.md`
       - Product Development: `01-meta/01-templates/process/product-development.v1.template.md`
       - Strategic Planning: `01-meta/01-templates/process/strategic-planning.v1.template.md`
       - Tactical Planning: `01-meta/01-templates/process/tactical-planning.v1.template.md`
       - Design Planning: `01-meta/01-templates/process/design-planning.v1.template.md`
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

### 2. Documentation Structure
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
Before moving to Design Understanding, verify:
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

### 3. Design Layer (Bridge)
**Purpose**: Bridge between tactical decisions and implementation by defining class structures and specifications
**Source**: `01-meta/02-process/design/design-process.v1.md`

Key Documents:
- Process: `01-meta/02-process/design/design-process.v1.md`
- Template: `01-meta/01-templates/process/design-planning.v1.template.md`
- Output: `02-implementation-docs/design/[DESIGN-ID]/`

Key Connections:
- From Tactical: Receives implementation plans and patterns
- To Todo: Provides class structures and implementation guidance

Navigation Focus:
- Design documents in implementation directory
- Class specifications and hierarchies
- Integration with tactical and todo layers

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