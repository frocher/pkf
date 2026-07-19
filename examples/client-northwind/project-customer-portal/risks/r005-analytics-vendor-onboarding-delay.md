---
id: R005
type: Risk
title: "Analytics vendor onboarding delay"
project: P-PORTAL
category: Vendor
probability: Medium
impact: Medium
score: Medium
owner: S004
vendors: [V002]
response_strategy: Mitigate
status: Under Review
plan: "Escalate the onboarding paperwork with the analytics vendor; fall back to basic in-house event logging for the beta if unresolved by M003."
---

# Description

The portal's usage-analytics vendor (`V002`) has not yet been onboarded
as a formal `Vendor` object in this bundle — procurement is still
finalizing the contract. This is intentionally left unresolved to
illustrate §7: a relation whose target does not yet exist in the
bundle is not a blocking error for PKF tooling.
