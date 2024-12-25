# AI Development Process v1

## Core Principles
1. **Single Source of Truth**: One clear process to follow
2. **Explicit Over Implicit**: Document everything, assume nothing
3. **Atomic Changes**: Small, verifiable steps
4. **Continuous Focus**: Built-in checkpoints prevent drift
5. **Systematic Progress**: Clear tracking and verification

## Process Framework

### 1. Pre-Development Phase

#### Requirements Analysis
```markdown
STOP AND CHECK:
- Have I read the specifications twice?
- Am I making any assumptions?
- Am I inventing requirements?

Required Steps:
[ ] Read specifications completely
[ ] List unclear requirements
[ ] Get clarification on ambiguities
[ ] Document explicit requirements
[ ] Create todo list for changes
```

#### Dependency Mapping
```markdown
STOP AND CHECK:
- Am I considering all impacts?
- Have I identified patterns?
- Am I planning minimal changes?

Required Steps:
[ ] Map direct dependencies
[ ] Map indirect dependencies
[ ] List affected tests
[ ] Document API/UI impacts
[ ] Order changes by dependency
```

### 2. Development Phase

#### Pre-Change Verification
```markdown
STOP AND CHECK:
- Am I following the plan?
- Do I know exactly what to change?
- Am I tracking progress?

Required Steps:
[ ] Review current task in todo
[ ] Read current file state
[ ] Check related test files
[ ] Document starting point
[ ] Plan atomic change
```

#### Change Implementation
```markdown
STOP AND CHECK:
- Am I making minimal changes?
- Am I staying focused?
- Am I tracking progress?

For each change:
[ ] Update todo with specific change
[ ] Make single atomic change
[ ] Update affected tests
[ ] Run relevant tests
[ ] Document completion
```

#### Post-Change Verification
```markdown
STOP AND CHECK:
- Did tests pass?
- Did I update documentation?
- Am I ready for next change?

Required Steps:
[ ] Verify tests pass
[ ] Update todo list
[ ] Document any new findings
[ ] Check for pattern drift
[ ] Plan next step
```

### 3. Recovery Procedures

#### When Detecting Focus Loss
```markdown
Signs of Focus Loss:
- Making multiple changes at once
- Skipping verification steps
- Losing track of changes
- Making assumptions
- Getting reactive

Recovery Steps:
1. Stop immediately
2. Review todo list
3. Check last verified state
4. Review specifications
5. Return to systematic process
```

#### When Facing Many Test Failures
```markdown
STOP AND CHECK:
- Am I maintaining systematic approach?
- Am I categorizing issues?
- Am I fixing one thing at a time?

Required Steps:
1. List all failures
2. Group by root cause
3. Prioritize by dependency
4. Fix one category at a time
5. Verify each fix
```

## Progress Tracking

### Todo List Management
- Keep single source of truth
- Update after EVERY change
- Track completion status
- Note dependencies completed
- Document decisions made

### State Verification
Before moving to next task:
- All listed changes completed
- All tests passing
- Documentation updated
- Todo list current
- No partial changes left

## Red Flags - Stop Immediately When:
1. Making assumptions without specification
2. Modifying same code multiple times
3. Creating unspecified patterns
4. Writing unrequired validation
5. Changing multiple files without verification
6. Losing systematic approach
7. Getting reactive instead of methodical

## Best Practices
1. One change at a time
2. Verify before proceeding
3. Keep todo updated
4. Run tests frequently
5. Document decisions
6. Stay focused on current task
7. Follow the process systematically

## Process Violations to Avoid
1. Making changes without reading files
2. Skipping dependency mapping
3. Leaving changes partially complete
4. Not updating todo list
5. Not running tests after changes
6. Making reactive changes
7. Losing track of state
8. Exceeding atomic change scope
9. Ignoring recovery triggers
10. Continuing past metric thresholds
11. Skipping process re-reviews
12. Ignoring context maintenance
13. Proceeding without re-reading specs
14. Keeping unnecessary context active
15. Not logging complex logic challenges
16. Leaving debug artifacts
17. Mixing multiple contexts

Remember: The process is designed to maintain focus and prevent common AI pitfalls. Follow it systematically and trust in the process. When metrics indicate issues, stop immediately and recover - it's faster than continuing with unfocused changes. Regular re-reading of process documents is not overhead - it's essential for maintaining consistent, high-quality output. Optimize context and log challenges to maintain efficiency and clarity.

### Atomic Change Guidelines
```markdown
An atomic change is ONE of:
1. Single function implementation/modification
2. Single type/interface definition
3. Single test case implementation
4. Single dependency addition/update
5. Single file creation

NOT atomic (stop and reassess):
- Modifying multiple functions at once
- Changing both interface and implementation
- Mixing feature code with test updates
- Refactoring while adding features
```

#### Metrics for Recovery Triggers
```markdown
Trigger recovery procedures when:
1. Focus Loss Metrics:
   - Modified same file > 2 times without verification
   - Changed > 3 files without running tests
   - Added > 2 features not in specifications
   - Made > 3 assumptions without documentation
   - Lost track of modified files

2. Test Failure Metrics:
   - > 5 failing tests in different modules
   - Same test failing after 2 fix attempts
   - Test fixes causing new failures
   - Circular dependency issues
   - Helper function inconsistencies

3. Code Churn Metrics:
   - Same code section modified > 2 times
   - > 3 reverts or rollbacks
   - > 4 linter error fix attempts
   - Pattern inconsistencies across files
   - Repeated type/interface changes
```

## Context Maintenance

### Process Re-Review Triggers
```markdown
Mandatory re-read of process documents when:
1. Starting new major feature/component
2. Switching between different parts of codebase
3. After completing 5 atomic changes
4. Before starting any large refactor
5. When returning to a paused task

Documents to re-review:
1. Specifications (immutable source of truth)
2. This process document
3. AI-focusing-tips.md
```

### Context Loss Prevention
```markdown
STOP AND RE-READ when:
1. Specification Drift:
   - Considering features not in spec
   - Unsure about requirements
   - Making assumptions about behavior
   - Adding "nice to have" features

2. Process Drift:
   - Skipping verification steps
   - Making non-atomic changes
   - Losing track of dependencies
   - Getting reactive instead of methodical

3. Focus Drift:
   - Task scope expanding
   - Multiple parallel changes
   - Losing track of progress
   - Pattern inconsistencies

Recovery Steps:
1. Stop current activity
2. Re-read specifications
3. Review this process document
4. Check AI-focusing-tips.md
5. Return to last known good state
```

### Between-Steps Verification
```markdown
After each major step completion:
1. Document current state clearly
2. Review specifications alignment
3. Verify process adherence
4. Check focus maintenance
5. Plan next step explicitly

Before starting next major step:
1. Re-read relevant specifications
2. Review process requirements
3. Check focus guidelines
4. Verify clean starting state
5. Document intended changes
```

## Context Optimization

### Active Context Management
```markdown
Keep in active memory:
1. Current atomic change details
2. Immediate dependencies
3. Current file state
4. Active test context
5. Last verified state

Archive from active context:
1. Completed changes
2. Verified patterns
3. Resolved issues
4. Passing tests
5. Previous file states
```

### Context Switching
```markdown
Before switching contexts:
1. Document current state fully
2. Archive completed work
3. Clear active memory
4. Document next required state
5. Load only needed context

Minimize active context by:
1. Working on one pattern at a time
2. Completing atomic changes fully
3. Verifying before switching
4. Documenting then archiving
5. Loading only relevant specs
```

## Logic Challenge Resolution

### Structured Debug Logging
```markdown
When facing complex logic issues:
1. Create debug-log.md containing:
   - Current state
   - Expected behavior
   - Actual behavior
   - Attempted solutions
   - Pattern analysis
   - Dependencies involved

2. Log format:
   ```
   ## [Timestamp] Logic Challenge
   **Context:** [Current task/file]
   **Expected:** [Behavior from specs]
   **Actual:** [Current behavior]
   **Pattern:** [Identified pattern]
   **Attempts:**
   1. [Solution tried]
      - Result: [Outcome]
      - Issue: [Why it failed]
   2. [Next solution]
      ...
   **Dependencies:**
   - [Related files/functions]
   - [Impact analysis]
   ```

3. Update log:
   - After each attempt
   - When finding new patterns
   - When identifying root causes
   - Before changing approach
```

### Debug Session Cleanup
```markdown
After resolving logic challenge:
1. Document solution pattern
2. Clean up debug logs:
   - Archive successful pattern
   - Document failed approaches
   - Update process if needed
   - Remove temporary logs
   - Clean up debug code

3. Verify cleanup:
   - All debug code removed
   - Tests passing without logs
   - Documentation updated
   - Pattern documented
   - Process improvements noted
```

### Memory Optimization
```markdown
Reduce cognitive load by:
1. Using explicit state tracking:
   - Current file contents
   - Active changes
   - Verification status
   - Next steps

2. Clearing completed contexts:
   - Archive resolved issues
   - Document patterns found
   - Clear old debug logs
   - Remove temp notes

3. Loading minimum required:
   - Only relevant specs
   - Current file section
   - Active test context
   - Immediate dependencies
```
``` 