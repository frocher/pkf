---
id: R006
type: Risk
title: "Hidden regression in legacy monolith"
description: "Untested code paths in the legacy monolith could break silently once the new platform starts routing traffic to it during the phased cutover."
project: P-PLATFORM
category: Technical
probability: High
impact: Critical
score: Critical
owner: S003
response_strategy: Mitigate
status: Open
review_date: 2026-07-10
plan: "Write a regression test suite (A006) covering the monolith's untested order-processing paths before any dual-write cutover begins."
---

# Description

The legacy monolith has no automated regression coverage for several
order-processing code paths exercised only under specific promo and
refund combinations. A silent regression here would surface only once
the phased cutover (DEC004) starts routing live traffic through both
systems.

# Comments

Originally raised in the 2026-06 architecture review; re-assessment
was due 2026-07-10 and hasn't happened yet, as attention shifted to
the checkout event bus work (DEC001).
