# Dictated capture

Turns a spoken or typed aside ("we should flag that the vendor
contract lapses in March", "add Priya as a stakeholder, she knows
Kubernetes", "Marcus is now tech lead on the new project") into a
proposed PKF object, without the user having to know which folder or
fields it needs.

Objects: Milestone, Delivery, Risk, Action, Decision, Stakeholder,
Vendor, Team, Skill, Competency, Assignment. See SKILL.md's object map.

This workflow assumes the referential it's adding to already exists —
if the client has no `client.md` yet, the request belongs to
`workflows/referential-bootstrap.md` instead.

## Steps

1. **Classify the object type** from the content:
   - Project-scoped: a key stage marking a validation, a delivery or a
     checkpoint → Milestone; the shipping of a product, with a
     version → Delivery; a threat or concern → Risk; a task with an
     owner and a deadline → Action; a choice already made or being
     made → Decision; a person's role on one specific project →
     Assignment.
   - Client-scoped (§4.1's catalogs — no project owns these): a person
     joining the client or project side → Stakeholder; an external
     contractor or supplier → Vendor; a group organized around a
     function or project → Team; a capability or technology named for
     the catalog → Skill; a stakeholder's proficiency in a skill →
     Competency.
   - If it's genuinely ambiguous, ask rather than guess.
2. **Resolve project scope, same rule as action-tracking** — but only
   for the project-scoped types (Milestone, Delivery, Risk, Action,
   Decision, Assignment). Skip this step entirely for the five
   client-scoped catalog types; they attach to the client, not to a
   project.
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
   - **Intra-batch references.** Wherever a field below is marked "must
     already exist", that means **in the bundle, or in the batch the
     user has just accepted** — a single dictation may well create a
     milestone and the risk that names it. What exists in neither is
     still never written as a dangling reference: say so instead. This
     never creates an object implicitly — a risk naming an unknown
     milestone does not mint that milestone; the dictation has to have
     described it.
   - Type-specific fields inferred from what was said, leaving a field
     out rather than inventing a value with no basis in what was said:
     - Milestone — `category`/`due_date`, plus `acceptance_criteria`
       if it was stated. `milestone_status` is `Planned` unless what
       was said puts the milestone under way (`In Progress`) or
       already behind it — a milestone dictated as done takes
       `achieved_date` and `milestone_status: Achieved`.
     - Delivery — `version`/`kind`/`release_date`/`deliverables`/
       `environment`/`acceptance_criteria`, `delivery_status: Planned`
       by default, plus `milestone` → Milestone (0..1), authored
       here — the Milestone must already exist.
     - Risk — `category`/`probability`/`impact`, plus `milestones` (→
       Milestone list) when the statement names a milestone the risk
       threatens. The Milestone must already exist.
     - Action — `priority`/`due_date`.
     - Decision — `context`/`alternatives`.
     - Stakeholder — `job_title`/`email`/`phone`, `organization` (→
       Client or Vendor), `team` (→ Team).
     - Vendor — `kind`/`contact`.
     - Team — `kind`, `members` (→ Stakeholder list).
     - Skill — `category`.
     - Competency — `stakeholder` (1) · `skill` (1) — both must
       already exist — plus `level`/`years_of_experience`/
       `certified`.
     - Assignment — `project` (1) · `stakeholder` (1) — both must
       already exist — plus `role`/`side`/`assignment_status`.
   - **The baseline pair.** A Milestone drafted with a `due_date`, or
     with an effort, gets its `baseline_*` counterpart proposed beside
     it — **one** confirmation for the whole batch, from which the
     user may drop any milestone; nothing is written without it.
     `baseline_effort` is never proposed alone: it comes with
     `remaining_effort` at the same value and `consumed_effort: 0`,
     without which `projected_effort` has nothing to compute. A
     milestone drafted as already achieved gets **no** baseline
     proposal — asking whether a past date was the committed one
     manufactures a commitment out of its own outcome, which is the
     invented value this step forbids everywhere else. A Delivery
     carries no baseline at all.
   - Relations implied by the content (e.g. a Decision that references
     an Action already in the bundle).
   - **Never written at creation**, on the Milestone (Delivery has
     none of these): `projected_effort` (derived — Appendix C; a
     stored copy written at the one moment it is exact is how the
     drift starts), `impact_description` (the current state of a
     variance, and there is none yet), and `deliveries`,
     `dependencies`, `decisions` and `risks` — all four are inverse
     relations (§7.1), authored on the other object. A batch holding
     a milestone and a risk that names it writes the link on the
     `Risk`.
4. **Present every drafted object together** — each with its target
   path (following the bundle's `<lowercase-id>-<slug>.md`
   convention) and its complete frontmatter, each labelled with what
   it was drawn from, so the user can accept, edit, or drop each
   independently — and wait for validation. A single drafted object
   is a batch of one; there is no separate mode for it.
5. **On confirmation, write only the accepted objects**, in an order
   such that every intra-batch reference targets an object already
   written. As in `workflows/referential-bootstrap.md`, an edit that
   changes an id or drops an object referenced elsewhere in the batch
   must be reconciled before anything is written. On a requested edit,
   revise the draft and present the batch again before writing.
