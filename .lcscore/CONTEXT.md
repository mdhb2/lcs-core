---
project: lcs-core
last_session: 2026-07-18
status: done
current_src: SRC-240718-autopilot-mode
---

# Context: LCS Core

## What we're building
A minimal session handoff & tracking system for personal coding projects. The `.lcscore/` directory provides AI agents with persistent context across sessions — CONTEXT.md for resume, RULES.md for consistency, ROADMAP.md for priorities, decisions/ for architectural memory, and state.md for git-derived progress tracking.

## Where we stopped
Phase 1 core files complete. Added Autopilot mode to SKILL.md — after Explore, AI asks user "Autopilot mode? (Y/N)". Autopilot auto-executes all tasks with auto-commit, halts only on high-risk/architecture changes. Updated PRD §3.9.1 and explore funnel diagram.

## Files being worked on
- `lcs-core-prd.md` — PRD v2 (updated with autopilot mode spec)
- `lcs-core/SKILL.md` — auto-load trigger (added §3.2-3.3 autopilot protocol)
- `.lcscore/CONTEXT.md` — session handoff (updated)
- `.lcscore/RULES.md` — coding rules (done)
- `.lcscore/ROADMAP.md` — project roadmap (done)
- `lcs-core/scripts/generate-state.ps1` — state.md generator (done)

## Key decisions made
- Git log = SOT, state.md derived from it — never manually maintained
- OpenCode-only for v1 — no multi-platform support yet
- Handoff via CONTEXT.md (not state.md) — context-first design
- Decision log MANDATORY for non-trivial choices
- Explore protocol: batch 3 questions at once with recommendations
- **NEW: Autopilot mode** — after Explore, Y/N. Yes = auto-execute all + auto-commit, halt only on architecture/high-risk changes
- SRC-ID format: SRC-{YYMMDD}-{slug}, max 5 words

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
N/A — Autopilot mode integrated. Next: run session tests (SRC-240718-session-test, SRC-240718-reset-test, SRC-240718-switch-test).

## Relevant files
- `lcs-core-prd.md`
- `.lcscore/CONTEXT.md`
- `.lcscore/RULES.md`
- `.lcscore/ROADMAP.md`
