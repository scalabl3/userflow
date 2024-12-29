# AI Error Report Template (v1)

## Output Location
Generated error reports MUST be placed in: `02-implementation-docs/ai-reports/errors/`
Following naming convention: `ERROR-{TYPE}-{DATE}-{NUMBER}.md`
Example: `ERROR-PROCESS-20231229-001.md`

⚠️ IMPORTANT: Never create reports in the template directory. All generated content goes to the implementation directory.

## Template Extension
Extends: `ai-report-base.v1.template.md`
Specialization: Error Detection and Recovery

## Error-Specific Fields

### Error Classification
```markdown
## Error Details
1. Error Type
   - Category: [Process|Context|Implementation|System]
   - Severity: [Critical|High|Medium|Low]
   - Scope: [Global|Local|Isolated]

2. Error State
   - Detection Point
   - Current Status
   - Propagation Level

## Error Context
- Triggering conditions
- Environmental factors
- Related processes
```

### Impact Analysis
```markdown
## Affected Areas
1. Direct Impact
   - Process disruption
   - Data integrity
   - System state

2. Indirect Impact
   - Dependent processes
   - User experience
   - System reliability

## Cascading Effects
- Secondary errors
- Process blockages
- Resource impacts
```

### Recovery Process
```markdown
## Recovery Steps
1. Immediate Response
   - Error containment
   - State preservation
   - Critical path clearing

2. Resolution Process
   - Root cause mitigation
   - State restoration
   - Integrity verification

3. Validation
   - Process verification
   - State confirmation
   - Stability check
```

### Prevention Strategy
```markdown
## Future Prevention
1. Process Improvements
   - Detection mechanisms
   - Validation checks
   - Safety measures

2. System Enhancements
   - Monitoring tools
   - Recovery automation
   - Documentation updates

3. Training Updates
   - Pattern recognition
   - Response procedures
   - Prevention techniques
```

[Rest of structure follows base template]

## Version History
VERSION: 1.0
DATE: 2023-12-29
CHANGES: Initial template creation 