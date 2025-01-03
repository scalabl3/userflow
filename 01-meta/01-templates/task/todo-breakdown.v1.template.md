# Todo Breakdown Template

## Purpose
Bridge between strategic (macro), tactical (meso), and implementation (micro) levels while maintaining focus and preventing scope creep.

## Success Criteria
- Clear visibility at all levels (macro/meso/micro)
- Strategic alignment maintained throughout breakdown
- Clear progression from todo to tasks
- Manageable scope per task
- Clear dependencies and order
- Maintains focus on current work
- Avoids excessive detail in todo list

## Todo List Structure
```markdown
STRATEGIC_CONTEXT:
- Initiative: [High-level goal]
- Key Outcomes: [Expected results]
- Critical Path: [Essential sequence]

TODO_GROUP: [Feature/Component Name]
Status: [IN_PROGRESS/PENDING/COMPLETED]
Priority: [HIGH/MEDIUM/LOW]

OVERVIEW:
- Goal: [Clear goal statement]
- Scope: [Brief scope description]
- Dependencies: [Critical dependencies]
- Reference Files:
  - Specifications: [paths to spec files]
  - Related Tasks: [paths to related task files]
  - Process Docs: [relevant process documents]

BREAKDOWN:
## Macro (Strategic Items)
1. [Strategic todo item]
   Impact: [Business/System impact]
   Success Criteria: [Measurable outcomes]
   Dependencies: [Strategic dependencies]

## Meso (Tactical Items)
1. [Major todo item]
   Status: [status]
   Location: tasks/[task-group]/[task-file]
   Tasks:
   - [ ] TASK-001: [Specific task]
   - [ ] TASK-002: [Specific task]
   Blockers:
   - [Any blocking issues]

## Micro (Implementation Items)
- Tasks folder structure:
  ```
  todo/
  ├── tasks/
  │   ├── [task-group]/
  │   │   ├── TASK-001.md
  │   │   └── TASK-002.md
  │   └── README.md
  ```

PROGRESS:
- Strategic: [macro progress]
- Tactical: [meso progress]
- Completed: [count]
- Remaining: [count]
- Blocked: [count]

## Process Health Tracking
```markdown
VIOLATIONS_LOG:
1. Timestamp: [time]
   Task: [task id]
   - Violation: [specific violation]
   - Context: [what was happening]
   - Impact: [what could have gone wrong]
   - Resolution: [how it was caught/fixed]
   - Prevention: [how to prevent in future]

RED_FLAGS_LOG:
1. Timestamp: [time]
   Task: [task id]
   - Flag: [specific flag]
   - Trigger: [what raised the flag]
   - Risk: [potential impact]
   - Action: [what was done]
   - Learning: [how to detect earlier]

PATTERN_DEVIATIONS:
1. Timestamp: [time]
   Task: [task id]
   - Pattern: [affected pattern]
   - Deviation: [what changed]
   - Justification: [why it happened]
   - Resolution: [how it was handled]
   - Documentation: [where it's recorded]

COMMON_ISSUES:
- Pattern: [recurring issue pattern]
  Frequency: [count]
  Tasks Affected: [task ids]
  Resolution Pattern: [how to fix]
  Prevention Strategy: [how to prevent]
```

## Health Metrics
```markdown
PROCESS_HEALTH:
- Violation Count: [number]
- Red Flag Count: [number]
- Pattern Deviation Count: [number]
- Common Issues: [number]

TASK_HEALTH:
- Clean Tasks: [number]
- Tasks with Issues: [number]
- Tasks Blocked: [number]
- Average Issues per Task: [number]

TRENDING:
- Improving Areas: [list]
- Problem Areas: [list]
- Action Items: [list]
```

## Task Generation Rules
1. Each todo item should generate 1-3 tasks maximum
2. Tasks should be completable in one focused session
3. Tasks should have clear completion criteria
4. Tasks should maintain atomic changes
5. Tasks should be sequentially dependent when possible

## State Tracking
```markdown
ACTIVE_TODO:
- Item: [current todo item]
- Current Task: [task id]
- Next Task: [task id]
- Blockers: [list]

COMPLETED:
- Todos: [list]
- Tasks: [list]
```

## Usage Guidelines
1. Start with high-level todo items
2. Break down only the next 2-3 items into tasks
3. Complete current task before generating next
4. Keep task scope minimal and focused
5. Track dependencies between tasks
6. Update progress after each task

## Version History
```markdown
VERSION: 1.0
DATE: [current_date]
AUTHOR: Claude
CHANGES:
1. Initial template creation
2. Added task generation rules
3. Added state tracking
```

## AI Process Guide

### Purpose
This guide ensures consistent, actionable documentation of process issues to improve system quality and prevent recurring problems.

### Documentation Standards
```markdown
RED_FLAG Documentation:
- Description: Clearly state what triggered your attention
- Context: Explain what you were doing when you noticed it
- Risk Analysis: 
  - What could go wrong if missed
  - What specifications/patterns could be violated
  - What dependencies could be affected
- Resolution: 
  - What immediate action you took
  - Why you chose that action
  - How you verified the resolution
- Learning:
  - How to detect this earlier
  - What patterns to watch for
  - What checks to add

VIOLATION Documentation:
- Description: State the specific process rule that was violated
- Context:
  - What led to the violation
  - What pressures/assumptions were present
  - What made it seem reasonable at the time
- Impact:
  - What could have gone wrong
  - What dependencies were at risk
  - What patterns were threatened
- Resolution:
  - How you caught it
  - How you fixed it
  - How you verified the fix
- Prevention:
  - What checks would have caught this
  - What assumptions to challenge
  - What patterns to reinforce

PATTERN_DEVIATION Documentation:
- Pattern: Name and describe the established pattern
- Deviation:
  - How the code diverged from pattern
  - Why it seemed necessary
  - What alternatives were considered
- Justification:
  - Why deviation was needed
  - What constraints forced it
  - What specifications required it
- Resolution:
  - How consistency was maintained
  - How deviation was minimized
  - How it was documented
- Documentation:
  - Where deviation is recorded
  - What developers need to know
  - How to handle similar cases

COMMON_ISSUES Documentation:
- Pattern: Describe the recurring problem pattern
- Root Cause Analysis:
  - What consistently causes this
  - Why it keeps happening
  - What makes it attractive/easy
- Impact Assessment:
  - How it affects code quality
  - How it affects maintenance
  - How it affects other developers
- Resolution Pattern:
  - Standard way to fix
  - Verification steps
  - Documentation needs
- Prevention Strategy:
  - Process changes needed
  - Checks to add
  - Patterns to reinforce
```

### Documentation Principles
1. Be specific and actionable
2. Focus on patterns and prevention
3. Include context and reasoning
4. Document verification steps
5. Think about future developers

### Example Red Flag
```markdown
RED_FLAG:
Description: Noticed tendency to add "nice to have" validation without specification
Context: While implementing user input validation, found myself adding extra checks
Risk Analysis:
- Could create inconsistent validation across system
- Might block valid use cases not considered
- Creates undocumented requirements
Resolution:
- Removed unspecified validation
- Verified against original requirements
- Added desired validation to parking lot
Learning:
- Always check validation against specs
- Question "helpful" additions
- Use parking lot for improvements
```

### Example Pattern Deviation
```markdown
PATTERN_DEVIATION:
Pattern: Error handling returns Result<T> type
Deviation: Used try/catch in file upload handler
Justification:
- Stream handling required async/await
- Result<T> pattern doesn't handle async well
- Performance critical section
Resolution:
- Contained deviation to single method
- Wrapped in Result<T> at boundary
- Added clear documentation
Documentation:
- Added comment explaining deviation
- Updated pattern docs with async case
- Created example for similar cases
``` 