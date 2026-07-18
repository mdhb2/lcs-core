# Coding Rules

## Naming
- Files: kebab-case (`auth-middleware.ts`, not `authMiddleware.ts`)
- Functions: camelCase
- Components: PascalCase
- Variables: camelCase, descriptive (no single letters except loop counters)

## Structure
- 1 file = 1 responsibility — split if doing multiple unrelated things
- Max 200 lines per file (hard limit — split into smaller modules)
- Shared utilities in a shared directory (e.g., `/shared/`, `/utils/`), never copy-pasted
- No circular dependencies — keep imports acyclic

## Testing
- Every new function must have a test
- Test file naming: `*.test.ts`, placed next to the tested file
- Tests must be runnable with a single command (`npm test` or equivalent)
- CI should fail on test failure — no exceptions

## Git
- Commit message format: `SRC-{ID}: imperative description`
- 1 commit = 1 logical change — do not bundle unrelated changes
- Never commit directly to main/master — use feature branches
- Branch naming: `src/YYMMDD-slug`
- Commit early, commit often — small commits are easier to review

## Code Quality
- No `any` in TypeScript — use proper types, `unknown` if truly uncertain
- No unused imports, no unused variables
- Handle errors explicitly — no swallowed exceptions
- Prefer explicit over implicit — readability > cleverness

## Architecture
- No speculative abstractions (YAGNI) — build what's needed, not what might be needed
- Decisions that involve trade-offs MUST be recorded in `.lcs/decisions/`
- Dependencies: add only when necessary, prefer stdlib/native over third-party

## Documentation
- Complex logic needs a comment explaining WHY, not WHAT
- Public APIs need JSDoc comments
- CONTEXT.md must be updated before every session end

## Prohibitions
- No `any` in TypeScript
- No skipping tests for "simple" functions
- No speculative abstractions (YAGNI)
- No files over 200 lines
- No direct commits to main
- No commented-out code — delete it (git remembers)
- No TODO comments without a tracking SRC-ID
