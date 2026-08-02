# Milestone / delivery prep

Readiness check for a project manager ahead of one **Milestone** or
**Delivery**, so a due date doesn't arrive unchecked.

Objects: Milestone, Delivery, Dependency, Risk. See SKILL.md's object
map.

## Steps

1. **Resolve project scope**, same rule as action-tracking: named
   project, or the bundle's sole project, or ask.
2. **Identify the target.** If the request names an id, use it.
   Otherwise pick the Milestone or Delivery in that project with the
   nearest upcoming `due_date` / `release_date` and confirm it's the
   right one before proceeding.
3. **Pull what's attached to it:**
   - `acceptance_criteria` on the target itself.
   - For a Milestone: its Deliveries (`Delivery.milestone` pointing
     back at it) and Dependencies (`Dependency.milestones` pointing at
     it).
   - For a Delivery: its `deliverables` and the Milestone it belongs
     to, if any.
4. **Check each attached item's status** (`dependency_status`,
   `delivery_status`) — a Dependency still `Identified` or `Blocking`,
   a Delivery not yet `Ready`, is a gap against the target's date. A
   Delivery that has slipped is an **input** to the milestone's
   forecast: it carries no baseline of its own, but it is a reason
   the milestone's `due_date` may need to move.
5. **Summarize readiness and variance.** Which acceptance criteria
   look satisfied from the bundle's current state, which are open,
   and which dependencies or deliveries are the blockers — then the
   milestone's standing against its baseline, per SKILL.md's *Reading
   variance from the baseline*: whether it is late or slipped and by
   how many days, its effort drift **in person-days**
   (`projected_effort` against `baseline_effort`), any open Risk that
   names it — listed apart from the computed states — the `Decision`
   explaining a slip when one is linked, and `impact_description`
   when it is filled in. Say nothing about the baseline when there is
   none.
6. **If the user wants to close a gap** (update a Dependency's
   `dependency_status`, mark a Delivery `delivery_status: Ready`,
   open an Action against a drift), propose the exact frontmatter
   change for validation before writing. Never propose a `Risk` for a
   variance that has already happened — a `Risk` is a threat that has
   not materialized, and it is declared, not computed — and never a
   `Decision`, which records an arbitration this workflow has not
   held.
