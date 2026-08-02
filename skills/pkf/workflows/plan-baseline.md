# Plan baseline

Poses a plan baseline on a `Milestone` or a `Project` that has none,
or corrects one that was entered wrongly. This is the only workflow
allowed to write a `baseline_*` field outside the moment its object
is created.

Objects: Milestone, Project. See SKILL.md's object map.

A PKF baseline has a single generation (§3, Baseline): it is set once
and never re-planned. This workflow is the named door that rule
needs — not a way around it.

## Routing precondition

Two requests land here:

- **A first posing** — the object carries no `baseline_*` at all.
  This is how a bundle written before the baseline fields existed
  adopts them, and it is allowed at any time, on any object.
- **A correction** — the object carries a `baseline_*` that does not
  say what was committed (a wrong year, a transposed figure).

A third request does not land here: **re-planning**. If the
commitment itself has moved, the baseline is not what changed —
redirect rather than proceed (step 3).

Baselines posed at the moment an object is created are not this
workflow's business either: `workflows/dictated-capture.md` proposes
them for a Milestone, `workflows/project-bootstrap.md` for a Project.

## Steps

1. **Resolve the target.** Resolve project scope, same rule as
   action-tracking, then the object itself: a named Milestone,
   several of them (a `consistency-check` finding often arrives as a
   list), or the Project.
2. **Read the current state** of each target — which of
   `baseline_due_date` and `baseline_effort` are set, and what their
   current counterparts hold — and present it back before proposing
   anything. A first posing and a correction are not the same
   conversation.
3. **Establish which of the two it is by asking, not by inferring.**
   Nothing in a bundle records when a `baseline_*` was written, so
   this rests on what the user states — the same declarative footing
   as the immutability rule itself (§3, Baseline). If the answer is
   that the commitment has moved, stop and say where it goes
   instead: the new projection is `due_date` (or, on the effort
   axis, `remaining_effort`), `impact_description` carries the
   consequence, and where the change went through a committee, the
   `Decision` that authorized it attaches to the milestone by
   `Decision.milestones`.
4. **Draft the change, keeping the pairs whole.** A
   `baseline_due_date` is never posed without a `due_date` beside
   it; a `baseline_effort` never without `remaining_effort` and
   `consumed_effort` — set to what has actually been spent, 0 only
   if nothing has. On a first posing the current counterparts are
   usually already there; leave them alone.
5. **Present the exact frontmatter change per object** and wait for
   validation before writing.
