---
id: R004
type: Risk
title: "Inconsistent UX across devices"
description: "Web and mobile teams building components independently is producing a visually inconsistent portal experience."
project: P-PORTAL
category: Functional
probability: Medium
impact: Medium
score: Medium
owner: S004
response_strategy: Mitigate
risk_status: Open
plan: "Adopt the shared component library (see DEC003) instead of per-team custom components."
---

# Description

The web and mobile teams building the Customer Portal Redesign
(`APP003`) have each been building their own UI components
independently, without a shared source of truth for what a button, a
form field, or a card should look like across the two platforms. That
independence made sense when each team was optimizing for its own
platform's idioms, but in practice it has produced a portal that
doesn't read as one product: the same logical screen — a product
page, a checkout step — can look and behave differently depending on
whether a customer is on the web app or the mobile app, right down to
small details like spacing, button styling, and interaction patterns.

This had already been a known problem before this risk was formally
tracked: a style-guide document existed as an earlier attempt to keep
the two teams aligned, but a document has no enforcement mechanism —
nothing stops an engineer from approximating the guide instead of
matching it exactly, and small approximations compound over many
screens and many months into visible drift. That prior failure is
precisely why `DEC003` rejected "write a better style guide" as an
alternative and instead committed to a shared component library with
design tokens: consistency enforced by the code both teams actually
import, rather than by a document both teams are expected to
remember to consult. The plan on this risk is that adoption, not a new
initiative — once the library lands and both teams build on top of it
rather than beside it, the structural cause of the inconsistency goes
away rather than being managed around.