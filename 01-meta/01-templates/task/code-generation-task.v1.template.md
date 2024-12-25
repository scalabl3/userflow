# Code Generation Task Template

## Purpose
This template ensures systematic, specification-compliant code generation with clear state tracking and validation at each step. It prevents scope creep, maintains focus, and ensures all changes are verified and documented.

## Success Criteria
- All generated code matches specifications exactly
- No unspecified features or behaviors added
- All changes are atomic and verified
- Complete test coverage for specified behaviors
- Clear state tracking throughout process
- Document any red flags or process violations in the parent todo's Process Violations & Red Flags Log
- When this task is complete, update the parent todo's Task List with completed status and remove from context.
- If ideas for improvements are found during the development process, document them in the Feature Parking Lot in the 06-parking-lot folder using the feature-parking-lot-template.md template. Don't lose focus on the current task, use the parking lot for ideas that are not currently relevant to the current task and remove from context when done.


## Failure Criteria
- Any deviation from specifications
- Unverified or untested changes
- Missing documentation
- Implicit assumptions
- Pattern inconsistencies

## Template Structure

### 1. Task Definition
```markdown
TASK_ID: [unique identifier]
LOCATION: todo/tasks/[task-group]/[task-id].md
SPECIFICATION_SOURCE: [file path]
SCOPE: [specific class/feature]
PRIORITY: [priority level]
DEPENDENCIES: [list of dependencies]

CONTEXT_LEVELS:
- Strategic (Macro): [Link to todo group]
- Tactical (Meso): [Link to major todo item]
- Implementation (Micro): This task

REFERENCE_FILES:
- Specifications: [paths]
- Related Tasks: [paths]
- Process Docs: [paths]
```

### 2. Specification Analysis
```markdown
REQUIREMENTS:
- Source: [spec file]
  - [ ] [requirement 1]
  - [ ] [requirement 2]

INTERFACES:
- Required:
  - [ ] [interface 1]
  - [ ] [interface 2]

VALIDATION_RULES:
- Category: [name]
  - Pattern: [pattern]
  - Rules:
    1. [ ] [rule 1]
    2. [ ] [rule 2]
```

### 3. Implementation State
```markdown
CURRENT_STATE:
Files Active:
- [file_path]:
  Status: [READING/MODIFYING/COMPLETE]
  Changes Needed:
  - [ ] [change 1]
  - [ ] [change 2]

Dependencies Status:
- [dependency]:
  - State: [✅ READY | ❌ BLOCKING | 🔄 IN_PROGRESS]
  - Required For: [purpose]
  - Blocking Issues: [issues]
```

### 4. Test Coverage
```markdown
TEST_REQUIREMENTS:
- [test_file]:
  - [ ] [test scenario 1]
  - [ ] [test scenario 2]

TEST_HELPERS:
- [ ] [helper 1]
  Purpose: [description]
  Usage: [where used]
```

### 5. Change Tracking
```markdown
ATOMIC_CHANGES:
1. [file_path]:
   - Change: [description]
   - Status: [✅ VERIFIED | ❌ FAILED | 🔄 IN_PROGRESS]
   - Tests: [PASS/FAIL]
   - Dependencies: [list]
```

### 6. Quality Gates
```markdown
PRE_IMPLEMENTATION:
- [ ] All specifications read twice
- [ ] All dependencies mapped
- [ ] All interfaces identified
- [ ] Test plan documented
- [ ] No assumptions present

DURING_IMPLEMENTATION:
- [ ] Following atomic change pattern
- [ ] Testing after each change
- [ ] Updating documentation
- [ ] Tracking state
- [ ] Following patterns

POST_IMPLEMENTATION:
- [ ] All specifications met
- [ ] All tests passing
- [ ] Documentation complete
- [ ] No debug code
- [ ] No TODOs
```

### 7. State Management
```markdown
VERIFICATION_POINTS:
Last Known Good State:
- Time: [timestamp]
- Files: [list]
- Test Status: [status]

Recovery Steps:
1. [ ] Review specifications
2. [ ] Check last good state
3. [ ] Verify dependencies
4. [ ] Run tests
5. [ ] Resume process
```

### 8. Metrics & Triggers
```markdown
REVIEW_TRIGGERS:
- [ ] Multiple file changes: [count]
- [ ] Unverified changes: [count]
- [ ] Failed tests: [count]
- [ ] Pattern deviations: [count]

STOP_AND_REVIEW when:
- Count > 2 changes to same file
- Count > 3 failing tests
- Any pattern deviation
- Any unverified change
```

### 9. Completion Checklist
```markdown
FINAL_VERIFICATION:
Specification Compliance:
- [ ] All requirements implemented
- [ ] No extra features
- [ ] All interfaces correct
- [ ] All validations present

Test Coverage:
- [ ] All scenarios tested
- [ ] All edge cases covered
- [ ] All helpers verified
- [ ] No pending tests

Code Quality:
- [ ] No debug code
- [ ] No TODOs
- [ ] Pattern consistent
- [ ] Documentation complete

State Verification:
- [ ] All changes tracked
- [ ] All states documented
- [ ] Recovery points clear
- [ ] No pending changes
```

## Usage Notes
1. Fill out each section before starting implementation
2. Update state tracking after each change
3. Verify against specifications frequently
4. Stop at any review trigger
5. Maintain atomic changes
6. Document all decisions
7. Keep recovery points updated

## Version History
```markdown
VERSION: 1.0
DATE: [current_date]
AUTHOR: Claude
CHANGES:
1. Initial template creation
2. Combined best practices from:
   - Class functional spec template
   - AI development process
   - Code generation requirements
```

## Process Violations & Red Flags Log
```markdown
VIOLATIONS_LOG:
1. Timestamp: [time]
   - Violation: [specific violation]
   - Context: [what was happening]
   - Impact: [what could have gone wrong]
   - Resolution: [how it was caught/fixed]
   - Prevention: [how to prevent in future]

RED_FLAGS_LOG:
1. Timestamp: [time]
   - Flag: [specific flag]
   - Trigger: [what raised the flag]
   - Risk: [potential impact]
   - Action: [what was done]
   - Learning: [how to detect earlier]

PATTERN_DEVIATIONS:
1. Timestamp: [time]
   - Pattern: [affected pattern]
   - Deviation: [what changed]
   - Justification: [why it happened]
   - Resolution: [how it was handled]
   - Documentation: [where it's recorded]
``` 