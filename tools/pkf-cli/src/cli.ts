import { buildBundleIndex, type Diagnostic, type MarkdownSource } from "@pkf/core";
import { readdir, readFile, stat } from "node:fs/promises";
import { relative, resolve } from "node:path";

export interface CliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

const usage = `Usage: pkf <inspect|lint> <bundle-path>

Commands:
  inspect  Summarize a PKF Bundle.
  lint     Print PKF diagnostics for a Bundle.
`;

async function readBundleSources(root: string): Promise<MarkdownSource[]> {
  const sources: MarkdownSource[] = [];

  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        sources.push({
          path: relative(root, path),
          content: await readFile(path, "utf8"),
        });
      }
    }
  }

  await visit(root);
  return sources;
}

function diagnosticCounts(diagnostics: readonly Diagnostic[]): {
  errors: number;
  warnings: number;
} {
  return diagnostics.reduce(
    (counts, diagnostic) => ({
      errors: counts.errors + (diagnostic.severity === "error" ? 1 : 0),
      warnings: counts.warnings + (diagnostic.severity === "warning" ? 1 : 0),
    }),
    { errors: 0, warnings: 0 },
  );
}

function formatCount(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function formatDiagnostic(diagnostic: Diagnostic): string {
  const location = diagnostic.path ?? "<bundle>";
  const id = diagnostic.id ? ` [${diagnostic.id}]` : "";
  const field = diagnostic.field ? ` ${diagnostic.field}` : "";

  return `${diagnostic.severity.toUpperCase()} ${diagnostic.code} ${location}${id}${field}: ${diagnostic.message}`;
}

function inspectOutput(sources: MarkdownSource[]): string {
  const index = buildBundleIndex(sources);
  const objects = index.search();
  const diagnostics = index.diagnostics();
  const counts = diagnosticCounts(diagnostics);
  const types = new Map<string, number>();
  let authoredRelations = 0;
  let inverseRelations = 0;

  for (const object of objects) {
    types.set(object.type, (types.get(object.type) ?? 0) + 1);
    for (const relation of index.relationsOf(object.id)) {
      if (relation.direction === "authored") {
        authoredRelations += 1;
      } else {
        inverseRelations += 1;
      }
    }
  }

  const typeLines = [...types.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([type, count]) => `  ${type}: ${count}`);

  return [
    `Objects: ${objects.length}`,
    `Relations: ${authoredRelations} authored, ${inverseRelations} inverse`,
    `Diagnostics: ${formatCount(counts.errors, "error")}, ${formatCount(counts.warnings, "warning")}`,
    "Types:",
    ...typeLines,
    "",
  ].join("\n");
}

function lintOutput(sources: MarkdownSource[]): CliResult {
  const diagnostics = buildBundleIndex(sources).diagnostics();
  const counts = diagnosticCounts(diagnostics);
  const lines = [...diagnostics]
    .sort((left, right) =>
      `${left.path ?? ""}:${left.code}`.localeCompare(
        `${right.path ?? ""}:${right.code}`,
      ),
    )
    .map(formatDiagnostic);

  return {
    exitCode: counts.errors > 0 ? 1 : 0,
    stdout:
      lines.length === 0
        ? "No diagnostics.\n"
        : [
            ...lines,
            `${formatCount(counts.errors, "error")}, ${formatCount(counts.warnings, "warning")}`,
            "",
          ].join(
            "\n",
          ),
    stderr: "",
  };
}

export async function runCli(args: string[]): Promise<CliResult> {
  const [command, bundlePath, ...extraArgs] = args;
  if (!command || !bundlePath || extraArgs.length > 0) {
    return { exitCode: 2, stdout: "", stderr: usage };
  }

  if (command !== "inspect" && command !== "lint") {
    return {
      exitCode: 2,
      stdout: "",
      stderr: `Unknown command: ${command}\n\n${usage}`,
    };
  }

  const root = resolve(bundlePath);
  let rootStats;
  try {
    rootStats = await stat(root);
  } catch {
    return {
      exitCode: 2,
      stdout: "",
      stderr: `Bundle path does not exist: ${bundlePath}\n`,
    };
  }

  if (!rootStats.isDirectory()) {
    return {
      exitCode: 2,
      stdout: "",
      stderr: `Bundle path must be a directory: ${bundlePath}\n`,
    };
  }

  const sources = await readBundleSources(root);
  if (command === "inspect") {
    return { exitCode: 0, stdout: inspectOutput(sources), stderr: "" };
  }

  return lintOutput(sources);
}
