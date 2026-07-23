# Resource & skill monitoring

Surfaces skill gaps and load concentration across the client's
projects, at the aggregate level — a program director steers
resourcing and competencies, not individual people.

Objects: SkillRequirement, Skill, Competency, Assignment, Team. See
SKILL.md's object map.

## Steps

1. **Scope is always the whole client** — every project. No parameter
   to resolve.
2. **Check skill coverage.** For each `SkillRequirement` (resolved to
   its `Skill`), look for a matching `Competency` held by a
   Stakeholder with an *Active* `Assignment` on that requirement's
   project. Flag as **uncovered** any `SkillRequirement` with
   `criticality: Important` or `Critical` that has no such match.
3. **Check load.** For each Stakeholder, count their concurrent
   `status: Active` Assignments across all projects — a high count is
   load concentration worth flagging. Roll the same count up by `Team`
   via `Team.members`.
4. **Present two lists**: uncovered skill needs (by project and
   `Skill`), and load concentration (stakeholders or teams carrying
   the most concurrent Active Assignments) — aggregate figures, not a
   per-person breakdown.
5. **This workflow is read-only** — it has no write path of its own.
