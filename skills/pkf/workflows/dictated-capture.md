# Dictated capture

Turns a spoken or typed aside ("we should flag that the vendor
contract lapses in March", "add Priya as a stakeholder, she knows
Kubernetes", "Marcus is now tech lead on the new project") into a
proposed PKF object, without the user having to know which folder or
fields it needs.

Objects: Risk, Action, Decision, Stakeholder, Vendor, Team, Skill,
Competency, Assignment. See SKILL.md's object map.

This workflow assumes the referential it's adding to already exists —
if the client has no `client.md` yet, the request belongs to
`workflows/referential-bootstrap.md` instead.

## Steps

1. **Classify the object type** from the content:
   - Project-scoped: a threat or concern → Risk; a task with an owner
     and a deadline → Action; a choice already made or being made →
     Decision; a person's role on one specific project → Assignment.
   - Client-scoped (§4.1's catalogs — no project owns these): a person
     joining the client or project side → Stakeholder; an external
     contractor or supplier → Vendor; a group organized around a
     function or project → Team; a capability or technology named for
     the catalog → Skill; a stakeholder's proficiency in a skill →
     Competency.
   - If it's genuinely ambiguous, ask rather than guess.
2. **Resolve project scope, same rule as action-tracking** — but only
   for the project-scoped types (Risk, Action, Decision, Assignment).
   Skip this step entirely for the five client-scoped catalog types;
   they attach to the client, not to a project.
3. **Draft the object:**
   - `id` — unique within the whole bundle, not just the current
     project (ids are bundle-wide per §3.1). Scan every existing
     object of that type across the whole bundle — not just this
     project or client — and take the next unused number under that
     type's prefix.
   - `type`, `title`, `description`, plus `project` for the
     project-scoped types.
   - `owner` — resolved to a Stakeholder id if a name was given;
     otherwise leave unset and say so. (Not applicable to the
     client-scoped types or to Assignment, which use their own
     relations below instead.)
   - Type-specific fields inferred from what was said, leaving a field
     out rather than inventing a value with no basis in what was said:
     - Risk — `category`/`probability`/`impact`.
     - Action — `priority`/`due_date`.
     - Decision — `context`/`alternatives`.
     - Stakeholder — `job_title`/`email`/`phone`, `organization` (→
       Client or Vendor), `team` (→ Team).
     - Vendor — `kind`/`contact`.
     - Team — `kind`, `members` (→ Stakeholder list).
     - Skill — `category`.
     - Competency — `stakeholder` (1) · `skill` (1) — both must
       already exist; if either doesn't, say so rather than drafting
       a dangling reference — plus `level`/`years_of_experience`/
       `certified`.
     - Assignment — `project` (1) · `stakeholder` (1) — both must
       already exist — plus `role`/`side`/`status`.
   - Relations implied by the content (e.g. a Decision that references
     an Action already in the bundle).
4. **Present the full proposed file** — target path (following the
   bundle's `<lowercase-id>-<slug>.md` convention) and complete
   frontmatter — and wait for validation.
5. **On confirmation, write the file.** On a requested edit, revise
   the draft and present it again before writing.
