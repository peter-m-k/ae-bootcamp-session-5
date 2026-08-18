---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push Changes

Analyze workspace changes, generate a conventional commit message, and push to a feature branch.

## Input

**Branch Name** (REQUIRED): ${input:branch-name:Enter feature branch name (e.g., feature/add-delete-endpoint)}

## Instructions

### Step 0: Validate Branch Name Provided

If the branch name was not provided:
1. Ask the user for the branch name
2. Explain the format: `feature/<descriptive-name>` or `fix/<descriptive-name>`
3. Wait for user input before proceeding

**DO NOT proceed without a branch name.**

### Step 1: Verify Test Status

Before committing, ensure all tests are passing:

**Check if the current step requires UI tests**:
- If the step included Playwright UI test requirements, verify UI tests have been run successfully
- Option 1: Run `npm run test:ui` now to verify
- Option 2: Require that `/run-ui-tests` was run successfully in the current chat session

**Run all tests**:
```bash
# Run all tests from root
npm test
```

If tests fail:
- ❌ **STOP** - Do not commit failing tests
- Report test failures to user
- Recommend fixing tests before committing

If tests pass:
- ✅ **PROCEED** to next step

### Step 2: Analyze Changes

Review what has changed in the workspace:

```bash
git status
```

```bash
git diff
```

**Categorize changes**:
- New files created
- Modified files
- Deleted files
- File types (backend, frontend, tests, docs, config)

### Step 3: Generate Commit Message

Create a descriptive commit message following conventional commit format:

**Format**: `<type>: <description>`

**Types** (from project conventions):
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Test additions or fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
- `refactor:` - Code restructuring without behavior change

**Guidelines**:
- Use present tense ("add" not "added")
- Keep under 72 characters
- Be specific and descriptive
- Reference the feature/issue if applicable

**Examples**:
- `feat: add DELETE /todos/:id endpoint`
- `test: add integration tests for todo deletion`
- `fix: return 404 when todo not found`
- `chore: update ESLint configuration`
- `docs: add API documentation for delete endpoint`

### Step 4: Create or Switch to Branch

**If branch does not exist**:
```bash
git checkout -b <branch-name>
```

**If branch already exists**:
```bash
git checkout <branch-name>
```

**CRITICAL**: Never commit to `main` or any branch other than the user-provided branch name.

### Step 5: Stage All Changes

Stage all modified, new, and deleted files:

```bash
git add .
```

Confirm staged changes:
```bash
git status
```

### Step 6: Commit with Generated Message

Create the commit:

```bash
git commit -m "<generated-commit-message>"
```

Verify commit was created:
```bash
git log -1
```

### Step 7: Push to Remote Branch

Push the branch to remote:

```bash
git push origin <branch-name>
```

If this is the first push to a new branch:
```bash
git push -u origin <branch-name>
```

### Step 8: Confirm Success

Verify the push succeeded:
```bash
git status
```

Expected output: "Your branch is up to date with 'origin/<branch-name>'"

### Step 9: Provide Next Steps

After successful push, inform the user:

**Completion Summary**:
- ✅ Changes committed to `<branch-name>`
- ✅ Pushed to remote repository
- 📝 Commit message: `<generated-message>`
- 📂 Files changed: X files

**Optional Next Actions**:
1. Create a pull request:
   ```bash
   gh pr create --title "<title>" --body "<description>"
   ```

2. Continue to next exercise step (if applicable)

3. Review changes on GitHub

## Example Flow

```
User: /commit-and-push feature/delete-endpoint

Agent:
"I'll analyze the changes and commit to the feature/delete-endpoint branch.

**Step 1: Test Verification**
Running all tests...
✅ All tests passing (15 passed)

**Step 2: Change Analysis**
Modified files:
- packages/backend/src/app.js (added DELETE route)
- packages/backend/__tests__/app.test.js (added delete tests)

New files:
- None

**Step 3: Generated Commit Message**
`feat: add DELETE /todos/:id endpoint with 404 handling`

Rationale: This is a new feature (feat:) that adds a delete endpoint with proper error handling.

**Step 4: Branch Management**
Creating new branch: feature/delete-endpoint
```bash
git checkout -b feature/delete-endpoint
```
✅ Branch created and checked out

**Step 5: Staging Changes**
```bash
git add .
```
✅ 2 files staged

**Step 6: Committing**
```bash
git commit -m "feat: add DELETE /todos/:id endpoint with 404 handling"
```
✅ Commit created: abc1234

**Step 7: Pushing**
```bash
git push -u origin feature/delete-endpoint
```
✅ Pushed to origin/feature/delete-endpoint

**Step 8: Success Confirmation**
Your branch is up to date with 'origin/feature/delete-endpoint'

**Summary**:
✅ Changes committed to feature/delete-endpoint
✅ Pushed to remote repository
📝 Commit: feat: add DELETE /todos/:id endpoint with 404 handling
📂 Files changed: 2 files

**Optional Next Steps**:
1. Create a pull request: `gh pr create --title "Add DELETE endpoint" --body "Implements todo deletion with 404 handling"`
2. Continue to next exercise step
3. Review changes on GitHub"
```

## Success Criteria

- [ ] Branch name provided by user
- [ ] All tests passing before commit
- [ ] Changes analyzed and categorized
- [ ] Conventional commit message generated
- [ ] Feature branch created or switched to
- [ ] All changes staged
- [ ] Commit created successfully
- [ ] Changes pushed to remote branch
- [ ] Push confirmation received
- [ ] User informed of completion

## Error Handling

**If tests fail**:
- Stop and report failures
- Do not proceed with commit
- Recommend fixing tests first

**If branch already exists**:
- Switch to existing branch
- Warn about uncommitted changes if any
- Ask user if they want to continue

**If push fails**:
- Check for merge conflicts
- Verify remote repository access
- Report specific error to user

## References

- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Git Workflow section
- [docs/workflow-patterns.md](../../docs/workflow-patterns.md) - Development workflows
