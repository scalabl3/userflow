# AI Context Report Template (v1)

## Output Location
Generated context reports MUST be placed in: `02-implementation-docs/ai-reports/context/`
Following naming convention: `CONTEXT-{TYPE}-{DATE}-{NUMBER}.md`
Example: `CONTEXT-PARALLEL-20231229-001.md`

⚠️ IMPORTANT: Never create reports in the template directory. All generated content goes to the implementation directory.

## Template Extension
Extends: `ai-report-base.v1.template.md`
Specialization: Context Management and Recovery

## Context-Specific Fields

### Context State
```markdown
## Active Contexts
1. Primary Context
   - Type: [Processing|Analysis|Implementation]
   - State: [Active|Degraded|Lost]
   - Dependencies: [Related contexts]

2. Secondary Contexts
   - List of parallel contexts
   - State of each
   - Interaction points

## Context History
- Recent state changes
- Transition points
- Stability markers
```

### Context Analysis
```markdown
## Layer Analysis
1. Cognitive Layer
   - Processing state
   - Pattern recognition
   - Decision making

2. Structural Layer
   - Document relationships
   - Reference integrity
   - Pattern consistency

3. Implementation Layer
   - Task progress
   - Code state
   - Test status

## Context Boundaries
- Clean separation points
- Interaction zones
- Potential conflicts
```

### Recovery Strategy
```markdown
## Context Recovery Steps
1. Immediate Stabilization
   - Freeze changing states
   - Document current position
   - Secure critical context

2. State Assessment
   - Map active contexts
   - Identify corrupted states
   - Verify stable elements

3. Recovery Process
   - Restore base context
   - Rebuild relationships
   - Verify integrity
```

### Enhanced AI Considerations
```markdown
## Parallel Processing
- Thread management
- Context isolation
- Synchronization points

## Pattern Recognition
- Structural patterns
- Error patterns
- Recovery patterns

## Meta-cognitive Analysis
- Self-monitoring status
- Enhancement utilization
- Adaptation patterns
```

[Rest of structure follows base template]

## Version History
VERSION: 1.0
DATE: 2023-12-29
CHANGES: Initial template creation 