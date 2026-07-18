---
project: lcs-core
last_session: 2026-07-18
status: done
current_src: SRC-240718-bootstrap-lcs-core
---

# Context: LCS Core

## What we're building
A minimal session handoff & tracking system for personal coding projects. The `.lcscore/` directory provides AI agents with persistent context across sessions — CONTEXT.md for resume, RULES.md for consistency, ROADMAP.md for priorities, decisions/ for architectural memory, and state.md for git-derived progress tracking.

## Where we stopped
Phase 1 core files written: CONTEXT.md, RULES.md, ROADMAP.md, SKILL.md, generate-state.ps1. SKILL.md installed to ~/.config/opencode/skills/lcs-core/. All files committed as SRC-240718-bootstrap-lcs-core.

## Files being worked on
- `lcs-core-prd.md` — PRD v2 (done, approved)
- `.lcscore/CONTEXT.md` — session handoff (writing now)
- `.lcscore/RULES.md` — coding rules (writing now)
- `.lcscore/ROADMAP.md` — project roadmap (writing now)
- `lcs-core/SKILL.md` — auto-load trigger (writing next)
- `lcs-core/scripts/generate-state.ps1` — state.md generator (done)

## Key decisions made
- Git log = SOT, state.md derived from it — never manually maintained
- OpenCode-only for v1 — no multi-platform support yet
- Handoff via CONTEXT.md (not state.md) — context-first design
- Decision log MANDATORY for non-trivial choices — arch, libraries, patterns, trade-offs
- Explore protocol: batch 3 questions at once with recommendations (decision board pattern)
- SRC-ID format: SRC-{YYMMDD}-{slug}, max 5 words, no rename on done

## Architecture
```
.lcscore/
├── CONTEXT.md    ← session handoff (AI writes + reads)
├── RULES.md      ← coding rules (user writes once, AI reads)
├── ROADMAP.md    ← project roadmap (user maintains)
├── state.md      ← derived from git log (auto-generated)
├── decisions/    ← mandatory decision log
└── explore/      ← exploration memos
```

## Current blockers / open questions
- None — PRD is finalized, implementation is straightforward

## Next action
N/A — Phase 1 core files complete and committed. Next: test with 3 consecutive sessions (SRC-240718-session-test), then P2 items.

## Relevant files
- `lcs-core-prd.md`
- `.lcscore/CONTEXT.md`
- `.lcscore/RULES.md`
- `.lcscore/ROADMAP.md`
