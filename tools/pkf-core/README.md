# `@pkf/core`

Shared TypeScript core for PKF tools.

The first slice provides:

- Markdown frontmatter parsing;
- narrative-document detection;
- PKF Object records;
- indexing by ID and path;
- text and type search;
- duplicate-ID and parsing diagnostics.

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
