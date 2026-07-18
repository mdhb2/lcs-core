# LCS Core

> **Low-Context Session** — a minimal session handoff and project context system for AI-assisted development.

LCS Core gives an AI agent instant context when you open a fresh coding session. No re-explaining. No re-exploring the codebase. No lost decisions.

```bash
npx skills add https://github.com/mdhb2/lcs-core
```

---

## The Problem

Every fresh AI session starts with zero context. You waste 40-60% of tokens just getting the AI up to speed — re-discovering architecture, re-reading files, and re-asking questions you already answered yesterday.

LCS Core solves this by saving **a small amount of strategic context** (not a log of everything) so the AI can resume work in under 1,000 tokens.

---

## How It Works

```
your-project/
└── .lcscore/                  ← One directory. That's it.
    ├── CONTEXT.md              ← "Where we left off" — read first
    ├── RULES.md                ← Coding standards the AI must follow
    ├── ROADMAP.md              ← Project tasks with priorities
    ├── state.md                ← Auto-generated from git log
    ├── decisions/              ← Architectural decisions (mandatory)
    └── explore/                ← Pre-implementation alignment memos
```

**When you open a new session:**

1. SKILL.md auto-loads in OpenCode
2. AI reads CONTEXT.md (~300 tokens) → knows what you're building and where you stopped
3. AI reads RULES.md → knows the coding standards
4. AI reads ROADMAP.md → knows priorities
5. AI starts working immediately

That's it. No re-explaining. No codebase re-exploration.

---

## Installation

### Prerequisites
- [OpenCode](https://opencode.ai) installed (or Claude Code, Cursor, Windsurf, etc.)
- Node.js 18+ (for `npx`)
- A project with a git repository

### One-Command Install

```bash
npx skills add https://github.com/mdhb2/lcs-core
```

This uses the [skills](https://github.com/vercel-labs/skills) CLI to install LCS Core into your agent's skills directory. Select **opencode** when prompted (or your preferred agent).

**Options:**
```bash
# Install globally (available in all projects)
npx skills add https://github.com/mdhb2/lcs-core -g

# Install to a specific agent
npx skills add https://github.com/mdhb2/lcs-core -a opencode

# Skip prompts
npx skills add https://github.com/mdhb2/lcs-core -y
```

### Scaffold Your Project

After installing the skill, create the `.lcscore/` directory in your project:

```bash
mkdir .lcscore .lcscore/decisions .lcscore/explore
```

Then customize for your project:
- Edit `.lcscore/RULES.md` — your coding standards
- Edit `.lcscore/ROADMAP.md` — your project tasks and priorities
- `.lcscore/CONTEXT.md` — the AI maintains this automatically

### Manual Install

```bash
# 1. Clone the repo
git clone https://github.com/mdhb2/lcs-core.git

# 2. Copy the skill to your agent's skills directory
cp -r lcs-core/skills/lcs-core ~/.config/opencode/skills/lcs-core
```

The skill auto-loads whenever you ask the AI to do coding work in any project that has a `.lcscore/` directory.

---

## File Reference

| File | Written By | Purpose |
|---|---|---|
| **CONTEXT.md** | AI (every session end) | Session handoff — resume point for next session |
| **RULES.md** | You (once) | Coding rules the AI must follow |
| **ROADMAP.md** | You (periodically) | Feature list with priorities |
| **state.md** | Auto-generated | Git-derived progress view |
| **decisions/** | AI (when needed) | Architectural decision log |
| **explore/** | AI (when needed) | Pre-implementation alignment memos |

---

## Key Features

### Session Resume (CONTEXT.md)

Under 100 lines. Read in seconds. The AI immediately knows:
- What you're building
- Where you stopped (file:line)
- What to do next
- Key decisions made
- Active blockers

### Coding Rules Enforcement (RULES.md)

Write once. Enforced in every session. The AI must comply with naming conventions, file structure, testing requirements, git conventions, and prohibitions. Violations are documented as "known violations" with a reason.

### Explore Protocol

Before any ambiguous task, the AI presents **3 questions at once** — each with a comparison table and recommendation. No one-by-one Q&A. You pick or approve, and the AI moves on.

- Plain-language translations for technical concepts
- Max 2 rounds — if still ambiguous, recommends a formal Spec/PRD
- Output saved to `.lcscore/explore/{SRC-ID}/memo.md`

### Autopilot Mode

After Explore completes, the AI asks: **"Autopilot mode? (Y/N)"**

- **Yes** → AI executes everything automatically. Auto-commits after each change. Zero questions. Halts only on architecture changes or high-risk operations.
- **No** → Standard interactive workflow with user consultation.

### Decision Log

Every non-trivial decision (library choice, architecture, trade-off) is recorded with:
- Context and constraints
- Options considered with pros/cons
- Final decision with rationale
- Consequences and action items

### State Tracking (state.md)

Auto-generated from `git log --grep="SRC-"`. Never manually edited. Git is the source of truth.

---

## SRC-ID Format

Every unit of work is tracked with: `SRC-{YYMMDD}-{slug}`

```
SRC-240718-implement-auth
│   │        │
│   │        └── max 5 words, lowercase, hyphens
│   └── date (YYMMDD)
└── prefix
```

Used in commit messages: `SRC-240718-implement-auth: Add login endpoint`

---

## Daily Workflows

### Resume Previous Work
```
You: "Continue yesterday's work"
AI: reads CONTEXT.md → sees "Next action: debug auth middleware in src/auth.ts"
    → starts working immediately
Cost: ~500 tokens
```

### New Feature
```
You: "Add user registration"
AI: reads roadmap → checks priorities → starts implementation
    (if ambiguous → triggers Explore first)
```

### Mid-Feature Context Reset
```
AI: before context fills up → updates CONTEXT.md with exact stopping point
New session: AI reads CONTEXT.md → resumes from file:line without asking
```

---

## Token Budget

| Scenario | Tokens |
|---|---|
| New session context load (SKILL + CONTEXT + RULES + ROADMAP) | < 1,000 |
| Without LCS Core (re-explore codebase from scratch) | 3,000-8,000 |
| **Savings** | **75-90%** |

---

## Success Criteria

- AI resumes work immediately without re-explanation
- AI consistently follows coding rules (0 violations)
- Decision log written without being asked
- CONTEXT.md always up-to-date before session end
- ROADMAP.md scannable at a glance (< 50 lines)
- Zero state-vs-git inconsistencies

---

## Out of Scope (v1)

- Multi-platform support (Claude Code, Codex)
- npm publishing
- Cross-project dashboard
- Chain of Truth verification protocol
- 7-phase pipeline (explore → PRD → SRS → slice → execute → review → finalize)

These will be considered **only after v1 has been used for at least 2 weeks** and proven necessary.

---

## License

MIT
