# Context Pattern Template

## Purpose
This template is used to document recurring context management patterns, their characteristics, and handling strategies. It helps build a knowledge base of context management approaches.

## Usage
1. Create in: `02-implementation-docs/context-management/patterns/`
2. Name format: `PATTERN-[TYPE]-[NUMBER].md`
3. Fill out all sections below

## Template Structure

```markdown
# Context Pattern Report
ID: PATTERN-[TYPE]-[NUMBER]
CATEGORY: [OVERFLOW|TRANSITION|TOOL]
STATUS: [ACTIVE|RESOLVED|MONITORING]
PRIORITY: [HIGH|MEDIUM|LOW]

## Pattern Identification
### Pattern Signature
- Key characteristics
- Common manifestations
- Trigger conditions

### Occurrence Context
- Typical operations affected
- System states involved
- Environmental factors

### Detection Indicators
- Early warning signs
- Measurement metrics
- Threshold values

## Pattern Analysis
### Behavior Model
- Pattern progression
- State transitions
- Impact escalation

### Root Causes
- Primary factors
- Contributing conditions
- System limitations

### Impact Patterns
- Immediate effects
- Cascading consequences
- Recovery complexity

## Management Strategy
### Prevention Approach
- Proactive measures
- System adjustments
- Process modifications

### Detection Methods
- Monitoring points
- Alert conditions
- Verification steps

### Mitigation Procedures
- Immediate actions
- Recovery steps
- Validation checks

## Implementation Guide
### New Composer Usage
- Trigger conditions
- Setup requirements
- Operation sequence

### Context Preservation
- Critical state points
- Backup procedures
- Restoration process

### Recovery Procedures
- Emergency responses
- Cleanup operations
- Validation steps

## Related Patterns
- Parent patterns: [PATTERN-IDs]
- Child patterns: [PATTERN-IDs]
- Related alerts: [CONTEXT-IDs]

## References
- Documentation: [LINKS]
- Templates: [LINKS]
- Tools: [LINKS]
```

## Example Usage

```markdown
# Context Pattern Report
ID: PATTERN-OVERFLOW-001
CATEGORY: OVERFLOW
STATUS: ACTIVE
PRIORITY: HIGH

## Pattern Identification
### Pattern Signature
- Multiple document loading requests
- Increasing response latency
- Context reference errors

### Occurrence Context
- Complex refactoring operations
- Cross-domain implementations
- Extended processing chains

[... continue with other sections ...]
```

## Version History
```diff
VERSION: 1.0
DATE: [current_date]
AUTHOR: Claude
CHANGES:
- Initial template creation
``` 