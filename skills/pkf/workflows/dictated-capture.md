# Dictated capture

Turns a spoken or typed aside ("we should flag that the vendor
contract lapses in March") into a proposed PKF object, without the
user having to know which folder or fields it needs.

Objects: Risk, Action, Decision. See SKILL.md's object map.

## Steps

1. **Classify the object type** from the content: a threat or concern
   → Risk; a task with an owner and a deadline → Action; a choice
   already made or being made → Decision. If it's genuinely ambiguous,
   ask rather than guess.
2. **Resolve project scope**, same rule as action-tracking.
3. **Draft the object:**
   - `id` — unique within the whole bundle, not just the current
     project (ids are bundle-wide per §3.1). Scan every project for
     the type's existing prefix (e.g. every `R0xx`, across all
     `risks/` folders, not just this project's) and take the next
     unused number.
   - `type`, `title`, `description`, `project`.
   - `owner` — resolved to a Stakeholder id if a name was given;
     otherwise leave unset and say so.
   - Type-specific fields inferred from what was said (e.g. a Risk's
     `category`/`probability`/`impact`, an Action's
     `priority`/`due_date`, a Decision's `context`/`alternatives`).
     Leave a field out rather than inventing a value with no basis in
     what was said.
   - Relations implied by the content (e.g. a Decision that references
     an Action already in the bundle).
4. **Present the full proposed file** — target path (following the
   bundle's `<lowercase-id>-<slug>.md` convention) and complete
   frontmatter — and wait for validation.
5. **On confirmation, write the file.** On a requested edit, revise
   the draft and present it again before writing.
