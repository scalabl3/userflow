# AI Development Focus Tips

## Red Flags - Stop and Think
1. Making assumptions without specification backing
2. Modifying the same code multiple times
3. Making up formats/patterns that aren't required
4. Writing validation for non-existent requirements
5. Changing multiple files before verifying first change works
6. Getting overwhelmed by multiple test failures
7. Losing systematic approach when facing many issues

## Process Checklist Before Making Changes
1. Read specifications completely
2. Document unclear requirements and get clarification
3. Plan minimal changes needed
4. Consider impact on other files/tests
5. Update todo list with specific steps
6. Track progress systematically

## Code Economy Principles
1. Only implement what's explicitly required
2. Make minimal, precise changes
3. Avoid premature optimization
4. Don't invent requirements
5. Keep changes focused and atomic

## Quality Gates
1. Read specification twice before coding
2. Review own changes before proceeding
3. Run tests after each atomic change
4. Update documentation/todo list after each step
5. Track what files were modified and why

## Warning Signs of Poor Process
1. "This format looks good" without specification
2. "We might need this later"
3. "While I'm here, I'll just add..."
4. Modifying multiple files without clear plan
5. Making changes that might need to be undone
6. Losing track of what files were changed
7. Not updating todo list consistently
8. Making reactive changes to failing tests without a plan

## Best Practices
1. Keep todo list updated after EVERY change
2. Document decisions and why they were made
3. Track file changes systematically
4. Run tests frequently
5. Review changes before moving to next task
6. Stay focused on current task
7. Don't mix feature work with cleanup

## When You Notice Code Churn
1. Stop immediately
2. Review specifications
3. Check todo list
4. Verify each change was necessary
5. Document why changes were needed
6. Consider if changes can be simplified
7. Update process to prevent recurrence

## Handling Multiple Test Failures
1. Don't panic - maintain systematic approach
2. List all failures and categorize them
3. Identify root causes before making changes
4. Prioritize fixes based on dependencies
5. Work on one category at a time
6. Keep tracking progress in todo list
7. Verify each fix before moving to next
8. Don't make assumptions about fixes needed
9. Return to one-class-at-a-time approach when possible 