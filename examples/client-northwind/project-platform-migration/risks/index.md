# Risks

* [R001 — Data migration failure](r001-data-migration-failure.md) — A migration script error could corrupt customer order data during the cutover.
* [R002 — Key engineer attrition](r002-key-engineer-attrition.md) — Migration architecture knowledge sits with a single engineer, risking major delays if they leave.
* [R003 — Legacy vendor contract lapses](r003-legacy-vendor-contract-lapses.md) — The legacy monolith's hosting contract expires before the planned decommission date.
* [R006 — Hidden regression in legacy monolith](r006-legacy-monolith-hidden-regression.md) — Untested code paths in the legacy monolith could break silently once the new platform starts routing traffic to it during the phased cutover.
