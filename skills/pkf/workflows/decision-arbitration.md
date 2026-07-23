# Decision arbitration

Walks a program director through **Decision** objects awaiting a
ruling, across every project of the client, so nothing sits at
`Proposed` unexamined and no rationale gets lost.

Objects: Decision, decision_maker → Stakeholder. See SKILL.md's
object map.

## Steps

1. **Resolve scope.** Default is every project in the bundle. If the
   request names one project, narrow to it.
2. **Collect every Decision with `status: Proposed`** in scope.
3. **For each, surface** `context`, `alternatives`, `decision`, and
   `impact_description` — enough for the director to rule without
   opening the file.
4. **Ask which to rule on.** For each:
   - **Approve** — propose setting `status: Approved`,
     `decision_date`, and a `rationale` capturing why (draft one from
     the conversation if the director states it in passing; ask for
     it if not).
   - **Decline** — Decision's `status` enum is closed (see SKILL.md's
     object map) and has no "declined" value, so a decline is not a
     status value on its own. Record the ruling in the body's
     `# Comments` and the `rationale` field. If declining means the
     director wants a different course instead, offer to draft that as
     a **new** Decision, then set the declined Decision's
     `status: Superseded` and `superseded_by` to the new one's id —
     `superseded_by` is the authored side (§7.1); the new Decision's
     `supersedes` is inverse and is never hand-written.
5. **Present the exact frontmatter/body change** for each ruled
   Decision and wait for validation before writing.
