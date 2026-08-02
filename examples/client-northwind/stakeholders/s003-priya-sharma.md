---
id: S003
type: Stakeholder
title: "Priya Sharma"
description: "Developer on the Platform Migration project, owner of the hidden-regression risk in the legacy monolith."
job_title: Software Engineer
email: priya.sharma@ourfirm.example
---

# Description

Priya Sharma is an internal Software Engineer assigned as a Developer
on the Platform Migration project (`AS003`, active since 2026-05-15).
Her work sits mostly on the compliance and quality-assurance side of
the migration rather than its architecture: she owns `REQ003` (PCI
DSS compliance for payment data, already `Validated`), the migration
runbook delivery (`D002`, in progress) and the underlying
documentation action (`A001`), the security review of the new auth
service (`A003`), and the security finding raised against the staging
cluster's exposed admin endpoint (`SF001`). She is also the owner of
`R006`, the risk that the legacy monolith's untested
order-processing paths could regress silently once the phased cutover
starts routing live traffic through both systems, and of `A006`, the
regression-test action meant to close that gap — an action whose due
date has already slipped once while the team's attention went to the
checkout event bus work (`DEC001`) instead. She additionally owns
`A007`, integration tests against the payment gateway's sandbox
environment, currently `Blocked` on sandbox credentials the project is
still waiting on (`DEP001`).

Separately from her assignment on the migration project, she is
recorded as holding an Advanced-level React competency (`COMP002`,
four years of experience, not yet certified) — the exact skill the
Customer Portal Redesign project is short on staffing for (`SK002`,
`SR003`), though she is not currently assigned to that project.
