---
project: lcs-core
last_session: 2026-07-18
status: done
current_src: SRC-240718-cli-installer
---

# Context: LCS Core

## What we're building
A minimal session handoff & tracking system for personal coding projects. The `.lcscore/` directory provides AI agents with persistent context across sessions — CONTEXT.md for resume, RULES.md for consistency, ROADMAP.md for priorities, decisions/ for architectural memory, and state.md for git-derived progress tracking.

## Where we stopped
Phase 1 complete. Added npx-based CLI installer (`npx lean-coding-skills add <url>`), English README.md, Autopilot mode, and all core files. Skill installed and ready for session testing.

## Files being worked on
- `lcs-core-prd.md` — PRD v2 (finalized)
- `lcs-core/SKILL.md` — auto-load trigger + autopilot + explore protocol
- `lcs-core/README.md` — English documentation
- `cli/index.js` — npx CLI installer (skills add/list/remove/scaffold)
- `package.json` — npm package config for npx compatibility
- `.lcscore/CONTEXT.md` — session handoff
- `.lcscore/RULES.md` — coding rules
- `.lcscore/ROADMAP.md` — project roadmap
- `lcs-core/scripts/generate-state.ps1` — state.md generator

## Key decisions made
- SOT: `.lcscore/` directory name
- Git log = SOT, state.md derived from it
- OpenCode-only for v1
- Handoff via CONTEXT.md (not state.md)
- Decision log MANDATORY
- Explore: 3-question decision board + layperson translation
- WRITTEN MD: Autopilot mode — Y/N, auto-execute + auto-commit, halt on risk
- WRITTEN MD: npx install via `npx lean-coding-skills add <url>`

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
