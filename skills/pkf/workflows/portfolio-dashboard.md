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
   - Risk counts by `score`, `status: Open` or `Under Review` only.
   - Action counts overdue / blocked.
   - Milestone health: any `Delayed`, any upcoming within the near
     term.
   - Decision backlog: count at `status: Proposed`, and how long the
     oldest has waited (`decision_date` absent, so use context/git
     history if asked).
3. **Present the snapshot as a compact table**, one row per project.
4. **Flag "at risk" projects** — any Critical Risk `Open`, any Delayed
   Milestone, or a Decision backlog the director calls out as
   concerning.
5. **Answer follow-ups by re-querying**, not by exporting: "show me
   Portal's Critical risks" pulls that project's Risk objects live.
6. **This workflow is read-only.** If the director wants to act on a
   finding — arbitrate a decision, sign off a milestone, dig into
   risks — hand off to decision-arbitration,
   milestone-delivery-signoff, or risk-review rather than writing here.
