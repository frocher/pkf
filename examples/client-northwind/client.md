---
id: C001
type: Client
title: "Northwind"
description: "Mid-size e-commerce retailer migrating off a legacy monolith and redesigning its customer-facing portal."
pkf_version: "0.1"
---

# Description

Northwind is a mid-size e-commerce retailer that has grown steadily
over the past decade on top of a single monolithic application
originally built for a much smaller catalog and a much smaller volume
of orders. That monolith now underpins every customer-facing and
back-office process — catalog, checkout, billing, inventory, and
shipping — and its age is starting to show: the data model has
accumulated years of ad hoc changes (denormalized order history,
inconsistent currency handling), releases are risky because so much
logic is entangled in one deployable unit, and the one or two
engineers who understand its darkest corners are a standing
organizational risk in their own right.

Two engagements are currently underway to address this. The first,
tracked as the `Platform Migration` project, re-platforms the
back-end onto an event-driven microservices architecture running on a
managed Kubernetes offering, with the legacy monolith decommissioned
once the new checkout path has proven itself in production. The
second, the `Customer Portal Redesign`, rebuilds the customer-facing
web and mobile experience on a shared, component-driven design system
so that the two channels stop drifting apart visually, and so the
portal meets modern accessibility requirements. The two projects
share a client sponsor structure and, in one case, a person (Marcus
Chen, `S002`), who is Technical Lead on the migration and Technical
Advisor on the portal — the same underlying engineering organization
is stretched across both efforts, which is itself a scheduling
consideration for both projects' steering committees.

Northwind's own staff sit on the client side of both engagements as
sponsors, product owners, and subject-matter reviewers, while the
engineering work is largely delivered by an external team; see the
`stakeholders/` and `teams/` catalogs at the root of this bundle for
who specifically is involved, and each project's own `team/` folder
for the project-specific assignment of those people.
