---
id: SF001
type: SecurityFinding
title: "Exposed admin endpoint on staging cluster"
project: P-PLATFORM
severity: High
discovered_date: 2026-07-05
status: Open
owner: S003
---

# Description

The staging Kubernetes cluster exposes an admin endpoint
(`/actuator/env`) without authentication. `SecurityFinding` is not
part of the PKF core model (§6) — this file exists to demonstrate the
extension mechanism described in §10: an unrecognized `type` must
still be treated as a valid, generic object by conformant tooling.

# Comments

Filed as an example of an organization-specific extension type; a real
bundle would define its own conventions for `SecurityFinding` fields.
