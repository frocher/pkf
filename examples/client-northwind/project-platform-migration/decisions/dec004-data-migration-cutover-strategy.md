---
id: DEC004
type: Decision
title: "Data migration cutover strategy"
description: "Choose between a single-window big-bang cutover and a phased dual-write approach for the legacy-to-new-platform data migration."
project: P-PLATFORM
context: "The migration runbook (D002) is nearing completion, but no cutover strategy has been validated yet; R001 (data migration failure) and req002 (zero-downtime cutover) both depend on this choice before M001 (legacy freeze) and M002 (checkout API go-live)."
alternatives: "Big-bang cutover in a single maintenance window, simplest to execute but highest downtime risk if validation fails; phased dual-write with legacy and new systems running in parallel during a validation period, lower risk but weeks of added reconciliation work."
decision: "Phased dual-write cutover, pending sign-off."
decision_maker: S002
status: Proposed
---
