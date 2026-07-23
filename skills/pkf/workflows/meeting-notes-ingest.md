# Meeting-notes ingestion

Archives a meeting write-up as-is, then offers to extract the Risks,
Actions, and Decisions buried in it — two separate proposals, so
archiving never waits on extraction.

Objects: Risk, Action, Decision. See SKILL.md's object map.

## Steps

1. **Resolve project scope**, same rule as action-tracking.
2. **Propose the archive.** The note is stored verbatim as a narrative
   file with no frontmatter — it is not a PKF object (see SKILL.md's
   object map, Conformance rules, for the tolerance this relies on).
   Propose a target path (e.g.
   `<project>/meeting-notes/2026-07-23-steering.md`) and wait for
   validation before writing.
3. **On confirmation, write the note unmodified.**
4. **Scan the note for candidates** — statements that read as a risk,
   a task with an owner, or a decision taken. Draft each candidate the
   same way as dictated-capture (id, type, title, description,
   project, owner if named, inferred type-specific fields).
5. **Present the full batch** of candidates together, each labelled
   with the sentence(s) it came from, so the user can accept, edit, or
   drop each independently — this is a second, separate validation
   from the archive step.
6. **Write only the accepted candidates**, at their proposed paths.
