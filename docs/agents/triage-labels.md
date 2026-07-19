# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## Repo-specific labels

These are not triage roles — they classify the subject of an issue, and are applied *in addition to* a triage label from the table above.

| Label               | Meaning                                                        |
| ------------------- | -------------------------------------------------------------- |
| `spec-consistency`  | An internal inconsistency in a specification: the document contradicts itself, or the reference bundle in `examples/` contradicts the document. Distinct from `enhancement`, which proposes something the spec does not yet cover. |

Both spec documents are normative, so a contradiction is a defect even when nothing is "broken" — two conformant tools can read the same bundle differently. Prefer `spec-consistency` over `bug` for these.
