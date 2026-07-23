# Project bootstrap

Mints a new `project-*/` folder's `project.md` for a client whose
referential already exists — the reserved file marking a new Project
object (§4.4).

Objects: Project. See SKILL.md's object map.

Scope is deliberately narrow: this workflow produces `project.md`
alone. Team assignments, milestones, deliveries, risks, and everything
else that will eventually live under the project are added afterward
as separate, ordinary additions — an `Assignment` is just one more
object `workflows/dictated-capture.md` can draft ("add Marcus as tech
lead on the new project"), the same way a Risk or a Stakeholder is.

## Routing precondition

This workflow only fires when the named project's `project-*/` folder
does not exist yet. Two cases to distinguish before drafting anything:

- The client's `client.md` doesn't exist either — stop and redirect to
  `workflows/referential-bootstrap.md` first; `Project.client` is a
  required relation (§6, Project), so there is nothing for this
  project to attach to yet.
- The client's referential exists but this specific project doesn't —
  proceed with the steps below.

If the named project's `project-*/` folder already exists, this
request doesn't belong here at all — it belongs to whichever
operational workflow the user actually meant.

## Steps

1. **Confirm the precondition** per the routing section above.
2. **Resolve the project's id.** `Project` is the one type with a
   different id grammar (§3.1): `P-` followed by uppercase letters,
   digits, or hyphens — not the numeric form every other type uses.
   Derive a slug from the project's name if one is evident (e.g.
   "Customer Portal" → `P-PORTAL`); otherwise ask the user for one.
   Confirm the id is unique in the bundle before proposing it.
3. **Draft `project.md`** — `id`, `type: Project`, `title`,
   `description` (recommended), `client` (the resolved Client id).
   Leave a field out rather than inventing a value with no basis in
   what was said.
4. **Present the proposed file** — target path
   `project-<slug>/project.md` — and wait for validation.
5. **On confirmation, write the file.** Do not create `milestones/`,
   `deliveries/`, `risks/`, `actions/`, `decisions/`,
   `requirements/`, `applications/`, `dependencies/`,
   `skill-requirements/`, or `team/` as part of this step — those
   folders come into being the first time something is actually
   drafted into them, via the workflow that owns that object type.
