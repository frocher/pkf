---
id: R002
type: Risk
title: "Key engineer attrition"
description: "Migration architecture knowledge sits with a single engineer, risking major delays if they leave."
project: P-PLATFORM
category: Organizational
probability: Low
impact: High
score: Medium
owner: S002
response_strategy: Mitigate
risk_status: Open
plan: "Pair Marcus with a second engineer on all critical migration components to avoid a single point of knowledge failure."
---

# Description

Most of the migration's architectural knowledge currently sits with a
single engineer, Marcus Chen, who is both the project's Technical Lead
(`AS002`) and, somewhat uncomfortably, the owner of this very risk
about his own attrition. He made or drove every major architectural
call on the project so far — the event-driven checkout design in
`DEC001`, the managed Kubernetes decision in `DEC002`, and the
still-open cutover strategy in `DEC004` — and he is the bundle's only
Expert-level holder of the Kubernetes competency (`COMP001`) that the
target infrastructure depends on. That concentration is a natural
byproduct of how the project got started: an early, small team moving
fast on a tight timeline naturally converges decisions onto whoever
has the clearest picture of the whole system, but it leaves the
project with essentially no redundancy on the decisions that matter
most.

The probability of Marcus actually leaving mid-project is assessed as
Low — there's no specific signal that he intends to — but the impact
if it happened is rated High, because the knowledge that would leave
with him is precisely the knowledge the remaining team would need
most urgently during the highest-stakes phase of the project: the
cutover itself. A departure in the weeks around `M001` (legacy
freeze) or `M002` (Checkout API go-live) would be far more damaging
than the same departure happening today, since decisions that are
still fresh and undocumented in his head would suddenly need to be
reconstructed under pressure. The mitigation plan — pairing him with a
second engineer on every critical migration component — is designed
to convert tacit knowledge into shared knowledge before that pressure
arrives, rather than after.
