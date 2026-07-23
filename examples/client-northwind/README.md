# Northwind — example PKF bundle

This is a fictional bundle used to exercise the
[PKF specification](../../skills/pkf/specs/PKF_SPEC.md) end to end. Northwind, its
projects, and everyone in it are invented for this example — it is not
a real client.

## What this bundle covers

- All 17 object types defined in PKF §6, at least once each.
- Two projects under one client (`project-platform-migration` and
  `project-customer-portal`), to exercise cross-project relations —
  see
  `project-customer-portal/dependencies/dep002-checkout-api-delivery.md`,
  which references the other project via `related_project`.
- The Assignment pattern (§8): `S002` (Marcus Chen) holds two
  different roles across the two projects (`Technical Lead` on the
  migration, `Technical Advisor` on the portal) without duplicating
  his `Stakeholder` record.
- Two intentional edge cases in the spec's tolerance rules:
  - `project-customer-portal/risks/r005-analytics-vendor-onboarding-delay.md`
    references a `Vendor` (`V002`) that does not exist anywhere in
    this bundle — a relation to a not-yet-created object, per §7.
  - `project-platform-migration/security-findings/sf001-exposed-admin-endpoint.md`
    uses `type: SecurityFinding`, which is not one of the core types
    in §6 — an extension type, per §10.
- `index.md` files in `project-platform-migration/risks/` and
  `project-platform-migration/actions/`, as an example of the
  optional §9 convention.

## Structure

Global, client-level catalogs (`stakeholders/`, `vendors/`, `teams/`,
`skills/`, `competencies/`) live at the bundle root, per §4.1. Each
project owns its own risks, actions, decisions, milestones,
deliveries, requirements, applications, dependencies, and skill
requirements, plus a `team/` folder of `Assignment` objects linking
back to the shared stakeholders.
