# PKF / OFK

This repo publishes two open Markdown-based specifications for
representing a project's people, risks, decisions, and deliveries
(PKF), and a related general format for knowledge around data and
systems (OFK). This context covers the domain vocabulary the specs
themselves define.

## Language

**Stakeholder**:
A person involved in a project, defined once as a single global
object regardless of how many projects they're assigned to. Carries
identity facts only (name, contact, home organization).
_Avoid_: Contact, person, user.

**organization** (Stakeholder field):
The stakeholder's fixed home entity — who they belong to, as an
identity fact rather than something that varies by engagement. See
[ADR-0001](docs/adr/0001-stakeholder-organization-relation.md).
_Avoid_: Using this interchangeably with `side` — see below.

**side** (Assignment field):
Which side of the table a Stakeholder sits on for one specific
project engagement. An engagement fact, distinct from `organization`
even though the two usually agree. See [ADR-0001](docs/adr/0001-stakeholder-organization-relation.md).
_Avoid_: Organization, home org.

**Assignment**:
Attaches a Stakeholder to a project with a role and side specific to
that project, so the same person can hold different roles across
projects without duplicating their identity.
_Avoid_: Role, membership.
