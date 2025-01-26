# AI Class-Object Operations Guide

## Why Our Structure Helps

### 1. Separation of Concerns
```
[name].model.spec.ts  - Data structure and relationships
[name].class.spec.ts  - Behavior and business logic
[name].api.spec.ts    - External interface and access
```
- Each aspect is isolated but linked through cross-references
- Changes in one file don't automatically cascade without explicit updates
- Dependencies are clearly visible through @model:, @class:, and @api: references

### 2. Explicit Dependencies
```markdown
## Related Specifications
- Model: @model:User
- API: @api:Users
- Dependencies: [@class:Auth, @class:Profile]
```
- Forces consideration of impact before changes
- Prevents hidden coupling
- Makes refactoring safer

### 3. Scope Boundaries
```markdown
# =====================================================
# SCOPE BOUNDARY - Base Implementation Ends Here
# =====================================================
```
- Clear separation between core and extended functionality
- Makes removal/modification safer
- Prevents feature creep during modifications

## Optimal Prompting Strategies

### 1. Generating New Class-Objects

#### Best Prompt Template:
```markdown
Please create a new [Class-Object Name] with the following characteristics:
1. Core Purpose: [clear statement of primary function]
2. Required Capabilities: [list of must-have features]
3. Expected Scale: [user/data volume expectations]
4. Known Dependencies: [list if any]
5. Security Requirements: [auth/privacy needs]

Generate the model, class, and API specifications following our template structure.
```

#### Why This Works:
- Sets clear boundaries upfront
- Establishes scale constraints
- Makes dependencies explicit
- Focuses on core functionality

### 2. Adding Functionality

#### Best Prompt Template:
```markdown
Please add [new functionality] to [Class-Object Name]. Consider:
1. Impact on existing dependencies: [@model:X, @class:Y, @api:Z]
2. New dependencies required: [list if any]
3. Changes needed in:
   - Data structure
   - Business logic
   - API endpoints
4. Migration implications: [data/behavior changes]

Show all specifications that need updating.
```

#### Key Considerations:
- Backward compatibility
- Data migration needs
- API version impacts
- Cross-reference updates
- Performance implications

### 3. Removing Functionality

#### Best Prompt Template:
```markdown
Please remove [functionality] from [Class-Object Name]. Consider:
1. Dependent specifications: [list from cross-references]
2. Impact analysis:
   - Data cleanup needed
   - API endpoint deprecation
   - Class method removal
3. Breaking changes
4. Migration path

Show all specifications that need updating and any cleanup required.
```

#### Key Considerations:
- Existing data handling
- Deprecation strategy
- Breaking change management
- Backward compatibility
- Cleanup procedures

### 4. Removing Class-Objects

#### Best Prompt Template:
```markdown
Please analyze removal of [Class-Object Name]. Provide:
1. Impact analysis of all references to:
   - @model:[Name]
   - @class:[Name]
   - @api:[Name]
2. Dependent functionality that will break
3. Data migration/cleanup plan
4. API deprecation strategy
5. Removal sequence to maintain system stability

Show removal plan and all affected specifications.
```

#### Key Considerations:
- Data preservation needs
- Cascade effects
- API contract breaks
- Migration strategy
- System stability

## Common Pitfalls to Address

### 1. Hidden Dependencies
- Always check for implicit dependencies not shown in cross-references
- Look for string literals referencing the class-object
- Check for dynamic references

### 2. Data Integrity
- Consider existing data when modifying models
- Plan for data migration
- Maintain audit trails
- Handle partial failures

### 3. API Contracts
- Version management
- Deprecation periods
- Client impact
- Documentation updates

### 4. Performance Impact
- Index changes
- Query patterns
- Caching implications
- Transaction boundaries

## Best Practices

1. **Always Start With Impact Analysis**
```markdown
Please analyze impact of [operation] on [Class-Object Name]:
1. Direct dependencies
2. Indirect dependencies
3. Data volume affected
4. API clients impacted
```

2. **Maintain Cross-References**
- Update all related specifications
- Keep dependency lists current
- Document breaking changes

3. **Consider Scale**
- Performance impact
- Migration duration
- Resource requirements
- Downtime needs

4. **Plan for Failure**
- Rollback strategies
- Data recovery
- State consistency
- Client retry handling

## Conclusion
Successful Class-Object operations require careful consideration of dependencies, data integrity, and system stability. Our template structure helps manage these concerns by making relationships explicit and containing changes within well-defined boundaries. 