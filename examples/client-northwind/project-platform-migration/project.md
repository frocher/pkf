---
id: P-PLATFORM
type: Project
title: "Platform Migration"
description: "Migrate Northwind's e-commerce platform from a legacy monolith to an event-driven microservices architecture on managed Kubernetes."
client: C001
---

# Description

The Platform Migration project re-platforms Northwind's e-commerce
back end off its aging legacy monolith (`APP001`) and onto a set of
independently deployable microservices, starting with checkout — the
single highest-risk, highest-value slice of the system, since it sits
directly on the revenue path and currently fails as one unit under
partial outages in billing, inventory, or shipping. The architectural
direction was set in `DEC001`: a saga pattern over a Kafka event bus
decouples those three failure domains from one another, at the cost of
the team needing to build operational expertise in an event bus it
has not run in production before. `DEC002` then settled the
infrastructure question underneath that architecture — a managed
Kubernetes offering from CloudScale Hosting (`V001`, the same vendor
that already hosts the legacy monolith) rather than a self-hosted
cluster, trading a somewhat higher hosting bill for not having to
staff dedicated platform operations during an already tight migration
timeline.

The riskiest single event in the project is not a code change but a
data event: the cutover of production order and customer data from
the legacy schema to the new platform's schema, tracked as `R001`
(possible data corruption during cutover) and governed by `DEC004`,
which is choosing between a big-bang cutover in one maintenance window
and a slower, safer phased dual-write approach. That decision is still
`Proposed` and is blocking both `M001` (freezing the legacy system) and
`M002` (the Checkout API's go-live), which makes it the most consequential
open decision on the project's critical path. A second, quieter risk
sits underneath the first: the legacy monolith has no automated
regression coverage over several order-processing paths that only
execute under specific promo-and-refund combinations (`R006`), so a
silent regression there would only surface once the phased cutover
starts routing live traffic through both systems side by side.

The project's other standing exposure is organizational rather than
technical: most of the migration's architectural knowledge currently
lives with one engineer, Marcus Chen (`R002`), which is why the
mitigation plan pairs him with a second engineer on every critical
migration component rather than letting that knowledge stay
concentrated. Regulatory scope is set by `REQ003` (PCI DSS compliance
for payment data, already validated) and `REQ001`/`REQ002` (idempotent
retries and a zero-downtime cutover, both still in progress), and the
new Checkout API (`APP002`, delivered as `D001`) is itself a hard
dependency for the Customer Portal Redesign project, whose own launch
cannot happen before this one ships (see `DEP002` in that project).
