---
id: A006
type: Action
title: "Write legacy monolith regression tests"
description: "Cover the monolith's untested order-processing paths before the phased cutover begins."
project: P-PLATFORM
owner: S003
category: Testing
priority: High
status: To Do
progress: 0
due_date: 2026-07-15
---

# Description

Directly mitigates R006 (hidden regression in the legacy monolith):
without this coverage, a regression during the dual-write cutover
(DEC004) would surface only in production.

# Comments

Due date slipped while the team prioritized the checkout event bus
work (DEC001); not yet restarted.
