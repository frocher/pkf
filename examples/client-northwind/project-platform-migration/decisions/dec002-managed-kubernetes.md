---
id: DEC002
type: Decision
title: "Use managed Kubernetes over self-hosted"
project: P-PLATFORM
context: "The new microservices need a container orchestration platform, and the team must choose between a managed offering and self-hosting on existing infrastructure."
alternatives: "Self-hosted Kubernetes on CloudScale bare metal; managed Kubernetes offering; Nomad."
decision: "Use CloudScale's managed Kubernetes offering."
rationale: "Removes control-plane operational burden from a small team already stretched by the migration timeline."
decision_maker: S002
decision_date: 2026-06-25
impact: "Slightly higher hosting cost; no need to hire dedicated platform ops staff for the migration."
status: Approved
---
