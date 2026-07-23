# Milestone / delivery prep

Readiness check for a project manager ahead of one **Milestone** or
**Delivery**, so a due date doesn't arrive unchecked.

Objects: Milestone, Delivery, Dependency. See SKILL.md's object map.

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
4. **Check each attached item's status** — a Dependency still
   `Identified` or `Blocking`, a Delivery not yet `Ready`, is a gap
   against the target's date.
5. **Summarize readiness**: which acceptance criteria look satisfied
   from the bundle's current state, which are open, and which
   dependencies or deliveries are the blockers.
6. **If the user wants to close a gap** (update a Dependency's status,
   mark a Delivery `Ready`), propose the exact frontmatter change for
   validation before writing.
