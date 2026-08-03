# `@pkf/core`

Shared TypeScript core for PKF tools. It owns PKF parsing, indexing,
relation resolution, and diagnostics. Consumers (Obsidian, the CLI,
future tools) should depend on the public surface exported from
`@pkf/core` rather than reimplementing that logic.

The public surface provides:

- `parseMarkdownObject(source)` — turns a Markdown document into a
  `ParsedDocument` (`object` / `narrative` / `invalid`) together with
  any frontmatter or ID diagnostics raised while parsing.
- `buildBundleIndex(sources, options?)` — indexes a stream of
  `MarkdownSource` documents and returns a `BundleIndex`:
  - `size`, `getById`, `getByPath`;
  - `search({ text?, type? })` over `id`, `type`, `title`,
    `description`, and `body`;
  - `relationsOf(id)` — authored edges originating from the object
    plus computed inverse edges;
  - `referencedBy(id)` — authored edges whose target is the object;
  - `diagnostics()` — frontmatter, ID, duplicate, and relation
    diagnostics emitted while indexing.
- `PKF_RELATION_DEFINITIONS` plus `getRelationDefinition` and
  `getRelationDefinitions` for the default relation registry.
- `isValidPkfId(id, type)` for the ID grammar check.

Extension relation definitions can be supplied through the optional
`relationDefinitions` argument of `buildBundleIndex`. A custom inverse
requires both the authored definition and its inverse definition in
that registry; the inverse edge is only computed when its
`RelationDefinition` has `authored: false`.

The package is intentionally independent of Obsidian and of any
particular CLI front-end.

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```
