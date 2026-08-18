# GitHub Copilot Instructions

Global workspace instructions for the TODO application project.

## Project Context

This is a full-stack TODO application with a React frontend and Express backend. The project emphasizes iterative, feedback-driven development with a strong focus on test-driven practices.

**Current Phase**: Backend stabilization and frontend feature completion

**Key Characteristics**:
- Monorepo structure with `packages/backend` and `packages/frontend`
- Iterative development with continuous testing and validation
- TDD-first approach for all feature work

## Documentation References

Refer to these documents for detailed project guidance:

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and project structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

Follow these core principles throughout development:

1. **Test-Driven Development**: Follow the Red-Green-Refactor cycle
   - Write tests first (RED)
   - Implement minimal code to pass (GREEN)
   - Refactor for quality (REFACTOR)

2. **Incremental Changes**: Make small, testable modifications
   - One feature or fix at a time
   - Validate each change before moving forward

3. **Systematic Debugging**: Use test failures as guides
   - Read error messages carefully
   - Isolate the failure
   - Fix and verify

4. **Validation Before Commit**: Ensure quality gates pass
   - All tests pass (unit, integration, UI)
   - No lint errors
   - Code follows project conventions

## Testing Scope

This project uses a comprehensive testing strategy combining fast feedback with end-to-end confidence:

**Testing Layers**:
- **Backend**: Jest + Supertest for API testing
- **Frontend Components**: React Testing Library for component unit/integration tests
- **UI End-to-End**: Playwright for critical user journey automation
- **Manual Testing**: Browser testing for exploratory validation and visual checks

**Why This Approach**: Combine fast feedback loops (unit/integration) with end-to-end quality confidence (UI tests).

### Testing Approach by Context

**Backend API Changes**:
- Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- Use Supertest for HTTP endpoint testing
- Validate responses, status codes, and error handling

**Frontend Component Features**:
- Write React Testing Library tests FIRST for component behavior (RED-GREEN-REFACTOR)
- Test user interactions, rendering, and state changes
- Follow with manual browser testing for full UI flows

**Critical User Journeys**:
- Create Playwright UI tests for end-to-end validation
- Test complete workflows (e.g., add todo → mark complete → delete)
- Run regularly to catch integration issues

**This is true TDD**: Test first, then code to pass the test.

## Workflow Patterns

Follow these established workflows for different development activities:

### 1. TDD Workflow
Write/fix tests → Run tests → See failure (RED) → Implement code → Tests pass (GREEN) → Refactor → Validate

### 2. Code Quality Workflow
Run lint → Categorize issues → Fix systematically → Re-validate → Commit clean code

### 3. Integration Workflow
Identify issue → Debug with tests → Write/update tests → Fix implementation → Verify end-to-end

### 4. UI Testing Workflow
Define critical journeys → Create UI tests → Run tests → Debug failures → Validate coverage → Maintain test suite

## Agent Usage

This project uses specialized agent modes for different workflows. Use the appropriate mode for each task:

**tdd-developer** (Default development mode):
- Implementation of features following TDD cycles
- Writing and running unit and integration tests
- Backend API development with Jest + Supertest
- Frontend component development with React Testing Library
- **Note**: Do NOT create or run Playwright UI tests in this mode

**code-reviewer**:
- Addressing lint errors and warnings
- Code quality improvements
- Style consistency enforcement
- Refactoring for maintainability

**test-engineer**:
- All Playwright UI test authoring and execution
- UI test failure triage and debugging
- Test isolation and stability checks
- End-to-end test coverage validation

## Memory System

This project uses a two-tier memory system to maintain context across development sessions:

**Persistent Memory** (`.github/copilot-instructions.md`):
- Foundational principles and workflows (this file)
- Project-wide conventions and standards
- Stable and infrequently changed

**Working Memory** (`.github/memory/`):
- Development discoveries and patterns
- Historical session summaries
- Active session notes (ephemeral)

**How to Use**:
- During active development, take notes in `.github/memory/scratch/working-notes.md` (NOT committed)
- At end of session, summarize key findings into `.github/memory/session-notes.md` (committed)
- Document recurring code patterns in `.github/memory/patterns-discovered.md` (committed)
- AI references these files when providing context-aware suggestions

**Memory Files**:
- [.github/memory/README.md](memory/README.md) - Comprehensive memory system documentation
- [.github/memory/session-notes.md](memory/session-notes.md) - Historical session summaries
- [.github/memory/patterns-discovered.md](memory/patterns-discovered.md) - Code patterns library
- `.github/memory/scratch/working-notes.md` - Active session work (ignored by git)

## Workflow Utilities

GitHub CLI commands are available for workflow automation (use in any mode):

**List open issues**:
```bash
gh issue list --state open
```

**Get issue details**:
```bash
gh issue view <issue-number>
```

**Get issue with comments**:
```bash
gh issue view <issue-number> --comments
```

**Finding Exercise Steps**:
- The main exercise issue will have "Exercise:" in the title
- Steps are posted as comments on the main issue
- Use these commands when `/execute-step` or `/validate-step` prompts are invoked

## Git Workflow

Follow these Git conventions for consistent version control:

**Conventional Commits**:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
- `test:` - Test additions or fixes
- `refactor:` - Code restructuring without behavior change

**Branch Strategy**:
- Feature branches: `feature/<descriptive-name>`
- Bug fix branches: `fix/<descriptive-name>`
- Always branch from `main`

**Commit Workflow**:
1. Stage all changes: `git add .`
2. Commit with conventional format: `git commit -m "feat: add todo filtering"`
3. Push to correct branch: `git push origin <branch-name>`

**Best Practices**:
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Verify all tests pass before pushing
- Review changes before committing
