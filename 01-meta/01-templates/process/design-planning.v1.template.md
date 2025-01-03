# Design Document Template (v1)

## Output Location
Generated design documents MUST be placed in: `02-implementation-docs/design/[DESIGN-ID]/`
Following naming convention: `DESIGN-AUTH-001`, `DESIGN-BILLING-001`

⚠️ IMPORTANT: Never create design documents in the template directory. All generated content goes to the implementation directory.

## Purpose
Guide AI assistants in creating right-sized design specifications that bridge tactical plans to implementation tasks.

## Document Structure

### 1. Scale Context
```markdown
SCALE PARAMETERS (ASK USER):
- Total Users: [ask: "What is your expected total user base?"]
- Concurrent Users: [ask: "What percentage will be concurrent users?"]
- Growth Timeline: [ask: "What is your growth timeline?"]
- Performance Targets: [ask: "Any specific performance requirements?"]

PLATFORM CAPABILITIES (VERIFY WITH USER):
- Available Services: [ask: "Which platform services are you using?"]
- Built-in Features: [ask: "What platform features do you want to leverage?"]
- Scaling Features: [ask: "What scaling capabilities are available?"]
- Integration Points: [ask: "What integrations are required?"]
```

### 2. Architecture Overview
```markdown
COMPONENTS (CONFIRM WITH USER):
- [Component Name]
  - Purpose: [ask: "What is this component's main purpose?"]
  - Scale Impact: [ask: "How should this handle your scale?"]
  - Platform Usage: [ask: "Which platform services should this use?"]
  - Custom Elements: [ask: "What custom functionality is needed?"]

RELATIONSHIPS (VERIFY WITH USER):
- [Component] → [Component]
  - Type: [ask: "How do these components interact?"]
  - Scale: [ask: "What's the expected data/request volume?"]
  - Constraints: [ask: "Any limitations to be aware of?"]
```

### 3. Implementation Guide
```markdown
1. Component Tasks
   - Setup
   - Core functionality
   - Integration
   - Testing

2. Sequence
   - Dependencies
   - Order
   - Checkpoints

3. Verification
   - What to test
   - How to validate
   - Success criteria
```

## Version History
```markdown
VERSION: 1.0
DATE: 2024-01-07
AUTHOR: C3C
CHANGES:
- Initial template creation
- Added scale context section
- Added implementation guide
``` 