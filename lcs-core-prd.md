# LCS Core — Product Requirements Document v2

> File: `lcs-core-prd.md`
> Status: Final
> Timestamp: 2026-07-18

---

## 1. Purpose

LCS Core is a minimal system that enables an AI in a fresh OpenCode session to **immediately resume work without re-explanation**, follow consistent coding rules, and report status to the project roadmap — all with the lowest possible token overhead.

The developer acts only as a manager: read the roadmap, tell the AI to work, review the results.

---

## 2. Problem Statement

### Reality of a solo developer working with AI:

| Problem | Root Cause | Impact |
|---|---|---|
| Fresh AI session has zero context — must re-explain from scratch | AI context is not persistent across sessions | Wasted tokens, wasted time, frustration |
| Fresh AI session re-explores the entire codebase | No record of "where we left off" | 40-60% of new session tokens burned on discovery |
| AI forgets architectural decisions from previous sessions | Decisions only existed in the lost context | Inconsistency, re-research, contradictory decisions |
| Coding rules are written but never followed | No enforcement — only suggestions | Quality degradation, constant refactoring |
| No "next action" without re-reading everything | No resume mechanism | User remains project manager + developer |

### Actual root cause:

It is **not** "no tracking." Tracking can always be done manually.

Root cause: **AI has no persistent memory across sessions, and there is no lightweight mechanism to provide sufficient context without inflating the token budget.**

---

## 3. Solution: LCS Core v2

### 3.1 Philosophy

> **"Save a small amount of strategic context, not a log of everything. Save tokens at load time, save hundreds of tokens at re-discovery time."**

Design principles:
- **Context first, tracking second.** The primary goal is giving the AI context to RESUME — not merely recording what already happened.
- **Mandatory vs optional is driven by impact.** Architectural decisions = mandatory. Task breakdowns = optional.
- **Git is the SOT.** The state file is a derived view from git log, not a manually maintained parallel source.
- **Platform: OpenCode only.** Focus on one platform. Only expand when proven necessary.

### 3.2 Architecture

```
project/
├── .lcscore/
│   ├── CONTEXT.md          ← SESSION HANDOFF — the most important file
│   ├── RULES.md            ← Coding rules the AI MUST follow
│   ├── ROADMAP.md          ← Feature/task list with priorities
│   ├── state.md            ← Derived view from git log (SRC-ID list)
│   └── decisions/          ← Decision log — MANDATORY
│       ├── 2026-07-18-redis-vs-sqlite.md
│       └── 2026-07-18-api-architecture-choice.md
│
└── ~/.config/opencode/skills/lcs-core/SKILL.md   ← Auto-load trigger
```

| File | Function | Required? | Written by |
|---|---|---|---|
| **CONTEXT.md** | Handoff artifact — session resume summary | **Mandatory** | AI (end of each session / before new session) |
| **RULES.md** | Coding rules the AI must follow | **Mandatory** | User (write once) |
| **ROADMAP.md** | Feature/task list with priorities and order | **Mandatory** | User (write once, update periodically) |
| **state.md** | Derived view — SRC-ID list from git log | **Auto** | AI (generated from `git log`) |
| **decisions/** | Architectural decision log | **Mandatory when decisions exist** | AI (when a decision is made) |
| **SKILL.md** | Auto-load trigger + instructions | **Mandatory** | Provided by system |

### 3.3 CONTEXT.md — Session Handoff (most important file)

**Purpose:** This file is read by the AI in the first second of a new session. After reading ~50-100 lines, the AI must **immediately know what to do** without re-exploring the codebase.

```markdown
---
project: lcs-core
last_session: 2026-07-18
status: in_progress
current_src: SRC-240718-implement-handoff-protocol
---

# Context: LCS Core

## What we're building
A minimal session handoff & tracking system for personal coding projects. Currently implementing the CONTEXT.md handoff protocol.

## Where we stopped
Finished writing PRD v2 in `lcs-core-prd.md`. Haven't started coding yet.

## Files being worked on
- `lcs-core-prd.md` — PRD revision (done)
- No code files touched yet

## Key decisions made
- Git log = SOT, state.md derived from it
- OpenCode-only for v1
- Handoff via CONTEXT.md (not state.md)
- Decision log MANDATORY, not optional

## Architecture
```
project/
├── .lcscore/
│   ├── CONTEXT.md    ← session handoff
│   ├── RULES.md      ← coding rules
│   ├── ROADMAP.md    ← project roadmap
│   ├── state.md      ← derived from git log
│   └── decisions/    ← mandatory decision log
```

## Current blockers / open questions
- Need user validation: is the .lcscore/ structure sufficient?

## Next action
1. After user approves the PRD → start implementing SKILL.md
2. Create the first .lcscore/CONTEXT.md file

## Relevant files
- `lcs-core-prd.md` — final PRD
```

**Rules for writing CONTEXT.md:**
- **AI updates it at the end of every session** (before context reset / before user exits)
- **AI reads it at the start of every new session** (triggered by SKILL.md auto-load)
- **Maximum 100 lines.** If longer, something is wrong — too much technical detail.
- **"Next action" must be actionable** — not "continue working," but "debug auth middleware in `src/auth.ts`, error 401 at line 42."
- **"Relevant files" must be specific** — file paths being actively worked on, not the entire project.

### 3.4 RULES.md — Coding Standards Enforcement

**Purpose:** This file ensures the AI follows the same coding rules in EVERY session. Read at the start of every session. The AI must comply — this is not a suggestion.

```markdown
# Coding Rules

## Naming
- Files: kebab-case (`auth-middleware.ts`, not `authMiddleware.ts`)
- Functions: camelCase
- Components: PascalCase

## Structure
- 1 file = 1 responsibility
- Max 200 lines per file (hard limit — split if exceeded)
- Shared utilities in `/shared/`, not copy-pasted

## Testing
- Every new function must have a test
- Test file: `*.test.ts`, placed next to the tested file

## Git
- Commit message: `SRC-{ID}: imperative description`
- 1 commit = 1 logical change
- Never commit directly to main — use branches

## Prohibitions
- No `any` in TypeScript
- No skipping tests
- No speculative abstractions (YAGNI)
- No file longer than 200 lines
```

**Rules:**
- User writes once. AI reads every session.
- Rules must be **enforceable** — the AI must be able to verify compliance.
- If a rule is violated, the AI records it in CONTEXT.md as a "known violation" with the reason.

### 3.5 ROADMAP.md — Project Roadmap

**Purpose:** The developer (as manager) can see project status at a glance. The AI knows priorities and work order.

```markdown
# LCS Core Roadmap

## Milestone: v1 MVP

| # | Task | SRC-ID | Status | Priority |
|---|---|---|---|---|
| 1 | Write SKILL.md | SRC-240718-write-skill-md | todo | P0 |
| 2 | Create CONTEXT.md template | SRC-240718-context-template | todo | P0 |
| 3 | Create RULES.md template | SRC-240718-rules-template | todo | P0 |
| 4 | Implement state.md generator | SRC-240718-state-generator | todo | P1 |
| 5 | Run 3 consecutive session test | SRC-240718-session-test | todo | P1 |
| 6 | Publish OpenCode skill | SRC-240718-publish-skill | todo | P2 |

## Backlog
| # | Idea | Added |
|---|---|---|
| 7 | Decision template generator | 240718 |
| 8 | Cross-project dashboard | 240718 |
```

**Rules:**
- User maintains the roadmap. AI only reads it to understand priorities.
- AI must NOT change priority order without user confirmation.
- AI MAY add items to the backlog (new ideas discovered during work).

### 3.6 state.md — Derived State View

**Purpose:** Compact view of git log. Generated, not manual.

**Key principle: Git log is the SOT. state.md is a cache.**

```markdown
---
generated: 2026-07-18T14:30:00+07:00
source: git log --grep="SRC-" --oneline
total_src: 2
---

# LCS State (auto-generated from git log)

| SRC-ID | Commit | Status | Date |
|---|---|---|---|
| SRC-240718-init-lcs-core | a1b2c3d SRC-240718-init-lcs-core: Initialize LCS Core | done | 240718 |
| SRC-240718-prd-revision | e4f5g6h SRC-240718-prd-revision: Rewrite PRD based on review | done | 240718 |
```

**Rules:**
- Generated from `git log --grep="SRC-" --oneline`
- NEVER written manually
- Read as a quick reference — NOT as the source of truth
- Status inferred from SRC-ID naming convention (can be manually overridden when needed)

### 3.7 decisions/ — Decision Log (MANDATORY)

**Purpose:** Records WHY architectural decisions were made. This is the most expensive thing to re-discover.

**Format:** One file per decision, naming: `YYYY-MM-DD-slug.md`

```markdown
# Decision: Redis vs SQLite for Session Store

- **Date:** 2026-07-18
- **SRC-ID:** SRC-240718-session-store
- **Status:** accepted

## Context
Need a session store for 3 microservices. Options: Redis (dedicated service) or SQLite (embedded).

## Options considered
| Option | Pros | Cons |
|---|---|---|
| Redis | Fast, shared state, battle-tested | Ops overhead, adds a dependency |
| SQLite | Zero ops, simple | Not shared across processes, locking issues |

## Decision
**Redis** — because shared state across services is a hard requirement. Ops overhead is worth it.

## Consequences
- Add 1 Redis container to docker-compose
- All services use `ioredis` client
- Must implement connection retry logic
```

**Rules:**
- **Mandatory** every time a non-trivial decision is made (library choice, architecture, pattern, trade-off)
- AI writes it — user does not need to ask
- AI reads it in a new session when touching the relevant area

### 3.8 SRC-ID (unchanged from v1, minus rename)

Format: `SRC-{YYMMDD}-{slug}`

**Changes from v1:**
- **NO rename** on done. Status is tracked in state.md and CONTEXT.md.
- Slug stays at max 5 words, lowercase, hyphens.
- SRC-ID is mandatory in commit messages and file headers.

### 3.9 SKILL.md — Trigger + Instructions

SKILL.md is the trigger file that makes LCS Core auto-load in every OpenCode session. It contains instructions for the AI on what to do at session start.

**SKILL.md contents (specification, not full content):**
1. Aggressive trigger description — loads whenever the user asks for coding work
2. Step 1: Read `.lcscore/CONTEXT.md` → understand the last known state
3. Step 2: Read `.lcscore/RULES.md` → comply with rules
4. Step 3: Read `.lcscore/ROADMAP.md` → know priorities
5. Step 4: Work based on CONTEXT.md "Next action" OR user command
6. Step 5: Before session ends → update CONTEXT.md
7. Verification checklist — git log, state.md auto-generate, decision log

Total SKILL.md: ~150 lines.

### 3.10 Explore Protocol — The Anti-Hallucination Gate

**Purpose:** Explore is the shield against hallucination, assumption, and scope creep. Its job is to ensure AI and user are aligned BEFORE a single line of code is written.

**When Explore auto-triggers:**
- Task description is ambiguous (e.g., "Bikin payment system" — what kind of payment?)
- Multiple valid approaches exist (REST vs GraphQL, SQLite vs PostgreSQL)
- AI is not 100% confident about the codebase state or tech stack
- User explicitly says "Explore dulu"

**When Explore auto-skips:**
- Task is trivial and well-understood (e.g., "Fix typo in header", "Add email validation to login form")
- AI has 100% confidence based on existing CONTEXT.md + codebase knowledge

#### 3.10.1 The 3-Question Rule (User's Point 1)

The defining property of LCS Core's Explore: **AI does NOT ask questions one by one. It batches 3 questions at once, each with pre-analyzed options and a clear recommendation.**

This turns Explore from a Q&A session into a **decision board**. The user's job is not to answer — it's to **pick or approve**.

```markdown
# Template: AI presents 3 questions at once

## 3 Questions to align on the approach

### Q1: Database — SQLite vs PostgreSQL?
| Criteria | SQLite | PostgreSQL | ✅ Best |
|---|---|---|---|
| Setup effort | Zero — file-based | Need Docker/install | ✅ SQLite |
| Concurrent writes | ❌ Single writer | ✅ Multi-writer | ✅ PostgreSQL |
| Project size | Small (≤1 dev) | Any scale | ✅ PostgreSQL |
| Current stack | Already in project | Would add dependency | ✅ SQLite |

**Recommendation: SQLite** — the project doesn't have concurrent write requirements yet.
PostgreSQL can be migrated later when needed (YAGNI).

### Q2: Authentication — JWT vs Session-based?
| Criteria | JWT | Sessions |
|---|---|---|
| Stateless | ✅ Yes | ❌ Need DB/store |
| Expiry control | ❌ Can't revoke easily | ✅ Can revoke anytime |
| Setup complexity | Simple | Moderate (+ session store) |
| Fits mobile/API | ✅ Yes | ✅ Yes |

**Recommendation: JWT** — simpler, stateless, fits the API-first nature of this project.

### Q3: Deployment — Docker vs bare metal?
[Similar comparison with recommendation]

---

👉 **Pick any option above, or tell me if you want a different approach.**
```

**Why 3?** Psychological ceiling. More than 3 questions overwhelms the user. Fewer than 3 misses critical alignment. 3 is the sweet spot.

**AI must always state its recommendation** — not leave decisions open-ended. The user should be able to say "Ok" and move on without thinking.

#### 3.10.2 Layperson Translation (User's Point 2)

If a question involves technical concepts the user may not be familiar with, the AI **must** provide a plain-language explanation alongside the technical comparison.

```markdown
### Q2: Database Indexing Strategy

*Plain language: Database indexing is like a book's index — it helps find
information faster without reading every page. But too many indexes slow down
writing (like maintaining 10 different indexes for the same book).*

| Strategy | Pros | Cons |
|---|---|---|
| Index all query fields | Fast reads | Slow writes, more storage |
| Index only critical paths | Balanced | May miss future queries |
| No indexes (dev mode) | Fast to build | Slow queries in production |

**Recommendation: Index only critical query paths** — the app is read-heavy
with few write operations. Index the fields used in WHERE clauses.
```

**When to translate:**
- Database concepts (indexing, sharding, replication)
- Network concepts (latency, throughput, CDN)
- Architecture patterns (event-driven, CQRS, microservices)
- Infrastructure (containerization, orchestration, load balancing)
- Security (encryption at rest vs in transit, CSRF, XSS)
- Any term that would confuse a non-specialist

**Rule of thumb:** If the question requires domain expertise the user hasn't demonstrated in this session, translate it.

#### 3.10.3 The Checkpoint Gate (User's Point 3)

After presenting the 3 questions and getting answers, the AI provides a **summary + checklist** and explicitly asks the user whether this is enough or needs more.

```markdown
## Summary & Readiness Check

### Decisions made:
| Question | Choice | Rationale |
|---|---|---|
| Database | SQLite | YAGNI — can migrate later |
| Auth | JWT | Stateless, API-first fit |
| Deployment | Docker | Consistency across environments |

### Checklist before execute:
- [x] Scope is clear: build a task management API with 3 endpoints
- [x] Database schema defined: users, tasks, projects tables
- [x] Auth flow decided: JWT with refresh token
- [x] No unknowns blocking execution
- [x] Existing codebase patterns identified and will be followed

### Result
✅ **Explore complete — ready to Execute.**

---

**Does this cover everything?** If yes, I'll proceed with implementation.
If you want to explore further (deployment strategy, testing approach,
observability), I can dive deeper.
```

**If user says "Enough"** → AI closes the Explore SRC with status `done` and proceeds to Execute (same session or new SRC).

**If user says "Lanjut explore detail X"** → AI enters **Explore Deep Dive** — one more round of 3 sub-questions focused on the area the user chose. Then check again.

**Max 2 rounds of Explore.** If after 2 rounds there's still ambiguity, the problem is bigger than Explore — it needs a Spec/PRD.

#### 3.10.4 Explore Funnel Diagram

```
User: "Bikin fitur billing"

    ▼
┌─────────────────────────────┐
│ 1. AI breakdown → 3 questions│ ← langsung kasih 3 + rekomendasi
│ 2. User pick/approve         │
└──────────┬──────────────────┘
           ▼
    ┌── cukup? ──┐
    │            │
   YES           NO
    │            │
    ▼            ▼
 [Execute]  ┌────────────────────────┐
            │ Deep Dive (1 round)    │ ← 3 sub-questions
            │ User pick/approve      │
            └──────────┬─────────────┘
                       ▼
                 ┌── cukup? ──┐
                 │            │
                YES           NO
                 │            │
                 ▼            ▼
              [Execute]  [→ Recommend Spec/PRD]
                            lebih cocok untuk
                            kompleksitas ini
```

#### 3.10.5 Explore Output

One file: `.lcscore/explore/{SRC-ID}/memo.md`

```markdown
---
src: SRC-240718-explore-billing-system
status: done
decision: proceed
recommendation: "Use Midtrans recurring API via existing integration"
---

# Explore: Billing System

## Task
User wants recurring billing for subscription feature

## 3 Key Decisions Made

| # | Question | User Choice | AI Recommendation |
|---|---|---|---|
| 1 | Payment gateway? | Midtrans (existing) | Midtrans — already integrated |
| 2 | Database schema? | New `subscriptions` table | Same — keeps billing separate from orders |
| 3 | Recurring trigger? | Midtrans webhook | Midtrans webhook — no cron needed |

## Summary
✅ Ready to Execute. Scope: implement Midtrans subscription API integration
with webhook handler for recurring billing events.

## What was ruled out
- New payment gateway (Xendit/Stripe) — unnecessary migration
- Cron-based billing — error-prone, no webhook reliability
- Third-party subscription service — added dependency

## Unknowns resolved
- ✅ Midtrans subscription API documented and usable
- ✅ Webhook payload format known
- ✅ Schema design validated against existing Order model

## Deep Dive needed?
User said "Lanjut" → proceed to Execute
```

---

## 4. Daily Workflows

### Scenario A: New session, resume previous work

```
User: "Continue yesterday's work"

AI: [auto-load SKILL.md]
  → read .lcscore/CONTEXT.md
  → read .lcscore/RULES.md
  → read .lcscore/ROADMAP.md
  → see "Next action: Implement SKILL.md content"
  → start coding

Total token cost for context load: ~400-800 tokens (CONTEXT.md ~100 lines)
```

### Scenario B: New session, new feature

```
User: "Implement login feature"

AI: [auto-load SKILL.md]
  → read .lcscore/CONTEXT.md → understand project state
  → read .lcscore/RULES.md → know the rules
  → read .lcscore/ROADMAP.md → check if login is on the roadmap
  → assign new SRC-ID
  → implement
  → update CONTEXT.md (new "Next action" if not finished)
```

### Scenario C: Context full, must reset mid-feature

```
[Context full, AI starts to hallucinate]

AI: [before reset / when prompted]
  → update CONTEXT.md:
      - current_src: SRC-240718-implement-handoff-protocol
      - where_stopped: "Implemented step 2 of 5. src/handoff.ts lines 1-80 are complete."
      - next_action: "Continue with step 3: state.md auto-generator"
      - relevant_files: ["src/handoff.ts"]
  → update decisions/ if new decisions were made
  → git commit all changes with SRC-ID

[New session]
AI: [read CONTEXT.md] → immediately resume step 3 without asking the user
```

---

## 5. Token Budget Analysis

| Action | File read | Estimated tokens |
|---|---|---|
| **v1: New session** | Re-explore codebase from scratch | 3,000-8,000 tokens |
| **v2: New session** | CONTEXT.md (100 lines) + RULES.md (50 lines) + ROADMAP.md (30 lines) | **~500-800 tokens** |
| **v1: Understanding project state** | state.md (50 lines) + re-explore | 1,500-4,000 tokens |
| **v2: Understanding project state** | CONTEXT.md (100 lines) | **~300 tokens** |

**Savings: 75-90% reduction in context-load tokens for new sessions.**

SKILL.md at ~150 lines = ~400 tokens at load time. But this is a one-time cost per session, repaid by saving 2,500-7,000 tokens of re-exploration that would have been needed.

---

## 6. Success Criteria

| Criterion | How to measure | Target |
|---|---|---|
| AI resumes work immediately without re-explanation | Open new session, prompt "Continue" — how many additional tokens does the AI require? | < 500 additional tokens |
| AI consistently follows coding rules | Spot-check 10 commits — any RULES.md violations? | 0 violations |
| Decision log gets written without being asked | `ls .lcscore/decisions/` — is there a file for every non-trivial feature? | 1+ decision per complex SRC |
| CONTEXT.md is always up-to-date | Check before session reset — does CONTEXT.md reflect the latest state? | 100% |
| Roadmap is scannable at a glance | ROADMAP.md < 50 lines for a typical project | ✓ |
| No state-vs-git inconsistency | state.md = derived from git log — no manual diff | 0 inconsistencies |
| New session context load < 1,000 tokens | Sum tokens from SKILL.md + CONTEXT.md + RULES.md + ROADMAP.md | < 1,000 tokens |

---

## 7. Execution Plan

### Phase 1: Core files (P0)

| Step | Output | SRC-ID |
|---|---|---|
| 1 | Write SKILL.md (~150 lines) | SRC-240718-write-skill-md |
| 2 | Create CONTEXT.md template | SRC-240718-context-template |
| 3 | Create RULES.md template | SRC-240718-rules-template |
| 4 | Create ROADMAP.md template | SRC-240718-roadmap-template |
| 5 | Create decision log template | SRC-240718-decision-template |
| 6 | Build state.md auto-generator script | SRC-240718-state-generator |
| 7 | Install SKILL.md in OpenCode | SRC-240718-install-skill |

### Phase 2: Validation (P1)

| Step | Output | SRC-ID |
|---|---|---|
| 8 | Test: 3 consecutive sessions, one feature | SRC-240718-session-test |
| 9 | Test: Reset mid-feature, resume in new session | SRC-240718-reset-test |
| 10 | Test: Switch projects, switch back | SRC-240718-switch-test |

---

## 8. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| AI forgets to update CONTEXT.md before session ends | SKILL.md includes reminder + verification checklist. User can trigger: "Update context" |
| CONTEXT.md grows too long (>100 lines) | SKILL.md enforces a hard limit. If too long = too much technical detail. |
| RULES.md is too strict, slowing the AI down | User controls rule intensity. Start with 5 rules, add gradually. |
| Too many small decision files | One file per topic, not per day. Merge related decisions. |
| state.md generator fails (no git history) | Fallback: manual state.md. But this only happens on brand-new projects. |
| User doesn't maintain ROADMAP.md | ROADMAP.md can be very minimal — even 3 lines. Write once, update when priorities change. |

---

## 9. Out of Scope (v1)

- Multi-platform support (Claude Code, Codex)
- npm publish
- Cross-project dashboard
- Chain of Truth / verification protocol
- 7-phase pipeline (explore → PRD → SRS → slice → execute → review → finalize)
- Artifact registry system
- Self-improvement analyzer
- Skill creation pipeline

**This does not mean these will never be built — but they will be built ONE AT A TIME only when PROVEN NECESSARY after v1 has been used for at least 2 weeks.**

---

## 10. Migration from LCS v1

If you previously used LCS v1:

1. Delete `.lcs-core/state.md` (replaced by `.lcscore/state.md` auto-generated)
2. Delete `.lcs-core/deliverables/` (replaced by `.lcscore/decisions/` + `CONTEXT.md`)
3. Delete old SKILL.md
4. Install new SKILL.md
5. Create `.lcscore/CONTEXT.md`, `.lcscore/RULES.md`, `.lcscore/ROADMAP.md`
6. Manually migrate any important decisions into `.lcscore/decisions/` (optional)

---

## Appendix A: All SOT File Templates (English Reference)

### A.1 CONTEXT.md

```markdown
---
project: <project-name>
last_session: <YYYY-MM-DD>
status: <todo | in_progress | done>
current_src: <SRC-YYMMDD-slug>
---

# <Context: Project Name>

## What we're building
<One-paragraph description of what this project or current SRC is building.>

## Where we stopped
<One-to-two sentences describing exactly what was last being done. Include file:line references.>

## Files being worked on
- <path/to/file> — <what changed>
- <path/to/file> — <what changed>

## Key decisions made
- <Brief decision, max 1 line each>
- <e.g., Using Prisma over raw SQL — need migrations>

## Architecture
```
<Quick architecture sketch — just relevant parts>
```

## Current blockers / open questions
- <If nothing, use: None>

## Next action
1. <Specific, actionable step>
2. <If none, use: N/A (SRC complete)>

## Relevant files
- <path/to/file>
- <path/to/file>
```

### A.2 RULES.md

```markdown
# Coding Rules

## Naming
- Files: kebab-case
- Functions: camelCase
- Components: PascalCase

## Structure
- 1 file = 1 responsibility
- Max 200 lines per file
- Shared utilities in /shared/

## Testing
- Every new function must have a test
- Test files: *.test.ts placed next to tested file

## Git
- Commit message: SRC-{ID}: imperative description
- 1 commit = 1 logical change
- No direct commits to main

## Prohibitions
- No `any` in TypeScript
- No skipping tests
- No speculative abstractions (YAGNI)
- No files > 200 lines
```

### A.3 ROADMAP.md

```markdown
# <Project Name> Roadmap

## Milestone: <name>

| # | Task | SRC-ID | Status | Priority |
|---|---|---|---|---|
| 1 | <task> | SRC-YYMMDD-slug | <todo/in_progress/done/cancelled> | <P0/P1/P2> |
| 2 | <task> | SRC-YYMMDD-slug | <todo/in_progress/done/cancelled> | <P0/P1/P2> |

## Backlog
| # | Idea | Added |
|---|---|---|
| 1 | <idea> | YYMMDD |
| 2 | <idea> | YYMMDD |
```

### A.4 state.md (auto-generated)

```markdown
---
generated: <YYYY-MM-DDThh:mm:ss±hh:mm>
source: git log --grep="SRC-" --oneline
total_src: <count>
---

# LCS State (auto-generated from git log)

| SRC-ID | Commit | Status | Date |
|---|---|---|---|
| SRC-YYMMDD-slug | <hash> <commit message> | <done/in_progress> | YYMMDD |
```

### A.5 decisions/ template

```markdown
# Decision: <title>

- **Date:** <YYYY-MM-DD>
- **SRC-ID:** <SRC-YYMMDD-slug>
- **Status:** <proposed | accepted | rejected | superseded>

## Context
<What problem needed a decision? What were the constraints?>

## Options considered
| Option | Pros | Cons |
|---|---|---|
| <option A> | <pro> | <con> |
| <option B> | <pro> | <con> |

## Decision
**<chosen option>** — <why this option was selected over alternatives>

## Consequences
- <impact 1>
- <impact 2>
- <action items if any>
```

---

(End of file)
