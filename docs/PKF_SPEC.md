# Project Knowledge Format (PKF)

**Version 0.1 — Draft**

PKF is an open specification for representing a project's knowledge —
risks, actions, decisions, milestones, deliveries, stakeholders — as a
graph of structured business objects, rather than a collection of
disconnected documents or spreadsheets. The format is readable by a
human without tooling, consumable by an AI agent without a dedicated
SDK, and versions natively in Git.

---

## 1. Motivation

A project's knowledge today lives scattered across meeting notes,
spreadsheets, tickets, and the project manager's memory. None of this
forms a single source of truth that is both readable and structured.
PKF addresses this by defining:

- **normalized object types** for the common concepts of project
  management (Risk, Action, Decision, Milestone...) ;
- a common **file grammar** (YAML frontmatter + Markdown) ;
- a mechanism for **typed, cardinality-aware relations** between
  objects, beyond the plain hyperlink ;
- a **reference directory structure** for organizing several projects
  of the same client without duplicating shared data.

### Goals

1. Standardize the representation of the classic objects of project
   management.
2. Let several tools (a web editor, Excel, VS Code, Jira, Notion, an
   AI agent...) read and produce the same data without conversion.
3. Give AI assistants an explicit model of the project, with relations
   already resolved rather than reconstructed from free text.
4. Separate data from views: the risk register, the RAID log, or the
   RACI matrix become generated views, never hand-maintained
   documents.

### Non-goals

- Replacing established project management tools (Jira, Azure DevOps,
  Microsoft Project) — PKF standardizes the knowledge layer beneath
  them, not the management interface.
- Prescribing a storage, query, or rendering engine.
- Providing a closed, final list of types — the model is extensible
  (§10).

---

## 2. Principles

**Human readable** — everything stays readable without specialized
tooling, in Markdown and YAML; a PKF file makes sense on raw reading.

**AI native** — relations are explicit, identifiers are stable, types
are normalized: an agent does not have to guess the project's
structure from free-form prose.

**Git friendly** — the format lives naturally in a repository:
history, branches, pull requests, reviews of project content just
like code.

**Extensible** — an organization can add its own types
(`ChangeRequest`, `Audit`, `ComplianceControl`, `SecurityFinding`...)
without breaking compatibility with the core model.

**Vendor neutral** — no dependency on a particular editor or piece of
software.

---

## 3. Terminology

- **Bundle** — the complete tree of PKF files for a client (or a
  project, in a multi-repo setup). The unit of distribution, typically
  a Git repository.
- **Object** — a unit of knowledge represented by a Markdown file: a
  risk, an action, a decision, a milestone... See §6 for the list of
  normalized types.
- **ID** — a short, stable identifier for an object, unique within the
  bundle, independent of its location in the tree (e.g. `R001`,
  `A014`, `AS007`). Carried by the `id` frontmatter field; grammar
  defined in §3.1.
- **Type** — an object's category (`Risk`, `Action`, `Milestone`...),
  carried by the `type` frontmatter field.
- **Frontmatter** — a YAML metadata block delimited by `---` at the
  top of a file.
- **Body** — the free-form Markdown content after the frontmatter
  (long description, comments).
- **Relation** — an explicit reference from an object to one or more
  other objects, carried by a dedicated frontmatter field and paired
  with a cardinality (§7). Distinct from a plain Markdown link in the
  body, which remains possible but is not resolved by PKF tooling.
- **Authored relation** — the side of a relation that is written by
  hand and holds the reference (§7.1).
- **Inverse relation** — the opposite side of an authored relation,
  never written by hand: a tool reconstructs it by inverting the
  authored side (§7.1). Distinct from a *View*, which is a whole
  representation rather than a single field.
- **View** — a derived representation, generated from objects and
  their relations (risk register, schedule, Excel table...), never
  hand-maintained.

### 3.1 ID grammar

Two forms, both uppercase-only:

- **Default** (every type except `Project`) — one or more uppercase
  letters followed by one or more digits, with no fixed digit width
  (`R001`, `A014`, `AS007`, `SK2` are all valid). The prefix letters
  are the author's choice; the mapping used throughout this document
  and in `examples/` (`R` for Risk, `A` for Action, `SK` for
  Skill...) is convention, not a rule enforced by tooling.
- **`Project`** — `P-` followed by one or more uppercase letters,
  digits, or hyphens (`P-PLATFORM`, `P-PORTAL`). This is a narrow,
  named exception: no other type may use a slug form. Project ids
  are referenced far more often, and are far lower in cardinality,
  than any other type's, so eye-resolution is worth more here than
  the collision-safety a padded number would buy.

A lowercase `id` value is not valid grammar. This does not conflict
with the lowercase filenames recommended in §4.3 — the filename is
indicative, not canonical, and may freely lowercase the id it embeds.
Relation resolution against an `id` is a case-sensitive exact string
match (§7).

---

## 4. Bundle structure

A bundle is a tree of Markdown files. The recommended structure
separates what is common to a client from what is specific to each
project:

```
client-acme/
├── client.md
├── stakeholders/
│   ├── s001-jean-dupont.md
│   └── s002-new-developer.md
├── vendors/
│   └── v001-hosting-provider-x.md
├── teams/
│   └── t001-backend-team.md
├── skills/
│   └── sk001-kubernetes.md
├── competencies/
│   └── comp001-jdupont-kubernetes.md
├── project-migration-api/
│   ├── project.md
│   ├── milestones/
│   ├── deliveries/
│   ├── risks/
│   ├── actions/
│   ├── decisions/
│   ├── requirements/
│   ├── applications/
│   ├── dependencies/
│   ├── skill-requirements/
│   └── team/
│       └── as001-jdupont-sponsor.md
└── project-test-runs/
    ├── project.md
    ├── milestones/
    ├── ...
    └── team/
```

### 4.1 Monorepo per client (recommended)

A single Git repository per client rather than one per project, unless
there is a strong requirement to keep teams from seeing each other's
data. Decisive advantage: cross-object relations resolve internally to
the repository, with no cross-repo sync plumbing. A query like "Jean's
total workload across all of the client's projects" becomes a simple
file traversal.

Client-scoped catalogs — Stakeholder, Vendor, Team, Skill, Competency —
live at the bundle root, under the client, and are shared across all of
that client's projects. Every other §6 object type that attaches to a
project is project-scoped, living under that project's `project-*/`
subfolder.

Because ids must be unique within the bundle (§11.2) but nothing
elsewhere reserves ranges or coordinates allocation, two branches can
independently pick the same next id (e.g. both choosing `R004`), and
neither branch's own CI will see the collision — each validates
against the shared base plus only its own change. Bundles using this
workflow SHOULD run a conformant validator (§11) as a required pull
request check, **with the pull request's base branch required to be
up to date with the target before merge is allowed** (e.g. GitHub's
"require branches to be up to date before merging", or an equivalent
setting). Without that requirement, two independently-passing pull
requests can still land the same id, since each was validated before
the other's change existed.

### 4.2 Multi-repo alternative

If strict isolation is required: one repository per project, with the
shared base (`client.md`, `stakeholders/`, `vendors/`, `teams/`,
`skills/`, `competencies/`) in a separate repository referenced as a
Git submodule. This solves permissions, at the cost of an aggregation
script for any cross-project question.

### 4.3 File naming

Recommended convention: `<lowercase-id>-<descriptive-slug>.md`, e.g.
`risks/r003-data-migration-failure.md`. The file name is indicative;
an object's canonical identity is its `id` frontmatter field (§5.1),
not its path — an object can be moved or renamed without breaking the
relations that reference it.

### 4.4 Reserved files

| File            | Role                                                    |
|-----------------|-----------------------------------------------------------|
| `client.md`     | The `Client` object at the bundle root.                  |
| `project.md`    | The `Project` object at the root of a project subfolder. |
| `index.md`      | Optional. Directory listing (§9).                        |

`client.md` and `project.md` are ordinary objects (§5) — frontmatter
plus an optional body, exactly like a Risk or a Milestone. Only their
filename and location are reserved, marking which object in the tree is
the Client and which is the Project.

The `.md` extension is deliberate: these files are Markdown carrying a
frontmatter block, not YAML documents, and a `.yaml` extension invites
a consumer to parse the whole file as YAML — which §5.1 forbids, for
reasons that apply to reserved files exactly as they do to any other
object.

`index.md` carries no frontmatter and is not an object (§9). It is one
example of a narrative `.md` file with defined conventions — a bundle
MAY also hold other narrative documents (a `README.md`, steering
committee notes, meeting minutes) anywhere in the tree; like
`index.md`, they carry no frontmatter and are not objects (§11).

---

## 5. Objects

### 5.1 Frontmatter

```yaml
---
id: <unique ID>            # REQUIRED
type: <Type>                # REQUIRED — see §6
title: <Short name>         # RECOMMENDED
status: <Status>            # depends on type, see §6
owner: <ID of an object>    # depends on type
project: <project ID>       # required for any object attached to a project
# ... other fields specific to the type, see §6
---
```

**Required fields:**

- `id` — a unique identifier within the bundle. Stable over time: it
  does not change if the file is moved or renamed.
- `type` — one of the normalized types in §6, or an extension type
  (§10). PKF tools MUST tolerate an unknown type (treating it as a
  generic object) rather than rejecting the file.

**Recommended fields:**

- `title` — a human-readable display name. If omitted, a tool may
  derive a title from the file name.

**Extensions:** any additional field is allowed. PKF tools MUST
preserve unknown fields and MUST NOT reject a document for that reason
alone.

**Reading an object:** split the file at the frontmatter fences, parse
the block between them as YAML, and keep the remainder as Markdown
(§5.2). A consumer MUST NOT parse an object file as a single YAML
document: the fences make it a two-document stream, so the body is
either silently discarded or a syntax error, depending on the parser
and on what the Markdown contains. This read path applies to every
object, reserved files (§4.4) included.

### 5.2 Body

The body is standard Markdown. It carries the long description,
comments, and any narrative content. The following headings have
conventional meaning when used:

| Heading           | Content                                              |
|--------------------|------------------------------------------------------|
| `# Description`    | Detail on the object, beyond the frontmatter summary. |
| `# Comments`       | Additional information, decisions, blockers.          |

Change history is deliberately not carried by the format: PKF relies
on Git (`git log`, `git blame`) as the sole source of history. There
are no `created` / `updated` frontmatter fields, no `# History`
section in the body, and no `log.md` file (§9) — a bundle distributed
outside a Git repository loses this information, which is an accepted
trade-off rather than an oversight.

### 5.3 General notes

- Every object has a mandatory `id`.
- Every object may carry free-form comments.

---

## 6. Object types

This section normalizes the object types covered by PKF v0.1.
Cardinalities are noted as `1` (exactly one, required), `0..1`
(optional, at most one), `0..n` (zero to many), `1..n` (one to many).

For enumeration fields, the listed values are illustrative: additional
values are permitted unless the field's Type / Values cell is marked
`(closed)`, in which case the listed values are exhaustive.

### Action

An important task requiring an owner and a due date, not necessarily
a line item in the detailed schedule.

| Field         | Type / Values                                                                                     |
|---------------|------------------------------------------------------------------------------------------------------|
| `category`    | Technical, Functional, Infrastructure, Security, Documentation, Testing, Deployment, Project Management |
| `priority`    | Low, Medium, High, Critical (closed)                                                                  |
| `status`      | To Do, In Progress, Blocked, On Hold, Completed, Cancelled (closed)                                   |
| `progress`    | percentage (0–100)                                                                                    |
| `due_date`    | date                                                                                                   |

Relations: `project` (1) · `owner` → Stakeholder (1)

### Application

A software system or component impacted by the project, existing or
to be delivered.

| Field   | Type / Values                          |
|---------|-------------------------------------------|
| `kind`  | Internal, External, SaaS, Legacy          |

Relations: `project` (1) · `owner` → Stakeholder (1) ·
`requirements` → Requirement (0..n) · `dependencies` → Dependency
(0..n)

### Assignment

Attaches a Stakeholder to a project with a role specific to that
project. Lets the same person hold different roles across projects
without duplicating their identity. See §8 for the full pattern.

| Field        | Type / Values                                                |
|--------------|------------------------------------------------------------------|
| `role`       | free text (e.g. Sponsor, Technical Contact, Product Owner)       |
| `side`       | Client, Internal, Vendor (closed)                                  |
| `start_date` | date                                                               |
| `end_date`   | date, optional                                                     |
| `status`     | Active, Ended (closed)                                             |

Relations: `project` (1) · `stakeholder` (1)

### Client

The client for whom one or more projects are developed. The root of
the bundle in a monorepo setup.

Relations: `projects` → Project (0..n, inverse — §7.1)

### Competency

A skill held by a Stakeholder, with its proficiency level.

| Field                  | Type / Values                                |
|-------------------------|-----------------------------------------------|
| `level`                 | Beginner, Intermediate, Advanced, Expert (closed) |
| `years_of_experience`   | number                                        |
| `certified`             | boolean                                       |

Relations: `stakeholder` (1) · `skill` (1)

### Decision

Preserves important decisions, their justification, and their
context, to avoid re-litigating the same topics months later.

| Field                 | Type / Values                                          |
|-----------------------|--------------------------------------------------------|
| `context`             | text — the situation that required a decision          |
| `alternatives`        | text — options considered                              |
| `decision`            | text — the final validated choice                      |
| `rationale`           | text — the main reasons behind the decision            |
| `decision_date`       | date                                                   |
| `impact_description`  | text — consequences (technical, schedule, budget...)   |
| `status`              | Proposed, Approved, Implemented, Superseded (closed)   |

Relations: `project` (1) · `decision_maker` → Stakeholder (1) ·
`actions` → Action (0..n)

### Delivery

The delivery of a software, technical, or documentary product.

| Field                  | Type / Values                                                        |
|--------------------------|---------------------------------------------------------------------|
| `version`                | version identifier                                                  |
| `kind`                    | Release, Patch, Hotfix, Increment, Deployment, Documentation       |
| `release_date`            | date                                                                  |
| `status`                  | Planned, In Progress, Ready, Delivered, Validated, Cancelled (closed) |
| `deliverables`            | list — items included in the delivery                               |
| `acceptance_criteria`     | text                                                                  |
| `environment`             | Development, Testing, Staging, Production (closed)                 |

Relations: `project` (1) · `owner` → Stakeholder (1) · `milestone` →
Milestone (0..1)

### Dependency

An external or internal element the project's success depends on
(another project's decision, a vendor's delivery, a shared
resource...).

| Field       | Type / Values                                     |
|-------------|--------------------------------------------------------|
| `kind`      | Internal, External, Technical, Functional, Resource    |
| `status`    | Identified, In Progress, Resolved, Blocking (closed)    |
| `due_date`  | date by which the dependency must be resolved            |

Relations: `project` (1) · `owner` → Stakeholder (1) · `milestones` →
Milestone (0..n) · `risks` → Risk (0..n) · `related_project` → Project
(0..1, cross-project dependency)

### Milestone

Tracks a project's key stages that mark a validation, a delivery, or
an important checkpoint.

| Field                   | Type / Values                                            |
|---------------------------|-----------------------------------------------------------|
| `category`                 | Delivery, Validation, Technical, Business, Release        |
| `due_date`                 | date                                                        |
| `status`                   | Planned, In Progress, Achieved, Delayed, Cancelled (closed) |
| `acceptance_criteria`      | text                                                          |
| `impact_description`       | consequences of a delay                                     |

Relations: `project` (1) · `owner` → Stakeholder (1) · `deliveries` →
Delivery (0..n, inverse — §7.1) · `dependencies` → Dependency (0..n,
inverse — §7.1)

### Project

A software project developed for a client.

Relations: `client` (1) · `milestones` → Milestone (0..n, inverse —
§7.1) · `deliveries` → Delivery (0..n, inverse — §7.1)

### Requirement

A functional or technical requirement the project must satisfy.

| Field       | Type / Values                                                |
|-------------|-------------------------------------------------------------------|
| `category`  | Functional, Technical, Regulatory, Security, Performance          |
| `priority`  | Must have, Should have, Could have, Won't have (closed)           |
| `status`    | Draft, Validated, In Progress, Implemented, Tested, Rejected (closed) |

Relations: `project` (1) · `owner` → Stakeholder (1) · `deliveries` →
Delivery (0..n) · `applications` → Application (0..n, inverse — §7.1)

### Risk

A risk identified for a project.

| Field                  | Type / Values                                                                          |
|--------------------------|-----------------------------------------------------------------------------------|
| `category`               | Technical, Functional, Security, Infrastructure, Vendor, Schedule, Budget, Quality, Compliance, Organizational |
| `probability`            | Low, Medium, High, Very High (closed)                                                 |
| `impact`                 | Low, Medium, High, Critical (closed)                                                  |
| `score`                  | Low, Medium, High, Critical (closed) — derived from probability × impact (optional; matrix in Appendix B) |
| `plan`                   | mitigation or contingency plan                                                         |
| `response_strategy`      | Avoid, Mitigate, Transfer, Accept (closed)                                              |
| `status`                  | Open, Under Review, Mitigated, Accepted, Closed, Occurred (closed)                    |

Relations: `project` (1) · `owner` → Stakeholder (1) · `vendors` → Vendor (0..n)

### Skill

A skill from the global catalog, reusable across all projects (e.g.
Java, Kubernetes, Project Management).

| Field       | Type / Values                                          |
|-------------|--------------------------------------------------------------|
| `category`  | Technical, Functional, Method/Certification, Soft skill      |

### SkillRequirement

A skill need expressed by a project — one row of the skills matrix.

| Field                | Type / Values                                |
|-----------------------|------------------------------------------------|
| `required_level`      | Beginner, Intermediate, Advanced, Expert (closed) |
| `criticality`         | Nice to have, Important, Critical (closed)      |
| `headcount_needed`    | number                                           |

Relations: `project` (1) · `skill` (1)

### Stakeholder

A person involved in a project, either internally or on the client
side.

| Field           | Type / Values                                              |
|-----------------|-----------------------------------------------------------|
| `job_title`     | general function (Sponsor, Product Owner, Developer...)    |
| `email`         | —                                                            |
| `phone`         | —                                                            |

Relations: `organization` → Client | Vendor (0..1, absent = internal
· multi-type target, see §7) · `team` → Team (0..1, inverse — §7.1) ·
involved in `0..n` projects via `Assignment` (§8), never as a direct
field.

`organization` is the stakeholder's fixed home entity — an identity
fact, authored once regardless of how many projects they work on. It
is distinct from `Assignment.side` (§8), which is which side of the
table they sit on for one specific project engagement: the two
usually agree but are authored independently and can diverge (e.g. a
contractor who is internal on one engagement and a vendor on
another).

### Team

A group of people organized around a shared function or a shared
project (e.g. Backend team, QA team, client team).

| Field   | Type / Values           |
|---------|----------------------------|
| `kind`  | Internal, Vendor, Client   |

Relations: `members` → Stakeholder (0..n) · `projects` → Project (0..n)

### Vendor

An external contractor or supplier involved in one or more projects
(software vendor, service company, hosting provider...).

| Field       | Type / Values                                                     |
|-------------|-------------------------------------------------------------------|
| `kind`      | Software vendor, Service company, Hosting provider, Consultant, Other |
| `contact`   | main point of contact at the vendor                                |

Relations: `projects` → Project (0..n) · `risks` → Risk (0..n, inverse
— §7.1)

---

## 7. Relations

A relation is a frontmatter field whose value is an `id` (cardinality
`1` or `0..1`) or a list of `id`s (cardinality `0..n` or `1..n`)
referencing other objects in the bundle.

```yaml
project: P003          # relation with cardinality 1
vendors: [V001, V002]  # relation with cardinality 0..n
```

A relation asserts a typed, directed link between two objects — unlike
a Markdown link in the body text, which remains available to enrich
the narrative but is not resolved as a first-class relation by PKF
tooling.

A PKF tool resolves a relation by indexing all files in the bundle by
their `id` field, using a case-sensitive exact string match — `r001`
does not resolve to `R001`. Since ids are uppercase-only (§3.1), a
lowercase relation value is invalid grammar rather than an alias a
tool should normalize. A relation whose target does not exist in the
bundle is NOT a blocking error: it may simply represent knowledge not
yet captured. A validation tool (§11) MAY still flag it.

A relation's target in §6 MAY be documented as a choice of types (e.g.
`Client | Vendor`), when the field may point at an object of either
type. Resolution is unchanged: the tool looks the `id` up in the
bundle index and reads whatever `type` it finds there.

The cardinalities listed in §6 are a modeling recommendation, not a
low-level constraint of the format: a PKF file remains syntactically
valid even if a required relation is missing. It is up to business
validation to flag such an absence.

### 7.1 Authored and inverse relations

Many links in §6 are visible from both ends: a Milestone names its
`project`, and a Project could equally list its `milestones`. Storing
both is duplication, and duplication desynchronizes — which contradicts
the separation of data from views (§1). PKF therefore designates, for
every such pair, a single **authored** side; the opposite side is its
**inverse**.

An authored relation is written by whoever edits the object. An inverse
relation is never hand-written: a tool reconstructs it by indexing the
bundle by `id` and inverting the authored side. An inverse field
appearing in a file is not an error — a consumer SHOULD ignore its
stored value and recompute it, and a validation tool (§11) MAY flag it.

The authored side is the one that carries the more specific knowledge —
in practice the "child" of the pair, the object that cannot exist
without its counterpart:

| Authored                    | Inverse                     |
|-----------------------------|-----------------------------|
| `Project.client`            | `Client.projects`           |
| `Milestone.project`         | `Project.milestones`        |
| `Delivery.project`          | `Project.deliveries`        |
| `Delivery.milestone`        | `Milestone.deliveries`      |
| `Dependency.milestones`     | `Milestone.dependencies`    |
| `Risk.vendors`              | `Vendor.risks`              |
| `Application.requirements`  | `Requirement.applications`  |
| `Team.members`              | `Stakeholder.team`          |

This table is exhaustive: every relation pair declared on both sides in
§6 appears in it. `Team.members` is the exception to the child-side
rule — a team's composition is naturally authored on the team, where
the membership is legible at a glance.

Every other relation in §6 is declared on one side only —
`Decision.actions`, `Dependency.risks`, `Vendor.projects` and
`Team.projects` among them, as well as the `project` field carried by
most types. All of them are authored by definition, having no
counterpart to invert.

---

## 8. The Assignment pattern

A person (identity, email, phone) is a single, global `Stakeholder`
object, defined once — typically at the client bundle root. Their role
on a given project is never a duplicated field on the `Stakeholder`:
it is a separate relation, carried by an `Assignment` object specific
to that project.

`client.md`:

```yaml
---
id: C001
type: Client
title: "Acme"
---
```

`stakeholders/s001-jean-dupont.md`:

```yaml
---
id: S001
type: Stakeholder
title: "Jean Dupont"
organization: C001
email: jean.dupont@acme.com
---
```

`project-test-runs/team/as001-jdupont-sponsor.md`:

```yaml
---
id: AS001
type: Assignment
project: P-TEST-RUNS
stakeholder: S001
role: Sponsor
side: Client
status: Active
---
```

On `project-migration-api`, this same `S001` may have a second
`Assignment` with `role: Technical Contact` — without ever touching
the `stakeholders/s001-jean-dupont.md` file. If Jean's email changes,
a single file is edited and every view across every project updates
automatically.

A "who do I have on the client side for this project" view is never
hand-maintained: it is generated by filtering `Assignment` objects
where `project == <this project>` and `side == Client`, then resolving
each `stakeholder` to its global object.

---

## 9. Index file (optional)

An `index.md` MAY appear in any directory to list its contents and
support progressive disclosure before opening each object
individually:

```markdown
# Risks

* [R001 — Scope creep](r001-scope-creep.md) — Open, High
* [R003 — Data migration failure](r003-data-migration-failure.md) — Under Review, Critical
```

This file is indicative: a tool MAY generate it on the fly rather than
maintain it by hand. For change history, see §5.3 — PKF defers
entirely to Git rather than defining a logging mechanism within the
format.

---

## 10. Extensibility

An organization MAY define its own types beyond the list in §6, for
example `ChangeRequest`, `Audit`, `ComplianceControl`,
`CloudResource`, `SecurityFinding`. An extension type follows the same
frontmatter rules (`id`, `type` required) and MAY define its own
fields and relations. PKF tools MUST NOT reject a bundle solely
because it contains types not listed in §6; they MUST, at minimum,
treat it as a generic object (displayable frontmatter + body, with
relations resolved if the field follows the §7 convention).

---

## 11. Conformance

A bundle is **conformant** with PKF v0.1 if:

1. Every `.md` file that contains a frontmatter block parses that
   block as valid YAML.
2. Every such frontmatter block contains a non-empty `id` field,
   unique within the bundle.
3. Every such frontmatter block contains a non-empty `type` field.
4. The reserved files (`client.md`, `project.md`, `index.md`)
   follow the structure described in §4.4 and §9 when present.

A `.md` file with no frontmatter block at all — a narrative document
such as a `README.md`, meeting notes, or steering-committee minutes —
is not an object: it carries no `id` or `type`, is not subject to
clauses 1-3, and is not indexed. It MAY appear anywhere in the tree,
not only as `index.md` (§4.4).

A business validation tool (planned for the Validation phase of the
PKF roadmap) MAY add stricter rules — cardinalities from §6 satisfied,
enumeration values within the expected list for fields marked
`(closed)` in §6 (§6's own convention governs unmarked fields, at any
validation strictness level), relations resolved, inverse relations
(§7.1) not hand-authored, derived fields such as `Risk.score` matching
their computation (Appendix B) rather than a stale hand-authored value
— without these rules being a condition for base format conformance.

Consumers MUST NOT reject a bundle because of:

- missing optional frontmatter fields;
- unknown types (§10);
- relations whose target does not yet exist (§7);
- a missing `index.md`;
- a `.md` file with no frontmatter block.

---

## 12. Versioning

This document specifies PKF version **0.1**. Revisions are versioned as
`<major>.<minor>`.

While the major version is **0**, the specification is unstable: a
revision MAY introduce breaking changes without bumping the version at
all. `pkf_version` therefore identifies the series, not a stable
contract — a `0.x` bundle SHOULD be read against the current draft
rather than pinned to the revision it was written under.

From **1.0** onward:

- a **minor** bump adds optional fields or types without breaking
  compatibility;
- a **major** bump may rename required fields or change the structure
  of reserved files.

A bundle MAY declare the PKF version it targets via
`pkf_version: "0.1"` in the `client.md` frontmatter.

---

## Appendix A — Minimal example

```
client-acme/
├── client.md
├── stakeholders/
│   └── s001-jean-dupont.md
└── project-test-runs/
    ├── project.md
    ├── risks/
    │   └── r001-scope-creep.md
    ├── actions/
    │   └── a001-scope-framing.md
    └── team/
        └── as001-jdupont-sponsor.md
```

`client.md`:

```yaml
---
id: C001
type: Client
title: "Acme"
pkf_version: "0.1"
---
```

`project-test-runs/project.md`:

```yaml
---
id: P-TEST-RUNS
type: Project
title: "Test Runs"
client: C001
---
```

`project-test-runs/risks/r001-scope-creep.md`:

```yaml
---
id: R001
type: Risk
title: "Scope creep"
project: P-TEST-RUNS
category: Schedule
probability: Medium
impact: High
score: High
owner: S001
response_strategy: Mitigate
status: Open
---

# Description

New requirements could be added to the project without validation or
impact assessment, leading to delays and cost overruns.

# Comments

Reviewed in the 2026-07-08 steering committee; mitigation plan being
drafted.
```

`project-test-runs/actions/a001-scope-framing.md`:

```yaml
---
id: A001
type: Action
title: "Frame scope v2"
project: P-TEST-RUNS
owner: S001
category: Project Management
priority: High
status: In Progress
progress: 40
due_date: 2026-08-01
---
```

`project-test-runs/team/as001-jdupont-sponsor.md`:

```yaml
---
id: AS001
type: Assignment
project: P-TEST-RUNS
stakeholder: S001
role: Sponsor
side: Client
status: Active
---
```

---

## Appendix B — Risk score matrix

`Risk.score` is derived from `probability` and `impact`: a tool
computes it rather than reading a hand-authored value, per Goal 4
(§1) — a stored, hand-maintained `score` would desynchronize from
`probability`/`impact` as soon as either is edited. `score` MAY be
omitted from a bundle; when present, it SHOULD match this matrix.

| probability \ impact | Low    | Medium | High     | Critical |
|-----------------------|--------|--------|----------|----------|
| Low                   | Low    | Medium | Medium   | Medium   |
| Medium                | Medium | Medium | High     | High     |
| High                  | Medium | High   | High     | Critical |
| Very High             | Medium | High   | Critical | Critical |
