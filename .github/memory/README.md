# Memory System

A structured approach for tracking development discoveries, patterns, and decisions during the TODO application development lifecycle.

## Purpose

The memory system helps maintain context across development sessions by:
- **Capturing patterns** discovered during implementation and debugging
- **Recording decisions** made during design and troubleshooting
- **Preserving lessons** learned from test failures and fixes
- **Providing context** for AI-assisted development in future sessions

## Memory Types

This project uses two complementary memory systems:

### 1. Persistent Memory (`.github/copilot-instructions.md`)
**Committed to Git** | **Foundational and stable**

Contains core principles, workflows, and established conventions:
- Project context and architecture
- Development principles (TDD, incremental changes)
- Testing strategies and scope
- Workflow patterns
- Agent usage guidelines
- Git and commit conventions

**When to update**: When project-wide principles, workflows, or conventions change.

### 2. Working Memory (`.github/memory/`)
**Dynamic and evolving** | **Session-specific discoveries**

Contains discoveries, patterns, and active notes from development sessions:
- Historical session summaries
- Accumulated code patterns
- Active session work (ephemeral)

**When to update**: During and after each development session as patterns emerge.

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the memory system
├── session-notes.md             # Historical summaries of completed sessions (COMMITTED)
├── patterns-discovered.md       # Accumulated code patterns and solutions (COMMITTED)
└── scratch/
    ├── .gitignore              # Ignores all files in scratch/ directory
    └── working-notes.md        # Active session notes (NOT COMMITTED)
```

### File Purposes

#### `session-notes.md` (Committed)
**Historical record of completed development sessions**

- Documents what was accomplished in past sessions
- Records key findings and decisions
- Provides searchable history of project evolution
- **Updated at session end**: Summarize completed work
- **Committed to git**: Preserves institutional knowledge

#### `patterns-discovered.md` (Committed)
**Library of recurring code patterns and solutions**

- Documents patterns discovered during development
- Includes context, problem, solution, and examples
- Helps AI provide consistent suggestions
- **Updated when**: New pattern emerges or existing pattern evolves
- **Committed to git**: Shared knowledge across team

#### `scratch/working-notes.md` (NOT Committed)
**Ephemeral notes for active development session**

- Tracks current task, approach, and progress
- Records real-time findings and decisions
- Lists blockers and next steps
- **Updated continuously**: Throughout active session
- **NOT committed to git**: Personal workspace (via `.gitignore`)
- **At session end**: Extract key findings to `session-notes.md` and `patterns-discovered.md`

## How to Use During Development

### During TDD Workflow

**As you work** (`scratch/working-notes.md`):
- Note failing test patterns
- Record RED → GREEN → REFACTOR insights
- Track edge cases discovered
- Document test data patterns

**At session end** (`session-notes.md`, `patterns-discovered.md`):
- Summarize which features were implemented
- Document test patterns that worked well
- Record any TDD anti-patterns to avoid

### During Code Quality/Linting

**As you work** (`scratch/working-notes.md`):
- Note recurring lint error categories
- Track systematic fixes applied
- Record exceptions and their justifications

**At session end** (`patterns-discovered.md`):
- Document linting patterns to follow
- Record common mistakes and their fixes

### During Debugging

**As you work** (`scratch/working-notes.md`):
- Capture error messages and stack traces
- Note hypothesis → test → result cycle
- Track root cause analysis steps
- Record the final solution

**At session end** (`session-notes.md`, `patterns-discovered.md`):
- Summarize the bug and its root cause
- Document the fix and why it worked
- Add to patterns if it's a recurring issue type

### During Integration/UI Testing

**As you work** (`scratch/working-notes.md`):
- Note test failures and their patterns
- Track selector strategies
- Record timing/wait strategies that work

**At session end** (`patterns-discovered.md`):
- Document stable selector patterns
- Record successful wait strategies
- Note integration gotchas

## How AI Uses This Memory

When you work with GitHub Copilot in this workspace:

1. **AI reads persistent memory** (`.github/copilot-instructions.md`) automatically
   - Understands project principles and workflows
   - Applies established conventions

2. **AI reads working memory** (`.github/memory/`) when relevant
   - References past session discoveries
   - Applies documented patterns
   - Avoids previously identified anti-patterns

3. **AI helps maintain memory**
   - Can suggest updates to `patterns-discovered.md`
   - Can help summarize `scratch/working-notes.md` into `session-notes.md`
   - Reminds you to document significant findings

## Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ DURING SESSION                                              │
├─────────────────────────────────────────────────────────────┤
│ 1. Work on feature/bug/test                                 │
│ 2. Take notes in scratch/working-notes.md                   │
│    - Current task and approach                              │
│    - Key findings as they emerge                            │
│    - Decisions and blockers                                 │
│ 3. Continue until session complete                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ END OF SESSION                                              │
├─────────────────────────────────────────────────────────────┤
│ 1. Review scratch/working-notes.md                          │
│ 2. Extract key findings → session-notes.md                  │
│ 3. Extract patterns → patterns-discovered.md                │
│ 4. Commit session-notes.md and patterns-discovered.md       │
│ 5. Clear or archive scratch/working-notes.md                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ NEXT SESSION                                                │
├─────────────────────────────────────────────────────────────┤
│ AI references committed memory files for context            │
│ You start fresh scratch/working-notes.md                    │
└─────────────────────────────────────────────────────────────┘
```

## Benefits

- **Continuity**: Maintain context across sessions
- **Pattern Recognition**: Document and reuse successful approaches
- **Efficiency**: Avoid repeating past mistakes
- **AI Context**: Provide rich context for better AI suggestions
- **Knowledge Base**: Build institutional knowledge over time
- **Separation**: Keep ephemeral notes separate from committed history

## Getting Started

1. **Start a new session**: Open `scratch/working-notes.md` and fill in "Current Task"
2. **Work and document**: Take notes as you discover patterns and make decisions
3. **End the session**: Summarize key findings into `session-notes.md` and `patterns-discovered.md`
4. **Commit**: Stage and commit the updated memory files (excluding `scratch/`)
5. **Next session**: AI will reference your documented patterns automatically

---

*This memory system evolves with your project. Update these files as you discover better patterns and practices.*
