---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
tools: ['read', 'execute', 'todo']
---

# Run UI Tests

Execute Playwright UI tests and provide clear pass/fail summary with failure classification.

## Input

No user input required.

## Instructions

### Step 0: Install Playwright Dependencies (REQUIRED)

**CRITICAL FIRST STEP**: Before running UI tests, install Playwright dependencies.

**Required Command** (run from repository root):
```bash
npm run test:ui:install --workspace=frontend
```

**Why This Is Required**:
- Playwright needs browser binaries (Chromium, Firefox, etc.)
- System dependencies must be installed (Ubuntu/Linux)
- Must run after container rebuilds or fresh environments

**What This Command Does**:
- Runs `playwright install --with-deps chromium`
- Installs Chromium browser and system dependencies
- Includes bounded Ubuntu repository remediation for common Yarn key issues
- Includes one automatic retry for transient failures

**Bounded Remediation**:
- `test:ui:install` now automatically handles the most common Yarn GPG key issue on Ubuntu
- One retry is attempted if the initial install fails
- NO ad-hoc package hunting or broad OS troubleshooting beyond the automated fix
- If install fails after the automated remediation, STOP immediately

**If Installation Fails**:
- ❌ **STOP** - Do not proceed to run tests
- Report environment blocker to user
- Include the failing command and key error lines
- Recommend manual intervention or environment reset
- Do NOT attempt to run Playwright tests after a failed install

**If Installation Succeeds**:
- ✅ **PROCEED** to Step 1

**Note**: This installation is persistent until container rebuild.

### Step 1: Verify Servers Are Running

UI tests require both backend and frontend servers running.

**Check if servers are already running**:
```bash
# Check backend (port 5001)
lsof -i :5001

# Check frontend (port 3000)
lsof -i :3000
```

**If servers are NOT running**:
```bash
# Start from repository root
npm start
```

This starts:
- Backend on http://localhost:5001
- Frontend on http://localhost:3000

**Wait for servers to be ready** (look for "Server started" messages)

**If servers ARE running**:
- ✅ **PROCEED** to Step 2

### Step 2: Run Playwright UI Tests

Execute the UI test suite:

**From repository root**:
```bash
npm run test:ui --workspace=frontend
```

**Or from frontend directory**:
```bash
cd packages/frontend && npm run test:ui
```

**Test execution will**:
- Launch Chromium browser (headless mode)
- Run all test files in `tests/ui/`
- Execute each test scenario
- Report pass/fail results

**Monitor output** for test progress and results.

### Step 3: Capture Test Output

**Typical Output Format**:
```
Running 5 tests using 1 worker

  ✓ should add a new todo (1.2s)
  ✓ should toggle completion status (0.9s)
  ✗ should delete a todo (timeout)
  ✓ should show error for empty input (0.8s)
  ✗ should handle multiple todos (assertion failed)

2 failed
  1) should delete a todo
     Error: Timeout 5000ms exceeded waiting for selector '[data-testid="delete-button"]'
  
  2) should handle multiple todos
     Error: expect(received).toBe(expected)
     Expected: 2
     Received: 3

3 passed (4.5s)
```

**Extract Key Information**:
- Total tests run
- Number passed
- Number failed
- Execution time
- Failure details (error messages, stack traces)

### Step 4: Summarize Pass/Fail Results

Provide a clear, concise summary:

**Summary Template**:
```
## UI Test Results

**Overview**:
- Total Tests: X
- ✅ Passed: Y
- ❌ Failed: Z
- ⏱️ Duration: Xs

**Passed Tests**:
1. ✅ should add a new todo (1.2s)
2. ✅ should toggle completion status (0.9s)
3. ✅ should show error for empty input (0.8s)

**Failed Tests**:
1. ❌ should delete a todo
   - Error: Selector timeout
   - Details: '[data-testid="delete-button"]' not found
   
2. ❌ should handle multiple todos
   - Error: Assertion mismatch
   - Expected: 2 todos remaining
   - Received: 3 todos
```

### Step 5: Classify Test Failures

For each failed test, determine the likely root cause:

**Classification Categories**:

#### 1. Application Defect (Bug in Application Code)
**Indicators**:
- Feature doesn't work as expected
- API returns wrong data/status
- UI doesn't update correctly
- Business logic error

**Example**:
```
Test: "should delete a todo"
Error: Todo still visible after deletion
Classification: APPLICATION DEFECT
Reasoning: Delete button clicked, but todo remains in list
Evidence: Backend may not be processing DELETE request
Action: Investigate DELETE endpoint implementation
```

#### 2. Test Defect (Bug in Test Code)
**Indicators**:
- Wrong selector
- Incorrect assertion
- Test logic error
- Missing wait/synchronization
- Stale test assumptions

**Example**:
```
Test: "should add a todo"
Error: Timeout waiting for '[data-testid="todo"]'
Classification: TEST DEFECT
Reasoning: Component uses 'todo-item', not 'todo'
Evidence: Selector mismatch in page object
Action: Update selector in TodoPage.js
```

#### 3. Environment Issue (Infrastructure Problem)
**Indicators**:
- Server not running
- Port conflict
- Network timeout
- Missing dependencies
- Browser crash

**Example**:
```
Test: "should load app"
Error: page.goto: net::ERR_CONNECTION_REFUSED
Classification: ENVIRONMENT ISSUE
Reasoning: Cannot connect to http://localhost:3000
Evidence: Frontend server not running
Action: Start servers with 'npm start'
```

### Step 6: Provide Failure Analysis

For each failed test, provide detailed analysis:

**Analysis Template**:
```markdown
### Failed Test: [Test Name]

**Error Message**:
```
[Exact error from test output]
```

**Classification**: [Application Defect | Test Defect | Environment Issue]

**Reasoning**:
[Why this classification? What evidence supports it?]

**Evidence**:
- [Observation 1]
- [Observation 2]
- [Relevant code or behavior]

**Recommended Fix**:
1. [Specific action to take]
2. [File to modify or check]
3. [How to verify the fix]

**Priority**: [High | Medium | Low]
```

### Step 7: Recommend Next Actions

Based on test results, provide clear next steps:

**If all tests pass**:
```
✅ All UI tests passing!

Next steps:
1. Validate step completion: `/validate-step {step-number}`
2. Commit changes: `/commit-and-push {branch-name}`
```

**If tests fail**:
```
❌ Some UI tests failing - Action required

Failures by priority:

High Priority (Application Defects):
1. Fix DELETE endpoint logic in backend
2. Update todo deletion handler

Medium Priority (Test Defects):
1. Update selector in TodoPage.js
2. Fix assertion in multiple todos test

Low Priority (Environment Issues):
1. Verify servers are running
2. Check for port conflicts

Recommended workflow:
1. Fix application defects first (use @tdd-developer)
2. Fix test defects (use @test-engineer)
3. Resolve environment issues
4. Re-run: `/run-ui-tests`
5. Validate when passing: `/validate-step {step-number}`
```

### Step 8: Generate Test Report (Optional)

If available, generate Playwright HTML report:

```bash
cd packages/frontend && npx playwright show-report
```

This opens a detailed HTML report with:
- Test execution timeline
- Screenshots of failures
- Network activity
- Console logs
- Trace viewer

## Failure Triage Examples

### Example 1: Application Defect

```
Test: "should delete a todo"
Error: expect(received).toBe(expected)
       Expected: 0
       Received: 1

Analysis:
- User clicks delete button ✅
- Button click is registered ✅
- DELETE request sent to API ✅
- API returns 204 No Content ✅
- Frontend still shows todo ❌

Classification: APPLICATION DEFECT
Root cause: Frontend doesn't update state after successful deletion
Fix: Add state update in delete handler
File: packages/frontend/src/components/TodoList.js
Priority: High
```

### Example 2: Test Defect

```
Test: "should add a new todo"
Error: Timeout waiting for selector '[data-testid="todo-list-item"]'

Analysis:
- Input field filled correctly ✅
- Add button clicked ✅
- Todo appears in browser ✅
- Test still fails ❌

Classification: TEST DEFECT
Root cause: Component uses 'todo-item', test looks for 'todo-list-item'
Fix: Update selector in page object
File: packages/frontend/tests/ui/pages/TodoPage.js
Change: 'todo-list-item' → 'todo-item'
Priority: Medium
```

### Example 3: Environment Issue

```
Test: "should load app"
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000

Analysis:
- Browser launches ✅
- Tries to navigate ❌
- Connection refused ❌

Classification: ENVIRONMENT ISSUE
Root cause: Frontend server not running on port 3000
Fix: Start development servers
Command: npm start (from root)
Priority: High (blocks all tests)
```

## Example Session

```
User: /run-ui-tests

Agent:
"I'll run the Playwright UI tests and provide a detailed summary.

**Step 0: Install Playwright Dependencies**
Running: npm run test:ui:install --workspace=frontend
✅ Chromium installed successfully
✅ System dependencies installed

**Step 1: Verify Servers**
Checking servers...
✅ Backend running on port 5001
✅ Frontend running on port 3000

**Step 2: Running UI Tests**
Command: npm run test:ui --workspace=frontend

Executing tests...

**Step 3: Test Results**

## UI Test Results

**Overview**:
- Total Tests: 5
- ✅ Passed: 4
- ❌ Failed: 1
- ⏱️ Duration: 4.2s

**Passed Tests**:
1. ✅ should add a new todo (1.2s)
2. ✅ should toggle completion status (0.9s)
3. ✅ should show error for empty input (0.8s)
4. ✅ should handle multiple todos (1.1s)

**Failed Tests**:
1. ❌ should delete a todo (timeout)

**Step 4: Failure Analysis**

### Failed Test: should delete a todo

**Error Message**:
```
Error: Timeout 5000ms exceeded waiting for selector '[data-testid="delete-button"]'
```

**Classification**: TEST DEFECT

**Reasoning**:
The delete button selector is incorrect or the button doesn't have the expected data-testid.

**Evidence**:
- Page loads successfully (other tests pass)
- Todo is created (first part of test succeeds)
- Timeout waiting for delete button suggests selector issue
- Need to verify component has correct data-testid attribute

**Recommended Fix**:
1. Check TodoItem.js component for delete button
2. Verify it has `data-testid="delete-button"`
3. If missing, add the attribute
4. If present with different value, update page object selector
5. Re-run tests

**Priority**: Medium (one test affected, feature may still work)

**Next Actions**:

To fix the test defect:
1. Inspect packages/frontend/src/components/TodoItem.js
2. Add or correct data-testid attribute on delete button
3. Re-run: `/run-ui-tests`

Once all tests pass:
1. Validate step: `/validate-step {step-number}`
2. Commit changes: `/commit-and-push {branch-name}`

Would you like me to help fix the test defect?"
```

## Success Criteria

- [ ] Playwright dependencies installed successfully
- [ ] Backend and frontend servers verified running
- [ ] UI tests executed
- [ ] Test output captured
- [ ] Pass/fail summary provided
- [ ] Failed tests classified by root cause
- [ ] Detailed failure analysis provided
- [ ] Next actions recommended
- [ ] Test report generated (if available)

## Troubleshooting

**If Playwright install fails**:
- ❌ STOP immediately
- Report the environment blocker
- Include failing command and error output
- Do NOT attempt ad-hoc fixes beyond the automated remediation
- Recommend manual intervention

**If servers aren't running**:
```bash
npm start
```

**If tests hang**:
- Check for infinite loops in application code
- Verify selectors match actual DOM
- Check for missing waits in page objects

**If all tests fail**:
- Likely environment issue
- Verify servers are accessible
- Check for port conflicts
- Review browser console logs

## References

- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Testing scope
- [docs/testing-guidelines.md](../../docs/testing-guidelines.md) - Test patterns
- [.github/agents/test-engineer.agent.md](../agents/test-engineer.agent.md) - Test engineer details
- [Playwright Documentation](https://playwright.dev) - Official Playwright docs
