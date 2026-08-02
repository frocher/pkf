# `status` is renamed to `<type>_status` per object type

While comparing PKF against the sibling OKF spec (also published from
this repo), we noticed both use the frontmatter key `status` with
unrelated meanings: OKF v0.2's `status` is a generic lifecycle field
(`draft` / `stable` / `deprecated`, §5.4 of OKF_SPEC.md), while PKF's
`status` is a closed, type-specific business enum (`Risk.status: Open
| ...`, `Decision.status: Proposed | ...`, and six more).

No bundle ever mixes the two formats — an OKF concept file is never a
PKF object file — so this was never a technical collision, only a risk
of confusion for anyone reading both specs side by side in this repo.

We considered reserving bare `status` for a future OKF-style lifecycle
field on PKF objects, but rejected it: PKF's per-type `status` enums
already encode a draft-like state where relevant (e.g.
`Requirement.status: Draft`), so a separate generic lifecycle field
would be redundant, not complementary. There is no future field to
reserve `status` for.

We renamed `status` to `<type>_status` (`risk_status`, `action_status`,
`assignment_status`, `decision_status`, `delivery_status`,
`dependency_status`, `milestone_status`, `requirement_status`) on all
8 core types that carry it, plus the `SecurityFinding` extension type
used in the reference example bundle (`security_finding_status`), for
the same clarity reason. Applied uniformly rather than to `Risk` alone
— a partial rename would leave a reader without a memorizable rule for
which types use the bare name and which don't.

Consequence: `status` is no longer listed as a common frontmatter field
in §5.1's generic object template — it was only ever type-specific in
practice (a different closed enum per type), and the rename makes that
explicit.
