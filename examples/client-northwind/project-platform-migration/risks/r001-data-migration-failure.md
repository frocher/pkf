---
id: R001
type: Risk
title: "Data migration failure"
description: "A migration script error could corrupt customer order data during the cutover."
project: P-PLATFORM
category: Technical
probability: Medium
impact: Critical
score: High
owner: S002
response_strategy: Mitigate
risk_status: Open
plan: "Run a full dry-run migration against a production data snapshot before the cutover window; keep the legacy system read-only for 48 hours as a rollback path."
---

# Description

The legacy monolith's data model diverges from the target schema in
several places that have each accumulated their own quirks over the
years the monolith has been in production: order history is stored in
a denormalized shape that doesn't map cleanly onto the new platform's
normalized schema, and currency handling is inconsistent across older
and newer order records, with some rows carrying values in ways that
predate a currency-formatting change made years ago and never
back-filled. Any migration script written against this data has to
account for all of these divergences correctly, simultaneously, and
under time pressure, since the cutover is expected to run inside a
bounded maintenance window rather than at leisure. A script error —
whether a straightforward bug, an edge case in the currency handling
that wasn't anticipated, or a subtle off-by-one in how denormalized
history gets restructured — could corrupt customer order data during
that cutover, and because the cutover is the point where the legacy
system stops being the source of truth, there may be a limited or
nonexistent window in which to detect and reverse that corruption
before customer-facing symptoms appear (wrong order totals, missing
history, incorrect billing).

This is why the risk's mitigation plan is built around two
independent safety nets rather than one: a full dry-run of the
migration against an actual production data snapshot, run before the
cutover window itself so that whatever the dry-run turns up can be
fixed in the script ahead of time rather than discovered live; and,
separately, keeping the legacy system in a read-only state for 48
hours after the cutover as a rollback path, so that if something is
wrong with the migrated data that the dry-run didn't catch, there is
still an authoritative, unmodified copy of the pre-cutover state to
fall back to. The choice between a single-window cutover and a phased
dual-write approach — still open in `DEC004` — bears directly on how
much this risk matters in practice: a phased approach would give this
risk more time to surface problems gradually rather than all at once,
at the cost of weeks of additional reconciliation work between the two
systems running in parallel.

# Comments

Flagged during the 2026-07-10 architecture review. A dry-run against a
snapshot is scheduled before M001.
