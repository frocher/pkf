# Action tracking

Driver workflow for a project manager's daily walk of one project's
**Action** objects — what's moving, what's stuck, what's overdue.

Objects: Action, owner → Stakeholder. See SKILL.md's object map.

## Steps

1. **Resolve project scope.** If the request names a project, use it.
   Otherwise, if the bundle has exactly one `project-*/` folder, use
   that one. If it has several, list them and ask which one — do not
   guess.
2. **Read every Action under `<project>/actions/`.**
3. **Bucket each Action:**
   - *Overdue* — `due_date` is in the past and `status` is not
     `Completed` or `Cancelled`.
   - *Blocked* — `status: Blocked`.
   - *In progress* — `status: In Progress` or `On Hold`.
   - Leave `Completed` / `Cancelled` out of the default view; mention
     the count only.
4. **Present the three buckets**, each entry showing `id`, `title`,
   `owner` (resolved to the Stakeholder's name), `due_date`,
   `progress`. Overdue first, sorted by how overdue.
5. **Offer to draft nudges.** For overdue or blocked actions, offer a
   short message per owner listing their items — draft text only, the
   user decides where it's sent.
6. **On a status/progress update request** ("mark A014 as blocked",
   "A005 is at 80%"), propose the exact frontmatter change (`status`
   and/or `progress`, plus any other field the user specifies) for the
   named Action and wait for validation before writing the file.
