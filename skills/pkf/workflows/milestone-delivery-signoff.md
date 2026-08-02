# Milestone / delivery sign-off

A program director's go/no-go pass on **Milestones** and
**Deliveries** approaching or past due, across the client's projects —
at the acceptance-criteria level, not the operational detail
milestone-delivery-prep handles for a project manager.

Objects: Milestone, Delivery. See SKILL.md's object map.

## Steps

1. **Resolve scope.** Default is every project in the bundle; narrow
   to one if named.
2. **Collect the candidates**: Milestones/Deliveries whose date is
   within the near term, plus any Milestone already late —
   `due_date` past with no `achieved_date` — regardless of how far
   past.
3. **For each, read `acceptance_criteria`** and the status of what
   feeds it (its Deliveries for a Milestone, its `milestone` for a
   Delivery) — enough to judge readiness, not a task-by-task audit.
4. **Present a go/no-go recommendation per item**, grouped by project:
   ready, at risk (name the gap), or already late.
5. **On the director's ruling**, propose the field change — for a
   Milestone, `milestone_status` (`Achieved`, `Cancelled`),
   `achieved_date` when it is reached, and, on a no-go, a new
   projected `due_date` with `impact_description` filled in;
   `baseline_due_date` is never touched. For a Delivery,
   `delivery_status` (`Ready`, `Delivered`, `Validated`, `Cancelled`).
   Wait for validation before writing. If the slip goes to committee,
   the `Decision` that records it attaches to the Milestone via
   `Decision.milestones`.
