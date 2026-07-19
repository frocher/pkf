# Stakeholder.organization is a relation, not free text

`Stakeholder.organization` (§6) was free prose with no type, enum, or
Relations entry, so it couldn't be resolved to an object — the
reference bundle stored directory slugs (`client-northwind`) instead
of ids. It also read as a near-duplicate of `Assignment.side`
(Client/Internal/Vendor, §8).

We decided the two fields are distinct, not redundant:
`organization` is the stakeholder's fixed home entity, an identity
fact authored once on the global Stakeholder object; `Assignment.side`
is which side of the table they sit on for one specific project
engagement, authored per Assignment. They usually agree but can
diverge (e.g. a contractor who is Internal on one engagement and
Vendor on another), so both stay.

`organization` becomes a relation: `organization` → Client | Vendor
(0..1), absent meaning internal — no explicit `Internal` enum value.
It stays authored-only, with no inverse on Client/Vendor, matching the
existing one-sided relations in §7.1 (`Vendor.projects`,
`Decision.actions`): "which stakeholders belong to vendor V001" is
answered by filtering Stakeholder objects, not by a stored inverse
field. The field keeps its existing name — only its type changes.

## Considered options

- Enum (`Client | Internal | Vendor`) plus a separate relation for the
  specific entity — rejected as two fields that must be kept in sync,
  for no benefit over resolving the relation's target type directly.
- An inverse relation (`Client.stakeholders` / `Vendor.stakeholders`)
  — rejected; nothing else in §7.1 needs a *filter-derived* inverse,
  and it would introduce the first inverse pointing at one of two
  possible target types.
