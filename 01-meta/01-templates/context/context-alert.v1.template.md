# Context Alert Template

## Purpose
This template is used to report context management issues that occur during AI operations. It helps track, analyze, and prevent context-related problems.

## Usage
1. Create in: `02-implementation-docs/context-management/alerts/`
2. Name format: `CONTEXT-[DATE]-[NUMBER].md`
3. Fill out all sections below

## Template Structure

```markdown
# Context Alert Report
ID: CONTEXT-[DATE]-[NUMBER]
TYPE: [OVERFLOW|CONFUSION|BREAK]
SEVERITY: [HIGH|MEDIUM|LOW]
TIMESTAMP: [YYYY-MM-DD HH:MM:SS]
REPORTER: [AI_NAME]

## Trigger Conditions
### Context State
- Current operation being performed
- Active documents and tools
- System state indicators

### Trigger Event
- Specific action that caused the issue
- Related documents or operations
- Environmental factors

## Impact Assessment
### Immediate Effects
- Operations affected
- Scope of context loss
- Immediate consequences

### Recovery Actions
- Steps taken to recover
- Success/failure of recovery
- Resources required

### Downstream Impact
- Related processes affected
- Data/context integrity issues
- User interaction impacts

## Analysis
### Root Cause
- Primary factors
- Contributing conditions
- System limitations encountered

### Prevention Opportunities
- Early warning signs observed
- Missed prevention chances
- System improvements needed

## Recommendations
### Immediate Actions
- Short-term fixes
- Operational adjustments
- User communication needs

### Long-term Prevention
- Process improvements
- System enhancements
- Training/documentation updates

### Monitoring Points
- Key indicators to watch
- Threshold values
- Check frequency

## References
- Related alerts: [CONTEXT-IDs]
- Pattern reports: [PATTERN-IDs]
- System documentation: [LINKS]
```

## Example Usage

```markdown
# Context Alert Report
ID: CONTEXT-20240320-001
TYPE: OVERFLOW
SEVERITY: HIGH
TIMESTAMP: 2024-03-20 14:30:00
REPORTER: Claude

## Trigger Conditions
### Context State
- Analyzing complex class hierarchy
- Multiple template files open
- Processing user feedback

### Trigger Event
- Attempted to load additional strategic document
- Memory allocation exceeded
- Pattern matching degraded

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