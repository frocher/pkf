---
id: R005
type: Risk
title: "Analytics vendor onboarding delay"
description: "The portal's usage-analytics vendor onboarding is stalled in procurement, threatening the beta timeline."
project: P-PORTAL
category: Vendor
probability: Medium
impact: Medium
score: Medium
owner: S004
vendors: [V002]
response_strategy: Mitigate
risk_status: Under Review
plan: "Escalate the onboarding paperwork with the analytics vendor; fall back to basic in-house event logging for the beta if unresolved by M003."
---

# Description

The Customer Portal Redesign project needs usage analytics in place
before its beta (`D003`) can generate any meaningful signal about how
internal staff are actually using the new experience — without it,
the beta would ship blind, and the feedback survey planned alongside
it would be the only source of insight into real usage rather than
one input among several. The vendor selected to provide that
analytics capability, referenced here as `V002`, is still working
through Northwind's procurement process: the contract paperwork has
not been finalized, and as a result the vendor has not been onboarded
either technically (no integration work has started) or
administratively — it does not yet exist anywhere else in this
bundle as a formal `Vendor` object, unlike CloudScale Hosting (`V001`),
which does.

That absence is deliberate rather than an oversight in how this
example bundle was put together: `R005` is one of two intentional edge
cases built into this bundle to exercise PKF's tolerance rules under
§7. A relation — here, the `vendors: [V002]` field on this risk's
frontmatter — is allowed to point at an object that does not (yet)
exist anywhere in the bundle, and conformant tooling must treat that
as a normal, resolvable-later reference rather than as a validation
error that blocks reading the file. In the story this bundle tells,
that's simply the ordinary state of a vendor relationship that is
real and active in procurement but hasn't cleared onboarding yet; the
mitigation plan treats the underlying schedule risk accordingly —
escalating the paperwork directly, and falling back to basic in-house
event logging for the beta if the vendor still isn't onboarded by the
time `M003` (design system finalized) is reached.
