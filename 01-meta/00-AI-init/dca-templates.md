# DCA (Data-Class-API) Component Templates

## Overview
These templates are structured in two parts:
1. **Human Prompt Template**: What you fill out to request changes
2. **AI Response Template**: How the AI should structure its analysis and response

## CREATE Operation

### What You Fill Out:
```markdown
OPERATION: CREATE_DCA
TARGET: User
SCALE: 10K

Create a new DCA component for User management with:
- Core function: User authentication and profile management
- Required features: Login, registration, profile updates
- Security needs: Password hashing, session management
- Known dependencies: None
```

### How AI Should Respond:
```markdown
## Analysis Phase
I will create a User DCA component. First, let me analyze the requirements:

1. Scale Considerations (10K users)
   - [AI lists relevant scale implications]

2. Security Requirements
   - [AI lists security considerations]

3. Dependency Analysis
   - [AI lists potential dependencies]

## Implementation Plan
I will generate these specifications:

1. user.model.spec.ts
   - [AI outlines planned model structure]

2. user.class.spec.ts
   - [AI outlines planned class structure]

3. user.api.spec.ts
   - [AI outlines planned API structure]

Would you like me to proceed with the implementation?
```

### After Approval:
AI proceeds to generate each specification using our standard templates.

## ADD Operation

### What You Fill Out:
```markdown
OPERATION: ADD_TO_DCA
TARGET: User
SCALE: 10K

Add password reset functionality:
- Email-based reset
- 24-hour reset tokens
- Rate limiting needed
```

### How AI Should Respond:
```markdown
## Analysis Phase
I will add password reset to the User DCA. First, let me analyze the impact:

1. Required Changes
   - [AI lists affected components]

2. New Dependencies
   - [AI lists new dependencies]

3. Security Implications
   - [AI lists security considerations]

## Implementation Plan
I will modify these specifications:

1. user.model.spec.ts:
   - [AI lists planned changes]

2. user.class.spec.ts:
   - [AI lists planned changes]

3. user.api.spec.ts:
   - [AI lists planned changes]

Would you like me to proceed with the changes?
```

## REMOVE Operation

### What You Fill Out:
```markdown
OPERATION: REMOVE_FROM_DCA
TARGET: User
SCALE: 10K

Remove social login functionality:
- Remove OAuth providers
- Keep email/password only
- Need data migration plan
```

### How AI Should Respond:
```markdown
## Analysis Phase
I will remove social login from User DCA. First, let me analyze the impact:

1. Breaking Changes
   - [AI lists affected functionality]

2. Data Impact
   - [AI lists data implications]

3. Migration Needs
   - [AI lists migration requirements]

## Removal Plan
1. Deprecation Steps
   - [AI lists deprecation plan]

2. Implementation Changes
   - [AI lists planned changes]

Would you like me to proceed with the removal?
```

## DELETE Operation

### What You Fill Out:
```markdown
OPERATION: DELETE_DCA
TARGET: User
SCALE: 10K

Delete the entire User component:
- Need data export plan
- Have dependent systems
- 30-day deprecation needed
```

### How AI Should Respond:
```markdown
## Impact Analysis
I will analyze the deletion of the User DCA:

1. Dependencies Found
   - [AI lists all dependencies]

2. Breaking Changes
   - [AI lists all breaking changes]

3. Data Considerations
   - [AI lists data handling needs]

## Removal Strategy
1. Preparation Phase
   - [AI lists preparation steps]

2. Execution Plan
   - [AI lists execution steps]

Would you like me to proceed with detailed planning?
```

## Usage Guidelines

1. **For Humans**
   - Fill out only the essential details
   - Be specific about requirements
   - Include scale and constraints
   - Specify security needs

2. **From AI**
   - Always start with analysis
   - Show impact before changes
   - Wait for approval
   - Follow template structure

3. **Best Practices**
   - Start small and iterate
   - Review AI analysis carefully
   - Consider all dependencies
   - Plan for rollback

## Example Usage Flow

1. **Human**: Fills out CREATE_DCA template for new feature
2. **AI**: Responds with analysis and plan
3. **Human**: Reviews and approves
4. **AI**: Generates specifications
5. **Human**: Reviews generated specs
6. **AI**: Makes any requested adjustments 