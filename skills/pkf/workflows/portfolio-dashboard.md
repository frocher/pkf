# Portfolio dashboard

An interactive read of client health across every project — where
things are stuck, which projects are at risk — navigated live by
follow-up questions rather than produced as a fixed document (that's
status-reporting's job).

Objects: Project, Risk, Action, Milestone, Decision. See SKILL.md's
object map.

## Steps

1. **Scope is always the whole client** — every `project-*/` folder in
   the bundle. No parameter to resolve.
2. **Build a per-project snapshot:**
   - Risk counts by `score`, `risk_status: Open` or `Under Review` only.
   - Action counts overdue / blocked.
   - Milestone health, derived rather than declared: **late**
     (`due_date` past with no `achieved_date`), **slipped** (`due_date`
     later than `baseline_due_date`), **delivered late**
     (`achieved_date` later than `baseline_due_date`), plus any
     upcoming within the near term. A milestone can be slipped without
     being late, and late without having slipped.
   - Decision backlog: count at `decision_status: Proposed`, and how long the
     oldest has waited (`decision_date` absent, so use context/git
     history if asked).
3. **Present the snapshot as a compact table**, one row per project.
4. **Flag "at risk" projects** — any Critical Risk `Open`, any late or
   slipped Milestone, a project whose `projected_effort` exceeds its
   `baseline_effort`, or a Decision backlog the director calls out as
   concerning.
5. **Answer follow-ups by re-querying**, not by exporting: "show me
   Portal's Critical risks" pulls that project's Risk objects live.
6. **This workflow is read-only.** If the director wants to act on a
   finding — arbitrate a decision, sign off a milestone, dig into
   risks — hand off to decision-arbitration,
   milestone-delivery-signoff, or risk-review rather than writing here.
