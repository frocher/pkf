---
id: R001
type: Risk
title: "Data migration failure"
project: P-PLATFORM
category: Technical
probability: Medium
impact: Critical
score: High
owner: S002
response_strategy: Mitigate
status: Open
plan: "Run a full dry-run migration against a production data snapshot before the cutover window; keep the legacy system read-only for 48 hours as a rollback path."
---

# Description

The legacy monolith's data model diverges from the target schema in
several places (denormalized order history, inconsistent currency
handling). A migration script error could corrupt customer order data
during the cutover.

# Comments

Flagged during the 2026-07-10 architecture review. A dry-run against a
snapshot is scheduled before M001.
