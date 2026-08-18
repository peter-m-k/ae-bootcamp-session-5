---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Exercise Step

Execute the activity instructions from a GitHub Issue exercise step systematically.

## Input

**Issue Number** (optional): ${input:issue-number:Enter issue number (or leave empty to auto-detect)}

## Instructions

### Step 1: Locate the Exercise Issue

If the issue number was not provided:
1. Use `gh issue list --state open` to find the main exercise issue
2. Look for an issue with "Exercise:" in the title
3. Extract the issue number

If the issue number was provided, use it directly.

### Step 2: Get Issue Content with Comments

Retrieve the full issue with all comments:

```bash
gh issue view <issue-number> --comments
```

The issue structure typically includes:
- Main description with exercise overview
- Comments containing step-by-step instructions
- Each step has `:keyboard: Activity:` sections

### Step 3: Parse the Latest Step

1. Read through the issue comments to identify the current/latest step
2. Look for headers like "# Step X-Y:" or similar
3. Extract all `:keyboard: Activity:` sections from that step
4. Note any specific requirements or constraints mentioned

### Step 4: Execute Activities Systematically

For each `:keyboard: Activity:` section:

1. **Understand the requirement** - Read the activity description carefully
2. **Apply TDD workflow** - Follow Red-Green-Refactor cycle (write tests first, then implementation)
3. **Make incremental changes** - Small, testable modifications
4. **Run tests frequently** - Verify each change with `npm test`
5. **Document findings** - Note patterns in `.github/memory/scratch/working-notes.md`

**CRITICAL SCOPE BOUNDARIES**:

- ✅ **DO**: Write unit tests (Jest, React Testing Library)
- ✅ **DO**: Write integration tests (Supertest for API)
- ✅ **DO**: Implement features using TDD
- ✅ **DO**: Fix failing tests
- ❌ **DO NOT**: Create Playwright UI tests in this prompt
- ❌ **DO NOT**: Run Playwright UI tests in this prompt
- ❌ **DO NOT**: Commit or push changes in this prompt

**Handoff Rules**:

- For Playwright UI test creation → Use `/create-ui-tests` prompt (auto-switches to test-engineer)
- For running UI tests → Use `/run-ui-tests` prompt (auto-switches to test-engineer)
- For committing and pushing → Use `/commit-and-push` prompt
- For validation → Use `/validate-step` prompt (auto-switches to code-reviewer)

### Step 5: Verify Implementation

After completing all activities:

1. **Run all tests** - Ensure unit and integration tests pass
   ```bash
   npm test
   ```

2. **Check for lint errors** - Run linting (but don't fix in this step)
   ```bash
   npm run lint
   ```

3. **Manual browser verification** - If applicable, test in browser

### Step 6: Provide Next Steps

**IMPORTANT**: Stop after completing activities and provide the correct next commands based on the step requirements.

**Decision Tree**:

If the current step includes Playwright UI test requirements:
1. **Next**: `/create-ui-tests` (to create UI tests)
2. **Then**: `/run-ui-tests` (to run and verify UI tests)
3. **Finally**: `/validate-step {step-number}` (to validate success criteria)
4. **Last**: `/commit-and-push {branch-name}` (after validation passes)

If the current step does NOT include Playwright UI test requirements:
1. **Next**: `/validate-step {step-number}` (to validate success criteria)
2. **Then**: `/commit-and-push {branch-name}` (after validation passes)

**NEVER recommend `/validate-step` before completing required UI test workflows.**

### Step 7: Document Session

Record key findings in `.github/memory/scratch/working-notes.md`:
- What was implemented
- Patterns discovered
- Decisions made
- Any blockers encountered

## Example Flow

```
User: /execute-step

Agent:
"I'll execute the current exercise step instructions.

**Step 1: Located Exercise Issue**
Found issue #5: "Exercise: Build TODO Application"

**Step 2: Retrieved Issue Content**
Current step: Step 5-1 - Implement DELETE endpoint

**Step 3: Parsed Activities**
:keyboard: Activity 1: Add DELETE /todos/:id endpoint
:keyboard: Activity 2: Write tests for delete functionality
:keyboard: Activity 3: Handle 404 for non-existent todos

**Step 4: Executing Activities**

Activity 1: Writing tests first (TDD - RED phase)
[Writes tests...]

Activity 1: Implementing endpoint (GREEN phase)
[Implements code...]

Activity 1: Running tests
✅ All tests passing

Activity 2: Already completed (tests written in Activity 1)

Activity 3: Adding 404 handling test
[Writes test...]
[Implements error handling...]
✅ Tests passing

**Step 5: Verification**
- All unit tests: ✅ Passing
- Integration tests: ✅ Passing
- Lint check: ⚠️ 2 warnings (address separately)

**Step 6: Next Steps**

This step requires UI testing for the delete functionality.

Next commands in order:
1. `/create-ui-tests` - Create Playwright tests for delete journey
2. `/run-ui-tests` - Run and verify UI tests pass
3. `/validate-step 5-1` - Validate success criteria
4. `/commit-and-push feature/delete-endpoint` - Commit and push changes

**Session Notes**: Documented delete pattern in working-notes.md"
```

## Success Criteria

- [ ] Exercise issue located and parsed
- [ ] All `:keyboard: Activity:` sections completed
- [ ] Tests written BEFORE implementation (TDD)
- [ ] All unit/integration tests passing
- [ ] No Playwright UI tests created/run in this step
- [ ] Session findings documented
- [ ] Correct next steps provided based on requirements

## References

- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Workflow Utilities and Git commands
- [docs/workflow-patterns.md](../../docs/workflow-patterns.md) - TDD workflow guidance
- [.github/agents/tdd-developer.agent.md](../agents/tdd-developer.agent.md) - TDD agent details
