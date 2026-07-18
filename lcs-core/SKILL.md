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

Read these files in order:

1. **`.lcscore/CONTEXT.md`** — Session handoff. Understand what we're building, where we stopped, and the next action. Read this first — it should be under 100 lines.
2. **`.lcscore/RULES.md`** — Coding rules. These are NOT suggestions. Comply with all rules. If you must violate a rule, note it in CONTEXT.md as a "known violation" with a reason.
3. **`.lcscore/ROADMAP.md`** — Project roadmap. Know the priorities. Do not change priority order without user confirmation.

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
   - `status`: current state
   - `current_src`: the SRC-ID being worked on
   - **"Where we stopped"**: specific file:line, what was done, what's next
   - **"Next action"**: ONE specific, actionable step — not "continue working"
   - **"Files being worked on"**: actual file paths, not the whole project
   - **"Key decisions made"**: new decisions since last update
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

- CONTEXT.md should be under 100 lines (~300 tokens)
- RULES.md should be under 60 lines (~200 tokens)
- ROADMAP.md should be under 50 lines (~150 tokens)
- Total context load: under 1,000 tokens including this SKILL.md

If any file is growing too large, it needs trimming — not more detail.

---

## Anti-Patterns to Avoid

- ❌ Reading the entire codebase before starting work (CONTEXT.md tells you what to know)
- ❌ Asking the user "what should I do?" (read CONTEXT.md first, then ask if unclear)
- ❌ Skipping decision recording (decisions are the most expensive to re-discover)
- ❌ Writing novel-sized CONTEXT.md entries (100 lines max)
- ❌ Ignoring RULES.md (these are mandatory, not optional)
