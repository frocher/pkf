# `@pkf/cli`

Command-line entry point for PKF Bundles. It consumes `@pkf/core` and
does not implement parsing or Relation resolution itself.

## Commands

```bash
pkf inspect <bundle-path>
pkf lint <bundle-path>
```

`inspect` prints a summary of indexed Objects (count, per-type
breakdown), resolved Relations (authored vs. inverse), and the
diagnostics produced by the core. It exits `0`.

`lint` prints the diagnostics produced by the core (sorted by path
and code) and exits `1` when at least one diagnostic has severity
`error`, `0` otherwise. Unknown commands and bad arguments exit `2`.

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```
