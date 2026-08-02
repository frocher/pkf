---
id: V001
type: Vendor
title: "CloudScale Hosting"
description: "Hosting provider for the legacy monolith and the target managed Kubernetes offering used by the platform migration."
kind: Hosting provider
contact: ops@cloudscale.example
---

# Description

CloudScale Hosting is Northwind's long-standing infrastructure
provider, and currently holds two distinct roles on the Platform
Migration project at once. Historically, it has hosted the legacy
monolith (`APP001`) under a contract that predates the migration
entirely — a contract whose expiry date now sits ahead of the
project's planned decommission date for that same monolith, which is
exactly the exposure tracked as `R003` (legacy vendor contract
lapses). Separately, and more recently, CloudScale was also selected
in `DEC002` as the provider of the managed Kubernetes offering that
the new microservices architecture runs on, chosen over a
self-hosted alternative specifically to avoid adding control-plane
operations work onto a team already stretched by the migration
timeline.

That dual role is deliberate in this bundle: it is the same vendor
supplying both the infrastructure being retired and the infrastructure
replacing it, so any conversation with CloudScale about the legacy
contract's renewal or wind-down terms is happening in parallel with an
active commercial relationship for the new platform. The mitigation
plan on `R003` treats this as an opportunity rather than only a risk —
confirming renewal or graceful decommission terms for the old contract
before the legacy environment is actually taken offline, rather than
letting it lapse on its own schedule.
