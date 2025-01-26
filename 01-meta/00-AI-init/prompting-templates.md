# Prompting Templates for Component Operations

## Terminology
We use **DCA Component** (Data-Class-API Component) or simply **DCA** to refer to the trio of related specifications:
- **D**ata Model/DTO specification
- **C**lass behavior specification
- **A**PI interface specification

## Template Format
All templates use this structure:
```markdown
OPERATION: [operation type]
TARGET: [component name]
SCALE: [user scale]
---
[template content]
```

## Creation Template
```markdown
OPERATION: CREATE_DCA
TARGET: [ComponentName]
SCALE: [X]K

Please create a new DCA Component with:

1. Core Purpose
   - Primary function: [description]
   - Business context: [usage/context]

2. Component Requirements
   Data Model:
   - Essential fields: [list]
   - Relationships: [list]
   - Validation rules: [list]

   Class Behavior:
   - Core methods: [list]
   - Business rules: [list]
   - State management: [describe]

   API Surface:
   - Required endpoints: [list]
   - Auth requirements: [specify]
   - Rate limits: [if any]

3. Known Dependencies
   - Data: [@model:X]
   - Behavior: [@class:Y]
   - API: [@api:Z]

4. Security Context
   - Access control: [requirements]
   - Data privacy: [requirements]
   - Audit needs: [if any]

Generate all three specifications following our template structure.
```

## Addition Template
```markdown
OPERATION: ADD_TO_DCA
TARGET: [ComponentName]
SCALE: [X]K

Please add functionality to DCA Component:

1. New Capability
   - Feature: [description]
   - Motivation: [why needed]
   - Scope: [boundaries]

2. Impact Analysis
   Data Changes:
   - New fields: [list]
   - Modified relations: [list]
   - Migration needs: [describe]

   Behavior Changes:
   - New methods: [list]
   - Modified methods: [list]
   - State impact: [describe]

   API Changes:
   - New endpoints: [list]
   - Modified endpoints: [list]
   - Version impact: [describe]

3. Dependencies
   - Existing affected: [list]
   - New required: [list]

4. Migration Plan
   - Data updates: [steps]
   - Deployment sequence: [steps]
   - Rollback plan: [steps]

Show all specifications requiring updates.
```

## Removal Template
```markdown
OPERATION: REMOVE_FROM_DCA
TARGET: [ComponentName]
SCALE: [X]K

Please remove functionality from DCA Component:

1. Target Feature
   - Functionality: [description]
   - Scope: [boundaries]
   - Reason: [justification]

2. Impact Analysis
   Data Impact:
   - Fields affected: [list]
   - Cleanup needed: [describe]
   - Data preservation: [strategy]

   Behavior Impact:
   - Methods removed: [list]
   - Methods modified: [list]
   - State changes: [describe]

   API Impact:
   - Endpoints removed: [list]
   - Deprecation needs: [strategy]
   - Version handling: [plan]

3. Dependencies
   - Affected components: [list]
   - Breaking changes: [list]
   - Migration path: [steps]

Show affected specifications and cleanup plan.
```

## Delete Template
```markdown
OPERATION: DELETE_DCA
TARGET: [ComponentName]
SCALE: [X]K

Please analyze complete removal of DCA Component:

1. Component Analysis
   - Current usage: [describe]
   - Data volume: [estimate]
   - Client impact: [describe]

2. Dependencies
   Direct References:
   - Data: [@model:X]
   - Class: [@class:Y]
   - API: [@api:Z]

   Indirect References:
   - String literals: [locations]
   - Dynamic usage: [patterns]
   - Hidden coupling: [describe]

3. Removal Plan
   Preparation:
   - API deprecation: [timeline]
   - Client notification: [plan]
   - Feature flags: [strategy]

   Data Handling:
   - Preservation needs: [strategy]
   - Cleanup sequence: [steps]
   - Validation points: [checks]

   Execution:
   - Removal sequence: [ordered steps]
   - Verification points: [checks]
   - Rollback triggers: [conditions]

4. Stability Measures
   - Monitoring: [metrics]
   - Fallbacks: [strategy]
   - Recovery plan: [steps]

Show complete removal plan and affected specifications.
```

## Best Practices

1. **Always Include Scale**
   - Affects performance requirements
   - Influences migration strategies
   - Impacts implementation choices

2. **Be Explicit About Boundaries**
   - What's in scope
   - What's out of scope
   - What's deferred

3. **Consider State**
   - Data at rest
   - Data in transit
   - Cached data
   - Client state

4. **Plan for Failure**
   - Partial failures
   - Rollback needs
   - Data consistency
   - Client recovery

## Template Usage Notes

1. **Customization**
   - Add domain-specific sections as needed
   - Remove irrelevant sections
   - Adjust detail level for scale

2. **Response Expectations**
   - AI should analyze first
   - Show impact before changes
   - Provide complete plan
   - Wait for confirmation

3. **Validation Steps**
   - Cross-reference checks
   - Scale compatibility
   - Security implications
   - Performance impact 