---
project: lcs-core
last_session: 2026-07-21
status: in_progress
current_src: SRC-240721-lcs-core-revision
---

# Context: LCS Core

## What we're building
A minimal session handoff & tracking system for personal coding projects. The `.lcscore/` directory provides AI agents with persistent context across sessions — CONTEXT.md for resume, RULES.md for consistency, ROADMAP.md for priorities, work-items/ for all per-task artifacts, and state.md for git-derived progress tracking.

## Where we stopped
Revising lcs-core SKILL.md — added coding gate, artifact consistency contract, work-items folder convention. Folder structure simplified: `decisions/` and `explore/` replaced by `work-items/{YYMMDD-slug}/` with flat artifact files.

## Files being worked on
- `skills/lcs-core/SKILL.md` — updated with coding gate, artifact contract, work-items convention
- `README.md` — updated directory tree and file references
- `.lcscore/ROADMAP.md` — added revision row
- `.lcscore/CONTEXT.md` — session handoff

## Key decisions made
- SOT: `.lcscore/` directory name
- Git log = SOT, state.md derived from it
- No-coding gate: coding only after user explicit "go", except autopilot
- Artifact contract: YAML frontmatter + type registry + writing safety + handoff section
- Flat folder: all artifacts per work item in `work-items/{YYMMDD-slug}/` (no subfolders)
- Old `decisions/` and `explore/` dirs preserved for historical reference

## Architecture
```
.lcscore/
├── CONTEXT.md    ← session handoff (AI writes + reads)
├── RULES.md      ← coding rules (user writes once, AI reads)
├── ROADMAP.md    ← project roadmap (user maintains)
├── state.md      ← derived from git log (auto-generated)
└── work-items/   ← per-task artifacts: explore.md, decisions.md, prd.md, task.md
```

## Current blockers / open questions
- None

## Next action
Complete final verification wave for lcs-core-revision.

## Relevant files
- `skills/lcs-core/SKILL.md`
- `.lcscore/CONTEXT.md`
- `.lcscore/ROADMAP.md`
- `README.md`
