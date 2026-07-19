---
id: DEC001
type: Decision
title: "Adopt event-driven architecture for checkout"
project: P-PLATFORM
context: "The legacy checkout flow is a synchronous chain of calls across billing, inventory, and shipping that fails as a unit under partial outages."
alternatives: "Keep synchronous orchestration with added retries; adopt a saga pattern over an event bus."
decision: "Adopt a saga pattern over an event bus (Kafka) for the checkout flow."
rationale: "Decouples the failure domains of billing, inventory, and shipping, and matches the target microservices architecture."
decision_maker: S002
decision_date: 2026-06-20
impact: "Requires the team to build event bus operational expertise; adds roughly two weeks to the Checkout API timeline."
status: Approved
actions: [A003]
---
