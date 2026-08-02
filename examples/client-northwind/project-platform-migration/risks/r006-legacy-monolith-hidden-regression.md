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
risk_status: Open
review_date: 2026-07-10
plan: "Write a regression test suite (A006) covering the monolith's untested order-processing paths before any dual-write cutover begins."
---

# Description

The legacy monolith has no automated regression coverage for several
order-processing code paths, and the specific paths that are
uncovered are not the common ones — they are exercised only under
specific combinations of promotional discounts and refunds, the kind
of interaction that rarely shows up in manual testing because it
requires deliberately constructing an unusual order rather than
walking through a typical purchase flow. That combination of "rare to
trigger" and "untested" is exactly what makes this risk dangerous:
nothing about the current system's day-to-day behavior gives any
signal that these paths are fragile, because they mostly aren't being
exercised at all in production traffic patterns today.

The danger becomes concrete once the cutover strategy in `DEC004`
resolves toward a phased dual-write approach, which is the direction
that decision is currently leaning: during that phase, the new
platform starts routing live traffic through both the new
microservices and the legacy monolith side by side, which means the
monolith's untested paths would, for the first time, be exercised
under real production load and real customer-generated promo-and-
refund combinations rather than staying dormant. A silent regression
there would not throw an obvious error — it would produce an
incorrect order or refund total that might not be noticed until a
customer complains or a finance reconciliation catches a discrepancy,
by which point it may have affected a number of orders rather than
just one. This is why the risk is scored Critical (High probability,
Critical impact) despite the paths in question being individually
rare: the phased cutover is specifically the moment that removes the
one thing currently protecting the project from this exposure, which
is that the untested paths simply aren't being hit yet.

# Comments

Originally raised in the 2026-06 architecture review; re-assessment
was due 2026-07-10 and hasn't happened yet, as attention shifted to
the checkout event bus work (DEC001).
