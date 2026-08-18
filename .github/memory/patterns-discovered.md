# Patterns Discovered

A living library of code patterns, solutions, and practices discovered during TODO application development.

**Purpose**: Document recurring patterns for consistency and reference.

**Update frequency**: When new patterns emerge or existing patterns evolve.

**Committed to git**: Yes - shared knowledge across team.

---

## Pattern Template

Use this template when documenting a new pattern:

```markdown
### Pattern Name

**Context**: When/where this pattern applies

**Problem**: What challenge or issue this pattern addresses

**Solution**: How to implement this pattern

**Example**:
```language
// Code example demonstrating the pattern
```

**Related Files**: List of files where this pattern is used

**Notes**: Additional considerations, trade-offs, or alternatives
```

---

## Discovered Patterns

### Service Initialization - Empty Array vs Null

**Context**: Initializing in-memory data stores in backend services

**Problem**: When initializing an in-memory array for storing entities (like todos), should we start with an empty array `[]` or `null`?

**Solution**: Always initialize with an empty array `[]` rather than `null`

**Rationale**:
- Prevents `Cannot read property 'length' of null` errors
- Eliminates need for null checks before array operations
- Provides consistent initial state
- Simplifies test setup and assertions

**Example**:
```javascript
// ✅ GOOD: Initialize with empty array
class TodoService {
  constructor() {
    this.todos = [];  // Safe to use .push(), .filter(), .map() immediately
  }
}

// ❌ BAD: Initialize with null
class TodoService {
  constructor() {
    this.todos = null;  // Requires null checks before every operation
  }
  
  addTodo(todo) {
    if (!this.todos) {  // Extra null check needed
      this.todos = [];
    }
    this.todos.push(todo);
  }
}
```

**Related Files**:
- `packages/backend/src/services/todoService.js` (when created)
- Backend service tests

**Notes**:
- This pattern applies to all in-memory collections
- If using a database, the pattern may differ (initialized externally)
- Empty arrays are falsy-safe: `if (todos.length)` works correctly

---

*Add new patterns below as they are discovered during development. Keep patterns concise and include practical examples.*
