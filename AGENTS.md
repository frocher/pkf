# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this repository is

This repo is the home of two open specifications, published as Markdown
documents — there is no application code, build system, or test suite:

- `docs/PKF_SPEC.md` — Project Knowledge Format: a spec for representing
  a project's risks, actions, decisions, milestones, deliveries, and
  stakeholders as a graph of structured Markdown+YAML objects.
- `docs/OKF_SPEC.md` — Open Knowledge Format: a related, more general
  spec for representing knowledge around data and systems.
- `README.md` — entry point and overview.
- `LICENSE.md` — Apache License 2.0.

Work here is writing and editing specification prose, not code.

## Editing the specs

- Preserve the existing structure: numbered `##` sections, `---`
  horizontal rules between top-level sections, and tables for field
  definitions (`| Field | Type / Values |`).
- Wrap prose to roughly 72–76 columns, matching the surrounding
  paragraphs — both spec files are hand-wrapped this way.
- Keep terminology consistent with each spec's own §Terminology section
  (e.g. PKF's *Bundle*, *Object*, *Relation*, *View*). Don't introduce a
  new term for a concept that already has a name in that section.
- Every normative addition (new object type, new required field, new
  relation) belongs in the section that already enumerates that kind of
  thing — don't scatter definitions across sections.
- YAML frontmatter examples in the spec must stay valid YAML and use the
  field names defined earlier in the same document.
- When changing something that affects conformance rules (§11 in
  PKF_SPEC.md), update that section explicitly rather than leaving it
  implicit.

## Versioning

Both specs are versioned drafts (`Version 0.1 — Draft` at the top of
each file).

**While the major version is 0, do not bump the banner.** A pre-1.0
draft settles in place: breaking changes land without a version bump,
and numbering them would imply a stability the drafts do not have. PKF
§12 states this rule for consumers; this is the editing side of it. If
you are about to bump a `0.x` banner, don't — say so in the commit
message instead, so the choice is reviewable.

From 1.0 onward, if a change is substantive:

- A change that adds optional fields or types without breaking
  compatibility is a **minor** bump.
- A change that renames required fields or changes the structure of
  reserved files is a **major** bump.
- Update the version banner at the top of the affected file and, for
  PKF, the versioning rules described in its own §12.

## Style notes

- No emojis, no marketing language — the specs are technical reference
  documents.
- Don't add a change history section to either spec: both explicitly
  defer to Git history (`git log`, `git blame`) instead of an in-file
  changelog. Don't reintroduce one.
- Keep examples minimal and internally consistent (IDs referenced in
  relations must actually appear in the example).

## Agent skills

### Issue tracker

Issues live in GitHub Issues (frocher/pkf), via the gh CLI; external PRs are not a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: CONTEXT.md + docs/adr/ at the repo root. See `docs/agents/domain.md`.