# Status reporting

Produces a status document. One workflow, one parameter — **scope** —
rather than a project-manager version and a program-director version
maintained separately.

Objects: Project, Milestone, Risk, Action, Decision. See SKILL.md's
object map.

## Parameter: scope (project | portfolio)

Resolve per SKILL.md's parameter-resolution rule: extract from the
request if stated ("a report on the portfolio" → portfolio, "on my
project" → project); otherwise default from the bundle's shape (one
`project-*/` folder → project; several → propose the choice) and state
the resolved value back to the user before drafting.

## Steps

1. **Resolve scope** as above.
2. **If scope = project:** draft an internal status update for that
   one project — near-term Milestones, `Risk` objects `Open` sorted by
   `score`, overdue Actions, Decisions still `Proposed`.
3. **If scope = portfolio:** draft a roll-up across every project —
   one section per project (same content as the project-scoped report,
   condensed) plus an executive summary calling out at-risk projects,
   for a sponsor or steering committee audience.
4. **Present the drafted document** to the user.
5. **If the user wants it saved into the bundle**, propose a target
   path and wait for validation before writing — this is a narrative
   document, not a PKF object, so it carries no frontmatter (see
   SKILL.md's object map, Conformance rules, for the tolerance this
   relies on).
