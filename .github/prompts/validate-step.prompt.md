---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Exercise Step

Verify that all success criteria for a specific exercise step have been met.

## Input

**Step Number** (REQUIRED): ${input:step-number:Enter step number (e.g., 5-0, 5-1, 5-2)}

## Instructions

### Step 1: Locate the Exercise Issue

Use GitHub CLI to find the main exercise issue:

```bash
gh issue list --state open
```

Look for an issue with "Exercise:" in the title and extract the issue number.

### Step 2: Retrieve Issue with Comments

Get the full issue content including all comments:

```bash
gh issue view <issue-number> --comments
```

The issue typically contains:
- Main exercise description
- Comments with step-by-step instructions
- Each step has a "Success Criteria" section

### Step 3: Find the Target Step

Search through the issue content for the specified step:

**Look for**: `# Step ${step-number}:`

**Example patterns**:
- `# Step 5-0: Project Setup`
- `# Step 5-1: Implement GET Endpoint`
- `# Step 5-2: Add POST Functionality`

Extract the complete step section including all subsections.

### Step 4: Extract Success Criteria

Locate the "Success Criteria" section within the target step.

**Typical format**:
```
## Success Criteria

- [ ] Criterion 1: Description
- [ ] Criterion 2: Description
- [ ] Criterion 3: Description
```

Parse all success criteria items from this section.

### Step 5: Validate Each Criterion

For each success criterion, check the current workspace state:

**Common Validation Types**:

**File Existence**:
- Check if required files exist
- Verify file locations match expectations

**Code Implementation**:
- Search for required functions/endpoints
- Verify implementations are correct
- Check for proper error handling

**Tests**:
- Confirm tests exist for new features
- Run test suite: `npm test`
- Verify all tests passing

**Configuration**:
- Check config files (package.json, etc.)
- Verify dependencies installed
- Confirm scripts are defined

**Documentation**:
- Verify README or docs updated
- Check for inline comments where needed

**Linting**:
- Run linter: `npm run lint`
- Check for errors (warnings acceptable)

**Example Validation**:
```
Criterion: "GET /todos endpoint returns 200 status"

Validation steps:
1. Check src/app.js for GET /todos route ✅
2. Check __tests__/app.test.js for corresponding test ✅
3. Run tests: npm test ✅
4. Verify test passes for 200 status ✅

Result: ✅ PASS
```

### Step 6: Report Results

Provide a clear summary of validation results:

**Format**:
```
## Validation Results for Step ${step-number}

### Success Criteria Status

1. [✅|❌] Criterion 1: Description
   - Status: Pass/Fail
   - Evidence: What was checked
   - Notes: Any observations

2. [✅|❌] Criterion 2: Description
   - Status: Pass/Fail
   - Evidence: What was checked
   - Notes: Any observations

[Continue for all criteria...]

### Overall Status

✅ All criteria met - Step ${step-number} complete!

OR

❌ Some criteria not met - See details below:
- Criterion X: [Specific guidance on what's missing]
- Criterion Y: [Specific guidance on how to fix]

### Recommended Actions

1. [Action to complete missing criteria]
2. [Action to verify fixes]
3. [Next command to run]
```

### Step 7: Provide Specific Guidance

If any criteria are not met:

1. **Identify the gap** - What's missing or incorrect?
2. **Explain why it matters** - How does this affect the exercise?
3. **Provide actionable steps** - What needs to be done?
4. **Reference relevant patterns** - Link to docs or examples

**Example**:
```
❌ Test coverage for DELETE endpoint missing

Why: The exercise requires tests for all CRUD operations

What to do:
1. Add test to packages/backend/__tests__/app.test.js:
   ```javascript
   describe('DELETE /todos/:id', () => {
     it('should delete todo and return 204', async () => {
       // Test implementation
     });
   });
   ```
2. Run tests: npm test
3. Re-validate: /validate-step 5-1
```

### Step 8: Document Validation

If appropriate, note validation findings in memory:

- Update `.github/memory/scratch/working-notes.md` with validation results
- Record any patterns discovered during validation
- Note common mistakes or gotchas

## Example Flow

```
User: /validate-step 5-1

Agent:
"I'll validate the success criteria for Step 5-1.

**Step 1: Located Exercise Issue**
Found issue #5: "Exercise: Build TODO Application"

**Step 2: Retrieved Step Content**
Step 5-1: Implement DELETE /todos/:id endpoint

**Step 3: Extracted Success Criteria**
Found 4 success criteria:
1. DELETE endpoint implemented in app.js
2. Tests for successful deletion (204 status)
3. Tests for 404 when todo not found
4. All tests passing

**Step 4: Validation Results**

### Success Criteria Status

1. ✅ DELETE endpoint implemented
   - Evidence: Found `app.delete('/todos/:id', ...)` in packages/backend/src/app.js
   - Notes: Properly handles deletion and returns 204

2. ✅ Tests for successful deletion
   - Evidence: Found test "should delete todo and return 204" in app.test.js
   - Verification: Test passes ✅

3. ✅ Tests for 404 handling
   - Evidence: Found test "should return 404 for non-existent todo" in app.test.js
   - Verification: Test passes ✅

4. ✅ All tests passing
   - Ran: npm test
   - Result: 15/15 tests passed
   - Duration: 2.3s

### Overall Status

✅ **All criteria met - Step 5-1 is complete!**

**Test Summary**:
- Backend tests: 15/15 ✅
- No lint errors
- All functionality verified

**Next Steps**:
Ready to commit and push changes:
```
/commit-and-push feature/delete-endpoint
```

**Congratulations!** Step 5-1 completed successfully."
```

## Incomplete Validation Example

```
User: /validate-step 5-1

Agent:
"I'll validate the success criteria for Step 5-1.

[Steps 1-3 same as above...]

**Step 4: Validation Results**

### Success Criteria Status

1. ✅ DELETE endpoint implemented
   - Evidence: Found in app.js
   
2. ✅ Tests for successful deletion
   - Evidence: Test exists and passes
   
3. ❌ Tests for 404 handling
   - Evidence: No test found for 404 case
   - Missing: Test when todo ID doesn't exist
   
4. ❌ All tests passing (conditional on #3)
   - Current: 14/14 tests passing
   - Missing: 404 test case

### Overall Status

❌ **2 criteria not met**

### Issues to Resolve

**Issue 1: Missing 404 Test**

What's needed:
- Test that verifies 404 status when deleting non-existent todo

How to fix:
1. Add this test to packages/backend/__tests__/app.test.js:
   ```javascript
   it('should return 404 when deleting non-existent todo', async () => {
     const res = await request(app)
       .delete('/todos/nonexistent-id')
       .send();
     expect(res.status).toBe(404);
   });
   ```

2. Run tests to ensure it fails (RED)
3. Update DELETE handler to check if todo exists
4. Run tests to ensure they pass (GREEN)
5. Re-validate: /validate-step 5-1

### Recommended Actions

1. Add missing 404 test case
2. Implement error handling in DELETE endpoint
3. Verify all tests pass
4. Re-run validation: `/validate-step 5-1`

Would you like me to help implement the missing test case?"
```

## Success Criteria

- [ ] Exercise issue located and retrieved
- [ ] Target step found in issue content
- [ ] Success criteria section extracted
- [ ] All criteria validated against workspace
- [ ] Results reported clearly with evidence
- [ ] Specific guidance provided for incomplete items
- [ ] Overall status (complete/incomplete) determined
- [ ] Next actions recommended

## References

- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Workflow Utilities section
- [docs/workflow-patterns.md](../../docs/workflow-patterns.md) - Development workflows
- [.github/agents/code-reviewer.agent.md](../agents/code-reviewer.agent.md) - Code review agent details
