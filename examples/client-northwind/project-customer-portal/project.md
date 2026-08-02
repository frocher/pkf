---
id: P-PORTAL
type: Project
title: "Customer Portal Redesign"
description: "Redesign Northwind's customer-facing portal on a shared, component-driven design system for a consistent experience across web and mobile."
client: C001
---

# Description

The Customer Portal Redesign project rebuilds Northwind's
customer-facing web and mobile experience (`APP003`) around a shared,
component-driven design system rather than the per-team custom
components each channel's engineers had been building independently.
That drift had already produced a visible inconsistency risk
(`R004`): web and mobile screens for the same flow no longer looked or
behaved alike, and a style-guide document alone had failed to stop the
divergence in the past. `DEC003` resolved this by committing to a real
shared component library with design tokens, consumed by both
channels at the code level — a two-week up-front investment for the
design and frontend teams before feature work resumes, with `M003`
(design system finalized) as the gate the rest of the build depends
on.

Two requirements shape the rebuild beyond visual consistency:
`REQ004`, which commits the portal to WCAG 2.1 AA accessibility and is
still in `Draft`, and `REQ005`, an offline cart-persistence
requirement that lets a customer's in-progress cart survive a dropped
connection on mobile. The project's own timeline is also hostage to a
dependency it does not control: `DEP002` ties the portal's checkout
flow directly to the Checkout API being built by the separate Platform
Migration project, so the portal cannot go live (`M004`) until that
API ships (`M002`/`D001` on the other project) — a cross-project
coupling deliberately kept in this bundle to exercise PKF's
`related_project` relation. A second, lower-probability risk sits on
the vendor side: the portal's usage-analytics provider (`R005`) has
not yet completed onboarding, and procurement has not yet turned it
into a formal `Vendor` object in this bundle at all, which is itself
an intentional edge case for how PKF tools should tolerate a relation
to an object that doesn't exist yet.

Delivery is staged through a beta (`D003`, gated on the finalized
design system) ahead of the public launch (`M004`), which the team is
deliberately timing to land before the holiday shopping season —
slipping that date is called out explicitly in `M004`'s
`impact_description` as pushing the launch past the window it exists
to catch.
