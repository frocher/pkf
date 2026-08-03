# `@pkf/core`

Shared TypeScript core for PKF tools.

The first slice provides:

- Markdown frontmatter parsing;
- narrative-document detection;
- PKF Object records;
- indexing by ID and path;
- text and type search;
- typed authored Relation resolution;
- computed inverse Relation edges;
- duplicate-ID and parsing diagnostics.

Extension relation definitions can be supplied through the optional
`relationDefinitions` argument of `buildBundleIndex`. A custom inverse
requires both the authored and inverse definitions in that registry.

`relationsOf(id)` returns authored and computed inverse edges originating
from the object. `referencedBy(id)` returns authored edges whose target is
the object.

The package is intentionally independent of Obsidian. Obsidian, the
CLI, the linter, and report generators should consume this package
through its public interface rather than reimplementing PKF parsing.

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```
