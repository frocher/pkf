# Referential bootstrap

Stands up a brand-new client's referential from nothing — `client.md`
plus the client-scoped catalogs (§4.1: Stakeholder, Vendor, Team,
Skill, Competency) — for a client this bundle has never seen before.

Objects: Client, Stakeholder, Vendor, Team, Skill, Competency. See
SKILL.md's object map.

Scope is deliberately narrow: no `project-*/` is created here, even
though a client is normally onboarded alongside its first project —
see `workflows/project-bootstrap.md` for that, once this workflow has
put a `client.md` in place for it to attach to.

## Routing precondition

This workflow only fires when the named client's `client.md` does not
exist yet in the bundle. If it already exists, the request belongs to
`workflows/dictated-capture.md` instead (adding to an existing
referential, one or many objects at a time) — say so and redirect
rather than proceeding here.

## Steps

1. **Confirm the precondition.** Check that `client.md` is genuinely
   absent. If it isn't, stop and redirect to dictated-capture.
2. **Free-form intake.** Let the user describe the new client in
   natural language, in whatever order they think of it — people,
   vendors, org structure, skills involved — rather than interrogating
   category by category. Parse everything said into draft objects
   before asking anything further.
3. **Gap-filling pass.** For every one of the five catalog categories
   that ended up with zero drafts, ask about it explicitly ("any
   vendors on this engagement? any team structure to record?") — never
   treat silence as "there are none." Skip a category only once it's
   been asked about and confirmed empty.
4. **Draft every object**, respecting the dependency order forced by
   §7's relations — a later category may reference an earlier one, but
   never the reverse:
   - `client.md` itself (`id`, `title`, `description`).
   - **Skill** — `category`.
   - **Vendor** — `kind`, `contact`.
   - **Team** — `kind`, `members` (left unresolved until Stakeholders
     exist in this same pass).
   - **Stakeholder** — `job_title`, `email`, `phone`, `organization`
     (→ Client or a just-drafted Vendor), `team` (→ a just-drafted
     Team).
   - **Competency** — `stakeholder` (1) · `skill` (1), `level`,
     `years_of_experience`, `certified`.
   - `id` per object follows the bundle-wide allocation rule (§3.1,
     §11 clause 2): scan every existing object of that type across the
     whole bundle, not just this client, and take the next unused
     number under that type's prefix.
   - Leave a field out rather than inventing a value with no basis in
     what was said.
5. **Present one combined batch** — every drafted object across all
   categories together, each labelled with what it's based on — so the
   user can accept, edit, or drop each independently in a single round
   (same pattern as `meeting-notes-ingest`'s candidate batch).
6. **On confirmation, write only the accepted objects**, in the
   dependency order from step 4 (`client.md` → Skill → Vendor → Team →
   Stakeholder → Competency), at their proposed paths. An edit that
   changes an id or drops an object referenced elsewhere in the batch
   must be reconciled before anything is written.
