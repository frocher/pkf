# Status reports render as self-contained HTML, styled by an optional bundle-root DESIGN.md

`status-reporting.md` produced a plain Markdown narrative document —
consistent with the rest of the bundle, which is "just Markdown files"
per the README and §4. But status reports have a different audience
than the bundle's data (sponsors and steering committees, not the
tooling that reads Risk/Action/Decision objects), and there was no way
to express visual presentation preferences for that audience without
either inventing bespoke prose conventions or extending the PKF spec
itself to cover something that isn't a business object.

We adopted [design.md](https://github.com/google-labs-code/design.md)
— an existing, external, two-layer format (YAML design tokens +
Markdown rationale) for describing a visual identity — rather than
inventing a bundle-specific one. `DESIGN.md`, when present at the
bundle root, supplies `colors`/`typography`/`spacing`/`rounded` tokens
that the workflow reads directly (no CLI, no Node/npm dependency) and
maps onto inline `<style>` in a single self-contained HTML file. Its
`components` tokens (button states, etc.) describe interactive
elements a static report doesn't have, and are expected to go unused —
tolerated as inert rather than treated as a mismatch.

This is a skill-level convention (`skills/pkf/workflows/`), not a PKF
spec extension: `DESIGN.md` isn't a §6 object, carries no `id` or
`type`, and a PKF implementer that doesn't render reports has no
reason to know about it. Its influence is scoped to presentation only
— it can never change which objects appear in a report, their sort
order, or its sections; those rules stay in `status-reporting.md`
regardless of whether `DESIGN.md` exists. For the same reason the
rendered `.html` file is saved *outside* the bundle tree, in a
`reports/` folder at the bundle root — a generated presentation
artifact, not bundle data, so it never has to justify itself against
§11's conformance rules for `.md` files.

## Considered options

- Extend `specs/PKF_SPEC.md` with a formal `DESIGN.md` bundle
  convention — rejected; the spec governs the data model (object
  types, relations, conformance), and report styling is a rendering
  concern of one workflow, not something every PKF implementer should
  have to support.
- Invent a bespoke, project-local design-preferences format instead of
  reusing design.md — rejected; design.md already exists, is
  documented, and separates machine-readable tokens from human
  rationale in exactly the shape needed, with no reason to duplicate
  it.
- Shell out to the `@google/design.md` CLI (`lint`/`export`) to
  validate or convert tokens — rejected; this skill is pure
  instructions consumed by an AI with no Node/npm runtime today, and
  introducing one for a single optional file adds a failure mode
  (registry access, install issues) for no capability the AI can't
  already provide by reading the frontmatter itself.
- Keep the report as plain Markdown and only add DESIGN.md support
  later if requested — rejected; the report's whole reason for having
  a design layer is presentation for a non-technical audience, which
  plain Markdown can't deliver regardless of whether tokens are
  supplied.
- Save the rendered report inside the bundle tree, as the Markdown
  report was — rejected; an HTML artifact is a rendering output, not
  bundle data, and keeping it in `reports/` at the bundle root avoids
  stretching §11's conformance rules (which only ever discuss `.md`
  files) to cover a format they were never written to consider.
