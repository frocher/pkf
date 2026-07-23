# Consistency check

A project manager's sanity pass over one project — surfaces defects
before they cost something. This is a heuristic pass, not a normative
PKF validator (that is separate, unbuilt tooling).

Objects: every type carrying `owner` or a relation. See SKILL.md's
object map.

## Steps

1. **Resolve project scope**, same rule as action-tracking.
2. **Run these checks over the project's objects:**
   - *Missing owners* — an object whose type documents `owner` as a
     relation (§6 in `specs/PKF_SPEC.md`) but the field is absent.
   - *Orphaned objects* — an object no other object relates to and
     that relates to nothing itself beyond its required `project`
     field (a Decision with no `actions`, a Risk never referenced by a
     Dependency, etc.) — flagged as worth a look, not necessarily
     wrong.
   - *Inconsistent statuses* — combinations that don't hold together,
     e.g. an Action at `progress: 100` but `status` not `Completed`, a
     Milestone `Achieved` while a Delivery pointing at it
     (`Delivery.milestone`) is still `Planned`.
   - *Overdue but not reflected* — a `due_date` in the past on an
     Action, Milestone, or Dependency whose `status` doesn't show it
     (still `To Do` / `Planned` / `Identified` rather than flagged or
     escalated).
3. **Present findings grouped by check**, each entry naming the
   object's `id` and the specific reason it was flagged.
4. **On a confirmed fix** (set an owner, correct a status), propose
   the exact frontmatter change per object and wait for validation
   before writing.
