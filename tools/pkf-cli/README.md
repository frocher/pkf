# `@pkf/cli`

Command-line entry point for PKF Bundles. It consumes `@pkf/core` and
does not implement parsing or Relation resolution itself.

## Commands

```bash
pkf inspect <bundle-path>
pkf lint <bundle-path>
```

`inspect` summarizes indexed Objects, resolved Relations, diagnostics,
and Object types. `lint` prints the diagnostics produced by the core and
returns exit code `1` when at least one diagnostic has severity `error`.

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```
