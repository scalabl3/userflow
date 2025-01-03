# Product Development Guide (v1)

## Output Location
Generated product documentation MUST be placed in: `02-implementation-docs/product/`
Following appropriate subdirectory structure:
- Stories: `stories/STORY-{TYPE}-{NUMBER}.md`
- Features: `features/FEATURE-{TYPE}-{NUMBER}.md`
- Architecture: `architecture/ARCH-{TYPE}-{NUMBER}.md`

⚠️ IMPORTANT: Never create product documentation in the template directory. All generated content goes to the implementation directory.

## Purpose
Guide AI assistants in product thinking and connecting user needs to implementation. This ensures features and changes are driven by user value rather than just technical requirements.

## Product Thinking Framework

### 1. Solution Design
```markdown
INTERACTION DESIGN:
- How should the AI respond?
- What context should it maintain?
- What clarifications might it need?
- How to handle errors?

SUCCESS METRICS:
- How do we know it works?
- What should we measure?
- What indicates quality?
- When should we adjust?
```

## Implementation Bridge

### 1. Class Discovery Process
```markdown
1. Feature Analysis
   - What data needs to be managed?
   - What behaviors are needed?
   - What interfaces are required?
   - What patterns apply?

2. Class Identification
   - Group related behaviors
   - Identify data ownership
   - Map dependencies
   - Define boundaries

3. Class Specification Creation
   - Create [Domain].[ClassName].spec.md
   - Define interfaces based on user stories
   - Map to acceptance criteria
   - Link to feature requirements

Example Flow:
User Story → Feature → Class Specification
```

### 2. Strategic Connection
```markdown
1. From User Story to Strategic Initiative
   - Identify patterns in user needs
   - Create strategic initiatives
   - Define success metrics
   - Plan verification approach

2. Pattern Recognition
   - User stories drive strategic initiatives
   - Patterns emerge from user needs
   - Success metrics align with user value
```

### 3. Tactical Implementation
```markdown
1. From Feature to Tactical Plan
   - Break down user stories
   - Map to capabilities
   - Create implementation tasks
   - Set quality criteria

2. Implementation Flow
   - Features map to tactical plans
   - User stories guide implementation
   - Quality criteria from user needs
```

### Context Management
```markdown
TRANSITION POINTS:
1. Vision Development
   - After scope definition
   - Before user stories
   - Consider New Composer

2. Feature Analysis
   - Before class discovery
   - After major feature completion
   - Consider New Composer

3. Implementation Bridge
   - Before code generation
   - After complex analysis
   - Consider New Composer
```

## Common Scenarios

### 1. New Feature Development
```markdown
1. Start with user story
2. Validate against capabilities
3. Design interaction flow
4. Create implementation plan
5. Set success metrics
```

### 2. Capability Enhancement
```markdown
1. Identify user need
2. Map current limitations
3. Define improvement goals
4. Plan incremental changes
5. Verify user value
```

### 3. Quality Improvement
```markdown
1. Gather user feedback
2. Identify pain points
3. Design better approach
4. Plan systematic changes
5. Measure improvement
```

## Best Practices

### 1. Product Decisions
- Validate against user stories
- Consider AI capabilities
- Plan for limitations
- Measure user value

### 2. Quality Focus
- Define success clearly
- Plan verification steps
- Track user outcomes
- Gather feedback

## Related Templates
- [Vision Development Guide](./vision-development.v1.template.md)
- [User Story Development Guide](./user-story-development.v1.template.md)

## Version History
```markdown
VERSION: 1.1
DATE: [current_date]
AUTHOR: Claude
CHANGES:
- Split vision and user story content into separate templates
- Focused on implementation bridge and product thinking
- Added related templates section
``` 