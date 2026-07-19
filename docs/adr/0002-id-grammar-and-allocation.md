# ID format: type-conditional grammar; collisions closed by process, not scheme

§3 defined `id` by example only (`R001`, `A014`, `AS007`), the
reference bundle mixes those numeric-prefix ids with a slug id for
`Project` (`P-PLATFORM`), and nothing said whether relation
resolution is case-sensitive. Separately, §11.2 requires bundle-wide
uniqueness but nothing governs allocation, so two branches in the
monorepo+PR workflow §4.1 recommends can independently pick the same
next id — a collision Git won't flag, since the two files have
different names (#10).

**Grammar.** The default form is `[A-Z]+[0-9]+` — one or more
uppercase letters, one or more digits, no fixed width. Prefix letters
are the author's choice; the R/A/M/S/COMP/SK/... mapping already used
in `examples/` stays illustrative, not a normative per-type table.
`Project` keeps its existing slug form, `P-[A-Z0-9-]+`, as a
deliberate, narrowly-scoped exception: Project ids are referenced far
more often, and are far lower in cardinality, than any other type, so
eye-resolution (`P-PLATFORM`) is worth more than the collision-safety
a padded number would buy. Both forms are uppercase-only; relation
resolution is a case-sensitive exact string match — a lowercase id or
reference is invalid grammar, not something a tool normalizes. This
doesn't conflict with §4.3's `<lowercase-id>-<slug>.md` filename
convention: §4.3 already treats the filename as indicative, with the
frontmatter `id` remaining canonical.

**Allocation.** Concurrent-allocation collisions are closed by
process, not by changing the grammar above. §11.2's uniqueness
requirement is unchanged. What's new: bundles using the §4.1
monorepo+PR workflow SHOULD run a conformant validator as a required
PR check, with the PR's base kept up to date before merge is allowed
(e.g. GitHub's "require branches to be up to date before merging").
Without that qualifier, two independently-green PRs can still land
the same id — exactly the race #10 reports.

## Considered options

- Normalize `Project` to the numeric form (`P001`) — rejected; loses
  the readability the slug buys for a type that's referenced
  constantly and rarely numerous.
- A general "any type may define a slug form" mechanism — rejected;
  widens the exception's blast radius and complicates a validator's
  job (detect the right grammar per type) for no real gain over
  handling `Project` alone.
- A collision-resistant id scheme (random suffixes, or per-author
  reserved number ranges) instead of a process fix — rejected; it
  undermines the sequential, human-readable ids this decision
  otherwise keeps, to solve a problem — a same-type id collision —
  that's cheap to fix after the fact with a rename, once CI actually
  catches it before merge.
