# PKF — Project Knowledge Format

PKF is an open specification for representing a project's knowledge —
risks, actions, decisions, milestones, deliveries, stakeholders — as a
graph of structured business objects, rather than a collection of
disconnected documents or spreadsheets.

A PKF bundle is just Markdown files with YAML frontmatter, organized in a
plain directory tree:

- **Human readable** — every object is a Markdown file that makes sense
  on raw reading, with no dedicated tooling required.
- **AI native** — relations between objects are explicit and typed, so
  an agent doesn't have to guess the project's structure from prose.
- **Git friendly** — history, branches, and reviews of project content
  work exactly like they do for code.
- **Extensible** — organizations can add their own object types without
  breaking compatibility with the core model.

## Example

```
client-acme/
├── client.yaml
├── stakeholders/
│   └── s001-jean-dupont.md
└── project-test-runs/
    ├── project.yaml
    ├── risks/
    │   └── r001-scope-creep.md
    ├── actions/
    │   └── a001-scope-framing.md
    └── team/
        └── as001-jdupont-sponsor.md
```

```yaml
---
id: R001
type: Risk
title: "Scope creep"
project: P-TEST-RUNS
category: Schedule
probability: Medium
impact: High
owner: S001
status: Open
---

# Description

New requirements could be added to the project without validation or
impact assessment, leading to delays and cost overruns.
```

## Documentation

- [`docs/PKF_SPEC.md`](docs/PKF_SPEC.md) — the Project Knowledge Format
  specification: object types, bundle structure, relations, and
  conformance rules.
- [`docs/OFK_SPEC.md`](docs/OFK_SPEC.md) — the Open Knowledge Format
  specification, a related, more general format for representing
  knowledge around data and systems.

## Status

Both specifications are v0.1 drafts. Interfaces and object definitions
may still change.

## License

Licensed under the [Apache License 2.0](LICENSE.md).
