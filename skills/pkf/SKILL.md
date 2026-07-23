---
name: pkf
description: Route a project manager's or program director's natural-language request against a PKF bundle (client.md, project.md, risks/, actions/, decisions/, milestones/, deliveries/...) to the right workflow — referential bootstrap, project bootstrap, action tracking, milestone/delivery prep, dictated capture, meeting-notes ingestion, consistency checks, decision arbitration, milestone/delivery sign-off, portfolio dashboard, resource/skill monitoring, status reporting, risk review. Use when the user wants to check status, update objects, prepare a review, produce a report, or stand up a new client/project, rather than hand-editing files.
---

Routes a request against a PKF bundle to one of 13 workflows, without
ever requiring the user to name a role or memorize the spec.

## Principle: propose, never write

Every workflow that touches the bundle **proposes** the objects or
field changes it wants to make — target file, fields, relations — and
waits for the user to validate before writing anything. No workflow
writes to the bundle on its own initiative. This principle isn't
re-argued in each workflow file below — but each still ends its own
write step on a concrete "propose, then wait for validation"
instruction, since that's the step's completion criterion, not a
restatement of the principle.

## Routing: intention first, catalogue as the net

The user's phrasing maps directly to a workflow. **Role is never a
gate** — a request is routed by what it asks for, not by asking "are
you the project manager or the program director?" first. The same
person may hold both hats across different projects of the same
bundle, and nothing in an invocation identifies who is asking.

1. Match the request against the trigger phrasing in the catalogue
   below.
2. If it matches exactly one workflow, load that workflow file and
   follow it.
3. If it matches more than one (e.g. "give me a picture of the
   project" could mean reporting or the portfolio dashboard), present
   the candidates by name and ask which one, rather than guessing.
4. If the request is bare ("what can you do with this bundle?" or
   invoking the skill with no further detail), present the catalogue
   below grouped by altitude, so the user can pick.

### Catalogue

**Setup — standing up a new client or project, scope = the client or one project**

| Workflow | File | Ask for it with |
|---|---|---|
| Referential bootstrap | `workflows/referential-bootstrap.md` | "onboard a new client", "set up the referential for X" — only when the client has no `client.md` yet |
| Project bootstrap | `workflows/project-bootstrap.md` | "start a new project for X", "set up P-XXX" — only when the client exists but this project doesn't |

**Operational — project manager, scope = one project**

| Workflow | File | Ask for it with |
|---|---|---|
| Action tracking | `workflows/action-tracking.md` | "what's in progress / blocked / overdue", "chase down owners" |
| Milestone / delivery prep | `workflows/milestone-delivery-prep.md` | "get M004 ready", "check we're ready for the launch milestone" |
| Dictated capture | `workflows/dictated-capture.md` | "log a risk/action/decision I just thought of", "add a new stakeholder/vendor to the team", "assign Marcus to the new project" — any addition to a bundle whose referential already exists |
| Meeting-notes ingestion | `workflows/meeting-notes-ingest.md` | "file these meeting notes", "pull the actions out of this CR" |
| Consistency check | `workflows/consistency-check.md` | "sanity-check the bundle", "find missing owners / orphaned objects" |

**Oversight — program director, scope = every project of the client**

| Workflow | File | Ask for it with |
|---|---|---|
| Decision arbitration | `workflows/decision-arbitration.md` | "what decisions are waiting on me", "approve/reject D0xx" |
| Milestone / delivery sign-off | `workflows/milestone-delivery-signoff.md` | "go/no-go on the upcoming milestones", "which deliveries are at risk" |
| Portfolio dashboard | `workflows/portfolio-dashboard.md` | "show me the portfolio", "where is it stuck across projects" |
| Resource & skill monitoring | `workflows/resource-skill-monitoring.md` | "are we short on any skills", "how loaded are the teams" |

**Cross-cutting — parameterized by role, not duplicated**

| Workflow | File | Ask for it with |
|---|---|---|
| Status reporting | `workflows/status-reporting.md` | "write a status report" (scope: project or portfolio) |
| Risk review | `workflows/risk-review.md` | "review the risks", "what's Critical/High" (scope + severity, independent) |

Both cross-cutting workflows take parameters. Resolve each as follows,
in order, and always confirm the resolved value with the user before
proceeding:

1. **Extract from the request** — "on the portfolio", "Critical/High
   only", "for my project" set the parameter directly.
2. **Otherwise, default from the bundle's shape** — a bundle with one
   `project-*/` folder defaults scope to that project; a bundle with
   several defaults to... nothing: **propose** the choice (which
   project, or the whole portfolio) rather than picking one.
3. **Never silently assume** — state the resolved or proposed value
   back to the user as part of the workflow's first response.

## Object map

Every workflow refers to PKF object types by pointing here rather than
restating the spec. Anchors are into `specs/PKF_SPEC.md`, embedded in
this skill so it is self-contained.

| Object type | Spec section |
|---|---|
| Action | [specs/PKF_SPEC.md#action](specs/PKF_SPEC.md#action) |
| Application | [specs/PKF_SPEC.md#application](specs/PKF_SPEC.md#application) |
| Assignment | [specs/PKF_SPEC.md#assignment](specs/PKF_SPEC.md#assignment) |
| Client | [specs/PKF_SPEC.md#client](specs/PKF_SPEC.md#client) |
| Competency | [specs/PKF_SPEC.md#competency](specs/PKF_SPEC.md#competency) |
| Decision | [specs/PKF_SPEC.md#decision](specs/PKF_SPEC.md#decision) |
| Delivery | [specs/PKF_SPEC.md#delivery](specs/PKF_SPEC.md#delivery) |
| Dependency | [specs/PKF_SPEC.md#dependency](specs/PKF_SPEC.md#dependency) |
| Milestone | [specs/PKF_SPEC.md#milestone](specs/PKF_SPEC.md#milestone) |
| Project | [specs/PKF_SPEC.md#project](specs/PKF_SPEC.md#project) |
| Requirement | [specs/PKF_SPEC.md#requirement](specs/PKF_SPEC.md#requirement) |
| Risk | [specs/PKF_SPEC.md#risk](specs/PKF_SPEC.md#risk) |
| Skill | [specs/PKF_SPEC.md#skill](specs/PKF_SPEC.md#skill) |
| SkillRequirement | [specs/PKF_SPEC.md#skillrequirement](specs/PKF_SPEC.md#skillrequirement) |
| Stakeholder | [specs/PKF_SPEC.md#stakeholder](specs/PKF_SPEC.md#stakeholder) |
| Team | [specs/PKF_SPEC.md#team](specs/PKF_SPEC.md#team) |
| Vendor | [specs/PKF_SPEC.md#vendor](specs/PKF_SPEC.md#vendor) |

Process sections, referenced the same way when a workflow needs the
mechanics rather than a single type:

| Topic | Spec section |
|---|---|
| Bundle structure (client vs project scope) | [specs/PKF_SPEC.md#4-bundle-structure](specs/PKF_SPEC.md#4-bundle-structure) |
| Relations, authored vs inverse | [specs/PKF_SPEC.md#7-relations](specs/PKF_SPEC.md#7-relations) |
| The Assignment pattern (role/side per project) | [specs/PKF_SPEC.md#8-the-assignment-pattern](specs/PKF_SPEC.md#8-the-assignment-pattern) |
| Conformance rules | [specs/PKF_SPEC.md#11-conformance](specs/PKF_SPEC.md#11-conformance) |

`specs/OKF_SPEC.md` is embedded alongside PKF for reference only — no
workflow in this skill targets it.
