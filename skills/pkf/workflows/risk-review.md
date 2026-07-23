# Risk review

Reviews open **Risk** objects. Two independent parameters — **scope**
and **severity threshold** — composable rather than bundled into one
"role setting", so "Critical/High on my one project" is expressible
alongside "everything on the portfolio".

Objects: Risk, owner → Stakeholder. See SKILL.md's object map.

## Parameters

Resolve each independently, per SKILL.md's parameter-resolution rule:
extract from the request if stated, otherwise default from the
bundle's shape and propose it, and state both resolved values back to
the user before listing risks.

- **scope** (project | portfolio) — "on my project" / "on the
  portfolio"; default: one `project-*/` folder → project, several →
  propose the choice.
- **severity** (all | Critical/High) — "Critical and High only" /
  "everything"; default: all, unless the request implies otherwise
  (e.g. "what's really threatening the client" reads as Critical/High).

## Steps

1. **Resolve scope and severity** as above.
2. **Collect Risk objects** in scope, excluding `status: Closed`.
3. **Compute `score`** from `probability` × `impact` for any Risk
   missing it, using the matrix in Appendix B of the PKF spec (see
   SKILL.md's object map for Risk), rather than trusting a stale
   hand-authored value.
4. **Apply the severity filter** if set to Critical/High.
5. **Flag risks whose `review_date` has passed** first — these need
   re-assessment regardless of score.
6. **Sort the rest by `score` descending**, then present: `id`,
   `title`, `score`, `status`, `owner`, `review_date`, `plan`.
7. **On a requested update** (mitigation plan, `status`,
   `review_date`), propose the exact frontmatter change for the named
   Risk and wait for validation before writing.
