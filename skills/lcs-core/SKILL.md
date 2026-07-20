---
name: lcs-core
description: >
  LCS Core — session handoff and project context system. Auto-loads when you ask an AI to do coding work
  in any project that has a `.lcscore/` directory. Provides immediate context (CONTEXT.md), enforces coding
  rules (RULES.md), shows the roadmap (ROADMAP.md), and tracks decisions (decisions/). Use for any coding
  task, feature work, bug fixing, refactoring, code review, or project navigation. Triggers on phrases
  like "continue work", "implement feature", "fix bug", "review code", "refactor", "explore codebase",
  "check roadmap", "what's next", "resume", "coding", "development", or any programming task.
---

# LCS Core — Session Handoff Protocol

You are working in a project that uses LCS Core for session continuity. Follow this protocol at the start of every session.

---

## Step 1: Load Context

Read these files in order. **If a file doesn't exist yet, skip it and proceed.**

1. **`.lcscore/CONTEXT.md`** — Session handoff. Understand what we're building, where we stopped, and the next action. Read this first — it should be under 100 lines. **If missing:** this is a fresh project. Ask the user what they're building and bootstrap CONTEXT.md.
2. **`.lcscore/RULES.md`** — Coding rules. These are NOT suggestions. Comply with all rules. If you must violate a rule, note it in CONTEXT.md as a "known violation" with a reason. **If missing:** work without explicit rules, but follow general best practices.
3. **`.lcscore/ROADMAP.md`** — Project roadmap. Know the priorities. Do not change priority order without user confirmation. **If missing:** ask the user for priorities or work from their explicit instructions.

After loading, you should know:
- What the project is building
- Where work stopped last session
- What to do next
- What rules to follow

---

## Step 2: Understand Project State

If `.lcscore/state.md` exists, glance at it for a quick git-derived progress view.

If it doesn't exist yet, don't generate it automatically — do it when committed work needs to be tracked.

---

## Step 3: Work

Based on what you found:

- If CONTEXT.md has a clear **"Next action"** → start there.
- If the user gave a specific command → execute that command.
- If neither is clear → ask the user: "CONTEXT.md suggests X, but you asked for Y. Which should I prioritize?"

### 3.1 Ambiguous Tasks → Explore First

If the user's request is ambiguous, has multiple valid approaches, or you're not 100% confident about the codebase state:

1. **Present 3 questions at once** — each with comparison table + recommendation (decision board pattern, NOT one-by-one Q&A)
2. **Layperson translation** — if any question involves technical concepts (databases, networking, auth, infra), provide a plain-language explanation alongside the technical comparison
3. **Summarize + checkpoint** — show decisions made and explicitly ask: "Ready to proceed, or dive deeper?"
4. **Max 2 rounds of Explore** — if still ambiguous after 2 rounds, recommend a formal Spec/PRD
5. **Write exploration output** to `.lcscore/explore/{SRC-ID}/memo.md` with: decisions made, what was ruled out, unknowns resolved

---

### 3.2 Autopilot Mode

**After Explore completes and scope is clear, ask the user:**

> Autopilot mode? _(Y/N)_

#### If YES (Autopilot):

- Execute ALL tasks from the SOT/PRD/Explore output until everything is marked **done**
- **Auto-commit** after each logical change with `SRC-{ID}: description` — but verify the change compiles/tests pass before committing. Never commit broken code.
- **No questions to the user** — keep moving. Make the best decision and record it
- Update `.lcscore/CONTEXT.md` after every commit
- Regenerate `.lcscore/state.md` periodically

**Stop conditions — Autopilot MUST halt and write a note:**

| Trigger | Action |
|---|---|
| A change would **restructure the architecture** (e.g., new service, split monolith, change DB schema drastically) | Halt. Write to `.lcscore/CONTEXT.md`: *"Autopilot halted: [reason]. Needs your decision on [what]."* Mark current SRC as `blocked`. Commit the blocker note. |
| A **high-risk operation** detected (data migration, auth changes, deployment config, breaking API changes) | Halt. Same as above. |
| An **external dependency** is needed that isn't installed/configured | Halt. Note what's needed. |
| A **rule in RULES.md would be violated** and there's no clear justification | Halt. Note the conflict. |
| **All tasks complete** | Write final CONTEXT.md with status `done`. Final commit. |

When autopilot halts, the user reviews the blocker note, decides, and can restart autopilot or switch to interactive.

#### If NO (Interactive):

- Standard interactive workflow: explore → implement → ask → review
- User is consulted for decisions, approvals, and direction changes
- Normal Q&A flow applies

---

### 3.3 During Autopilot Execution

1. **Read `.lcscore/ROADMAP.md`** → work through tasks in priority order (P0 → P1 → P2)
2. **For each task**: implement → test → commit → update CONTEXT → next task
3. **Record decisions** in `.lcscore/decisions/` as they happen
4. **If stuck** (error you can't fix in 2 attempts, unclear spec, missing information) → halt with blocker note

---

## SRC-ID Format

Every unit of work is tracked by an SRC-ID: `SRC-{YYMMDD}-{slug}`

**Rules:**
- **Format:** `SRC-YYMMDD-slug-name` (e.g., `SRC-240718-implement-auth`)
- **Slug:** max 5 words, lowercase, hyphens
- **NO rename** on done — status is tracked in CONTEXT.md and state.md, not in the ID
- **Mandatory** in commit messages: `SRC-{ID}: imperative description`
- **One SRC-ID = one logical unit of work**

---

## Step 4: Decision Recording (MANDATORY)

ANY time you make a non-trivial decision (library choice, architecture pattern, trade-off, technology selection), record it:

1. Create `.lcscore/decisions/YYYY-MM-DD-slug.md`
2. Use the decision template: Context → Options → Decision → Consequences
3. Include the SRC-ID if applicable

Decisions are the most expensive thing to re-discover. Write them.

---

## Step 5: Update Context (before session end)

Before the session ends (or when context is running full):

1. Update `.lcscore/CONTEXT.md`:
   - `last_session`: today's date
   - `status`: current state (`todo` | `in_progress` | `done` | `blocked`)
   - `current_src`: the SRC-ID being worked on
   - **"What we're building"**: one-paragraph description if changed
   - **"Where we stopped"**: specific file:line, what was done, what's next
   - **"Files being worked on"**: actual file paths, not the whole project
   - **"Key decisions made"**: new decisions since last update
   - **"Architecture"**: quick sketch if the architecture changed
   - **"Current blockers / open questions"**: note anything blocking progress
   - **"Next action"**: ONE specific, actionable step — not "continue working"
   - **"Relevant files"**: file paths being actively worked on
2. Maximum 100 lines total — if longer, you're including too much detail
3. Commit all changes with the SRC-ID: `SRC-{ID}: description`

---

## Verification Checklist

Before considering work "done", verify:

- [ ] CONTEXT.md reflects the latest state (updated within this session)
- [ ] Any new decisions are recorded in `.lcscore/decisions/`
- [ ] Commit message follows `SRC-{ID}: imperative description` format
- [ ] No RULES.md violations (or violations are documented)
- [ ] state.md can be regenerated from git log (if script exists)
- [ ] "Next action" in CONTEXT.md is actionable and specific

---

## Token Budget Awareness

- CONTEXT.md should be under 100 lines (~500 tokens)
- RULES.md should be under 60 lines (~300 tokens)
- ROADMAP.md should be under 50 lines (~250 tokens)
- Total context load: under 1,800 tokens including this SKILL.md (~1,200 tokens)

If any file is growing too large, it needs trimming — not more detail.

---

## Anti-Patterns to Avoid

- ❌ Reading the entire codebase before starting work (CONTEXT.md tells you what to know)
- ❌ Asking the user "what should I do?" (read CONTEXT.md first, then ask if unclear)
- ❌ Skipping decision recording (decisions are the most expensive to re-discover)
- ❌ Writing novel-sized CONTEXT.md entries (100 lines max)
- ❌ Ignoring RULES.md (these are mandatory, not optional)
