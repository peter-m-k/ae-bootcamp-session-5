---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests

Generate Playwright UI tests for critical user journeys with focus on stability and maintainability.

## Input

**User Journeys** (optional): ${input:journeys:Enter journeys to test (or leave empty for default set)}

## Instructions

### Step 0: Determine Test Scope

**Default Journeys** (if none specified):
- Create todo (add new item)
- Edit todo (update text)
- Toggle todo (mark complete/incomplete)
- Delete todo (remove item)
- Core error-state handling (empty input, not found)

**HARD LIMIT**: Create a maximum of 5 Playwright test cases for this run

**Target**: 3-5 total test cases
- Include at least 1 error-path test within the 3-5 total
- If more than 5 candidate scenarios exist, select the highest-risk 5
- List deferred scenarios instead of creating additional tests beyond 5

**Prioritization Criteria** (when limiting to 5):
1. Core CRUD operations (create, read, update, delete)
2. Critical error states (validation, not found, server errors)
3. High-frequency user workflows
4. High-risk integration points

### Step 1: Analyze Existing Tests

Check for existing UI test infrastructure:

```bash
# Look for existing Playwright tests
ls packages/frontend/tests/ui/

# Check if page objects exist
ls packages/frontend/tests/ui/pages/
```

**Determine**:
- What tests already exist?
- What page objects are available?
- What selectors are already defined?
- What journeys still need coverage?

### Step 2: Design Test Structure

**Apply Page Object Model (POM)**:

**Principle**: Separate UI interactions from test assertions

**Structure**:
```
packages/frontend/tests/ui/
├── pages/
│   └── TodoPage.js          # Reusable selectors and methods
└── e2e.spec.js              # Test scenarios with assertions
```

**Page Object Responsibilities**:
- Define selectors (data-testid attributes)
- Encapsulate UI interaction methods
- Provide helper functions for common operations
- Handle waits and synchronization

**Test File Responsibilities**:
- Describe test scenarios
- Set up test data
- Call page object methods
- Assert expected outcomes

### Step 3: Create or Update Page Objects

**Page Object Example**:

```javascript
// packages/frontend/tests/ui/pages/TodoPage.js
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors (stable data-testid attributes)
    this.todoInput = '[data-testid="todo-input"]';
    this.addButton = '[data-testid="add-button"]';
    this.todoItem = '[data-testid="todo-item"]';
    this.todoCheckbox = '[data-testid="todo-checkbox"]';
    this.deleteButton = '[data-testid="delete-button"]';
    this.editButton = '[data-testid="edit-button"]';
    this.saveButton = '[data-testid="save-button"]';
    this.errorMessage = '[data-testid="error-message"]';
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
    // Wait for app to be ready
    await this.page.waitForSelector(this.todoInput);
  }

  async addTodo(text) {
    await this.page.fill(this.todoInput, text);
    await this.page.click(this.addButton);
    // Wait for todo to appear (state-based wait)
    await this.page.waitForSelector(`${this.todoItem}:has-text("${text}")`);
  }

  async toggleTodo(index) {
    const checkbox = this.page.locator(this.todoCheckbox).nth(index);
    await checkbox.click();
  }

  async deleteTodo(index) {
    const deleteBtn = this.page.locator(this.deleteButton).nth(index);
    await deleteBtn.click();
  }

  async getTodoCount() {
    return await this.page.locator(this.todoItem).count();
  }

  async getTodoText(index) {
    const todo = this.page.locator(this.todoItem).nth(index);
    return await todo.textContent();
  }

  async getErrorMessage() {
    const error = this.page.locator(this.errorMessage);
    return await error.textContent();
  }
}

module.exports = { TodoPage };
```

**Key POM Principles**:
- ✅ Selectors defined once, used many times
- ✅ State-based waits (not arbitrary timeouts)
- ✅ Stable selectors (data-testid, roles)
- ✅ Reusable interaction methods
- ✅ Easy to maintain and update

### Step 4: Create Test Scenarios

**Test File Structure**:

```javascript
// packages/frontend/tests/ui/e2e.spec.js
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('Todo Application', () => {
  let todoPage;

  // Fresh page for each test (isolation)
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  // Test 1: Create todo (happy path)
  test('should add a new todo', async () => {
    await todoPage.addTodo('Buy groceries');
    
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1);
    
    const text = await todoPage.getTodoText(0);
    expect(text).toContain('Buy groceries');
  });

  // Test 2: Toggle todo completion
  test('should toggle todo completion status', async () => {
    await todoPage.addTodo('Complete task');
    await todoPage.toggleTodo(0);
    
    const todo = page.locator('[data-testid="todo-item"]').first();
    await expect(todo).toHaveClass(/completed/);
  });

  // Test 3: Delete todo
  test('should delete a todo', async () => {
    await todoPage.addTodo('Task to delete');
    expect(await todoPage.getTodoCount()).toBe(1);
    
    await todoPage.deleteTodo(0);
    expect(await todoPage.getTodoCount()).toBe(0);
  });

  // Test 4: Error handling (error-path test)
  test('should show error for empty todo input', async ({ page }) => {
    await todoPage.addTodo(''); // Attempt empty todo
    
    const errorMsg = await todoPage.getErrorMessage();
    expect(errorMsg).toContain('required');
  });

  // Test 5: Multiple operations
  test('should handle multiple todos correctly', async () => {
    await todoPage.addTodo('First task');
    await todoPage.addTodo('Second task');
    await todoPage.addTodo('Third task');
    
    expect(await todoPage.getTodoCount()).toBe(3);
    
    await todoPage.deleteTodo(1); // Delete middle one
    expect(await todoPage.getTodoCount()).toBe(2);
    
    const firstText = await todoPage.getTodoText(0);
    expect(firstText).toContain('First task');
  });
});
```

**Test Quality Checklist**:
- ✅ Descriptive test names (intent is clear)
- ✅ Isolated tests (each test independent)
- ✅ Stable selectors (data-testid)
- ✅ State-based waits (no timeouts)
- ✅ Focused assertions (one concept per test)
- ✅ Error cases included

### Step 5: Add data-testid Attributes (If Needed)

If components lack test hooks, add data-testid attributes:

**React Component Example**:
```javascript
// src/components/TodoItem.js
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li data-testid="todo-item">
      <input
        type="checkbox"
        data-testid="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button 
        data-testid="delete-button"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>
    </li>
  );
}
```

### Step 6: Verify Test Count

**CRITICAL**: Before finishing, count the authored test cases:

```javascript
// Count test() or it() calls in the spec file
// Example: 5 test cases found
test('should add a new todo', ...)           // 1
test('should toggle todo completion', ...)   // 2
test('should delete a todo', ...)            // 3
test('should show error for empty input', ...)  // 4
test('should handle multiple todos', ...)    // 5
```

**If count > 5**:
- ❌ STOP and reduce to exactly 5 tests
- Keep highest-priority tests
- List deferred scenarios

**If count ≤ 5**:
- ✅ PROCEED to reporting

**DO NOT claim "small scope" if final count > 5**

### Step 7: Report Test Coverage

Provide a clear summary of what was created:

**Coverage Report Format**:
```
## UI Test Coverage Created

### Page Objects
- ✅ Created/Updated: TodoPage.js
  - Selectors: 7 defined
  - Methods: 6 interaction methods

### Test Scenarios (X/5 tests created)
1. ✅ Create todo (happy path)
2. ✅ Toggle completion status
3. ✅ Delete todo
4. ✅ Error handling for empty input
5. ✅ Multiple todo operations

### Files Modified
- packages/frontend/tests/ui/pages/TodoPage.js (created/updated)
- packages/frontend/tests/ui/e2e.spec.js (5 tests added)
- packages/frontend/src/components/TodoItem.js (added data-testid attributes)

### Deferred Scenarios (if applicable)
- Edit todo text (lower priority)
- Filter by status (lower priority)
- Browser refresh persistence (lower priority)

### Next Steps
Run UI tests to verify: `/run-ui-tests`
```

## Test Quality Principles

### Stable Selectors Priority
1. **data-testid** - Explicit test hooks (best)
2. **ARIA roles/labels** - Accessibility-first
3. **Text content** - For unique text
4. **CSS classes** - Avoid styling classes
5. **XPath** - Last resort

### State-Based Waits
```javascript
// ❌ BAD: Arbitrary timeout
await page.waitForTimeout(500);

// ✅ GOOD: Wait for state
await page.waitForSelector('[data-testid="todo-item"]');

// ✅ BETTER: Playwright auto-waiting
await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(1);
```

### Test Isolation
- Each test is independent
- Can run in any order
- Sets up own test data
- No shared state between tests

### Page Object Model Benefits
- ✅ Single source of truth for selectors
- ✅ Reusable interaction logic
- ✅ Easy to maintain when UI changes
- ✅ Tests focus on scenarios, not implementation

## Example Session

```
User: /create-ui-tests

Agent:
"I'll create Playwright UI tests for the critical todo journeys (max 5 tests).

**Step 1: Analyzed Existing Tests**
- No existing UI tests found
- Need to create page object and test file

**Step 2: Test Structure Design**
Using Page Object Model:
- Page object: TodoPage.js (selectors and methods)
- Test file: e2e.spec.js (scenario assertions)

**Step 3: Created Page Object**
File: packages/frontend/tests/ui/pages/TodoPage.js
- 7 selectors defined (data-testid)
- 6 interaction methods
- State-based waits included

**Step 4: Created Test Scenarios (5 tests)**
File: packages/frontend/tests/ui/e2e.spec.js

1. ✅ should add a new todo (happy path)
2. ✅ should toggle completion status
3. ✅ should delete a todo
4. ✅ should show error for empty input (error-path)
5. ✅ should handle multiple todos

**Step 5: Added data-testid Attributes**
Updated components:
- TodoItem.js (checkbox, delete button)
- TodoInput.js (input field, add button)
- ErrorMessage.js (error display)

**Step 6: Verified Test Count**
Total test cases: 5/5 ✅ (within limit)

**Coverage Summary**:
✅ Create journey
✅ Toggle journey
✅ Delete journey
✅ Error handling (empty input)
✅ Multiple operations

Deferred scenarios (lower priority):
- Edit todo text functionality
- Filter by completion status
- Browser refresh persistence

**Next Steps**:
1. Run UI tests: `/run-ui-tests`
2. Verify all tests pass
3. Fix any failures
4. Validate step: `/validate-step {step-number}`

UI tests are ready to run!"
```

## Success Criteria

- [ ] Test scope determined (default or custom journeys)
- [ ] Maximum 5 test cases created
- [ ] At least 1 error-path test included
- [ ] Page objects created/updated with stable selectors
- [ ] Test scenarios written using page objects
- [ ] State-based waits used (no arbitrary timeouts)
- [ ] Tests are isolated and independent
- [ ] data-testid attributes added to components if needed
- [ ] Test count verified (≤ 5)
- [ ] Coverage report provided
- [ ] Deferred scenarios listed if applicable

## References

- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Testing scope and principles
- [docs/testing-guidelines.md](../../docs/testing-guidelines.md) - Test patterns
- [.github/agents/test-engineer.agent.md](../agents/test-engineer.agent.md) - Test engineer details
