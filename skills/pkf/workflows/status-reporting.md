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

## Design preferences: DESIGN.md (optional)

The report is always rendered as a single self-contained HTML
document — inline `<style>`, no external stylesheet, no build step.
Before rendering, look for a `DESIGN.md` file at the bundle root
(alongside `client.md`). This is a convention of this workflow, not a
PKF object and not part of the PKF spec — it carries no `id` or `type`
and isn't indexed.

`DESIGN.md` follows the
[design.md](https://github.com/google-labs-code/design.md) format: a
YAML frontmatter block of design tokens (`colors`, `typography`,
`spacing`, `rounded`, and optionally `components`), followed by
Markdown prose explaining them. Read the tokens directly — do not
shell out to the `@google/design.md` CLI; this skill has no Node/npm
runtime dependency.

- **If `DESIGN.md` exists and parses**, map its tokens onto the HTML's
  inline styles (headings and body text from `typography`, accents and
  backgrounds from `colors`, gaps and padding from `spacing`, corner
  radii from `rounded`). `components` tokens (e.g. `button-primary`)
  describe interactive UI elements that a static report doesn't have —
  they're expected to go unused; that's not an error. State plainly in
  your response that `DESIGN.md` was found and applied.
- **If `DESIGN.md` exists but doesn't parse** (invalid YAML, a
  duplicate `##` section heading, or another structural error), don't
  block the report: say briefly that `DESIGN.md` couldn't be
  interpreted, fall back to the neutral default style below, and
  continue.
- **If `DESIGN.md` doesn't exist**, state that plainly too, and render
  with a neutral default style (system font stack, restrained neutral
  palette).
- **Scope of influence: presentation only.** Tokens change how the
  report looks, never what it contains — the content rules in the
  steps below (which objects, what sort order, what sections) apply
  identically whether or not `DESIGN.md` exists.

## Steps

1. **Resolve scope** as above.
2. **If scope = project:** draft an internal status update for that
   one project — near-term Milestones with their standing against
   the baseline (per SKILL.md's *Reading variance from the
   baseline*: late / slipped / delivered late, effort drift in
   person-days, milestones threatened by an open Risk listed apart,
   the `Decision` explaining a slip where one is linked, and
   `Milestone.impact_description`), `Risk` objects `Open` sorted by
   `score`, overdue Actions, and Decisions still `Proposed`.

   Report the project's own dates and effort, not the sum of its
   milestones; where the two diverge, print the single reservation
   beside them. A milestone dated past the project's `due_date` is
   stated as a planning fact in its own right.

   **Expected effort at today's date** (project scope only). The
   milestones' `{baseline_due_date, baseline_effort}` pairs already
   describe an S-curve: cumulate the baselines in date order and
   read the curve at today's date to get the effort the plan
   expected to be spent by now, then state it beside
   `consumed_effort` — "the plan expected 355 person-days spent by
   now; the bundle carries 420". Two rules make this honest rather
   than misleading:

   - **Weighted by the milestones, or not at all.** Do not fall back
     on a straight line when milestones are undated or uncosted: a
     straight line asserts that effort is spent at a constant rate,
     which is false for almost every project — that is why the
     S-curve exists.
   - **Plot it against the project's own `baseline_effort`.** If the
     milestones sum to 380 for a project committed to 400, the curve
     visibly stops at 95% and the report says so, rather than
     normalizing the gap away.

   State the pair of numbers; a rendered chart in the HTML is a
   bonus, not the point. Never do this per milestone — a milestone
   has no origin, only `Project` carries a `start_date`.
3. **If scope = portfolio:** draft a roll-up across every project —
   one section per project (same content as the project-scoped
   report, condensed, with effort expressed as crossed percentages
   rather than person-days so projects of different sizes compare)
   plus an executive summary calling out at-risk projects, for a
   sponsor or steering committee audience. Name slips that no
   `Decision` explains.
4. **Check for `DESIGN.md`** and render the draft as HTML per the
   section above, stating the outcome (applied, unparseable, or absent)
   to the user.
5. **Present the rendered document** to the user.
6. **If the user wants it saved**, propose a target path under a
   `reports/` folder at the bundle root (a sibling of `client.md`,
   `stakeholders/`, `project-*/` — outside the PKF object tree, so
   §11's conformance rules, which only ever govern `.md` files, simply
   don't apply to it) and wait for validation before writing. There's
   no fixed naming convention — propose a filename each time.
