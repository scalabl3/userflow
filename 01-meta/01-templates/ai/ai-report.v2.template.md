# AI Report Template v2

[REQUIRED]
ID: AI-[TYPE]-[YYYY-MM-DD]-[NNN]
TYPE: [ERROR|CONTEXT|PATTERN]
SEVERITY: [HIGH|MEDIUM|LOW]

---START core---
[REQUIRED] Trigger: Single sentence describing what prompted this report
[REQUIRED] State: Current system state in <= 3 points
[REQUIRED] Impact: Direct effect on system/process
---END core---

---START analysis--- [MAX_ITEMS: 3]
[REQUIRED] Root Cause: Primary factor
[OPTIONAL] Contributing Factors: Secondary elements
[REQUIRED] Resolution: Action taken/needed
---END analysis---

---START prevention--- [MAX_ITEMS: 3]
[REQUIRED] Detection: How to identify earlier
[REQUIRED] Mitigation: How to prevent
[OPTIONAL] Monitoring: Key indicators to watch
---END prevention---

[STOP] No additional sections

## Output Location
Reports MUST be placed in: `02-implementation-docs/ai-reports/[TYPE]/`
Example: `02-implementation-docs/ai-reports/errors/AI-ERROR-2024-12-30-001.md` 