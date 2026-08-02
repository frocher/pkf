---
id: S002
type: Stakeholder
title: "Marcus Chen"
description: "Technical Lead on the Platform Migration and Technical Advisor on the Customer Portal Redesign."
job_title: Technical Lead
email: marcus.chen@ourfirm.example
---

# Description

Marcus Chen is an internal Technical Lead who holds two different
roles across Northwind's two projects without those roles being two
different `Stakeholder` records — the canonical example in this
bundle of the Assignment pattern described in PKF §8. On the Platform
Migration project he is Technical Lead (`AS002`, active since
2026-05-01), where he owns the architecture decisions that shape the
whole engagement (`DEC001`, adopting an event-driven checkout;
`DEC002`, choosing managed Kubernetes; `DEC004`, still-`Proposed`
cutover strategy) and is the named owner on both of the project's
highest-severity risks (`R001`, data migration failure; `R002`, key
engineer attrition — an uncomfortable irony, since the attrition risk
is largely about the concentration of knowledge in Marcus himself).
He also holds the bundle's only Expert-level Kubernetes competency
(`COMP001`, six years of experience, certified), which is exactly the
skill the migration's infrastructure decisions depend on (`SK001`,
`SR001`).

On the Customer Portal Redesign project, by contrast, he is Technical
Advisor rather than Technical Lead (`AS005`, active since
2026-06-15, a role that started a month and a half after his
migration assignment) — a lighter-weight, cross-project consulting
role rather than day-to-day ownership, since that project's actual
technical direction sits with its own client-side Product Owner,
Jordan Blake (`S004`). The two assignments together are the reason
both projects' steering committees need to account for his time as a
shared, finite resource rather than assuming either project has him
full-time.
