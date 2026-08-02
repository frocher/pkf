---
id: R003
type: Risk
title: "Legacy vendor contract lapses"
description: "The legacy monolith's hosting contract expires before the planned decommission date."
project: P-PLATFORM
category: Vendor
probability: Low
impact: Medium
score: Medium
owner: S002
vendors: [V001]
response_strategy: Accept
risk_status: Under Review
plan: "Confirm renewal terms with CloudScale Hosting before the legacy environment is due to be decommissioned."
---

# Description

The legacy monolith (`APP001`) still runs on infrastructure hosted by
CloudScale Hosting (`V001`) under a contract that predates this
migration project entirely, and whose expiry date falls before the
project's planned decommission date for that same monolith. In other
words, if nothing is done, the contract covering the environment the
legacy system depends on would lapse while that system is still
expected to be in production — a gap that would leave the monolith
running on infrastructure Northwind no longer has a contractual right
to, or force an unplanned, unbudgeted renewal negotiated from a
position of urgency rather than of choice.

What keeps this risk's assessed probability Low despite that mismatch
in dates is that CloudScale is not a vendor relationship at risk of
disappearing — the same vendor was just selected in `DEC002` to
provide the managed Kubernetes offering the new microservices
architecture will run on, so there is an active, healthy, and
currently-being-negotiated commercial relationship with them in
parallel. That is also why the response strategy here is Accept
rather than Mitigate: the team isn't trying to prevent the contract
mismatch so much as manage it deliberately, folding the legacy
contract's renewal or wind-down terms into the broader conversation
already underway about the new Kubernetes contract, rather than
treating it as a separate emergency. The plan is simply to confirm
those renewal terms explicitly before the legacy environment is
actually taken offline, so the mismatch closes on the project's own
schedule rather than the vendor's.
