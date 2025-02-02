# Standards and Process for Model Development
## Core Principles
- Models are the foundation of our domain
- Each change must be deliberate and understood
- Standards must be consistently applied
- Focus and scope must be maintained
- Changes are verified systematically
## Model Standards
- Clear documentation of purpose and features
- Consistent property organization (core, relationships, optional)
- Proper TypeORM decorators and configurations
- Validation using class-validator
- Explicit typing and nullability
- Relationship configurations via helpers
- Default values where appropriate
## Model Test Standards
- Organized by feature category
- Clear test descriptions
- Comprehensive initialization
- Focused test cases
- Proper type assertions
- Validation testing
- Relationship verification
## Implementation Process
- One model at a time
- Update model to standards first
- Update corresponding tests
- Verify changes in isolation
- Move to next model only when current is complete
## Build Verification
- Focus ONLY on model and test files
- Analyze each error in isolation
- Understand root cause before making changes
- Fix one category of errors at a time
- Verify fix doesn't introduce new issues
- Maintain scope boundaries - ignore service/controller/DTO errors
## Change Discipline
- Understand before changing
- Make minimal required changes
- Verify each change
- Don't chase errors across layers
- Stay within defined scope
- Follow the established pattern
## Root Cause Analysis
- Identify the specific error
- Locate the source in model/test
- Understand why it violates standards
- Plan the minimal fix
- Apply fix systematically
- Verify resolution
## Success Patterns
- Systematic approach yields consistent results
- Focus maintains quality
- Standards ensure consistency
- Process prevents regression
- Discipline avoids chaos
- Verification confirms correctness
## Warning Signs
- Chasing errors across layers
- Making random changes
- Losing focus on models/tests
- Ignoring established patterns
- Skipping verification steps
- Expanding scope without reason
## Recovery Steps
- Stop at first sign of deviation
- Return to last known good state
- Review standards and process
- Re-establish focus
- Proceed systematically
- Maintain discipline