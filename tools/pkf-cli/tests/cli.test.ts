import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runCli } from "../src/cli.js";

async function createBundle(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "pkf-cli-"));

  await writeFile(
    join(root, "project.md"),
    "---\nid: P-TEST\ntype: Project\nclient: C001\n---\n",
  );
  await writeFile(
    join(root, "client.md"),
    "---\nid: C001\ntype: Client\n---\n",
  );
  await writeFile(
    join(root, "risk.md"),
    "---\nid: R001\ntype: Risk\nproject: P-TEST\nowner: S404\n---\n",
  );

  return root;
}

describe("pkf", () => {
  it("inspects a Bundle and summarizes its objects, relations, and diagnostics", async () => {
    const root = await createBundle();

    const result = await runCli(["inspect", root]);

    expect(result).toEqual({
      exitCode: 0,
      stderr: "",
      stdout: [
        "Objects: 3",
        "Relations: 2 authored, 1 inverse",
        "Diagnostics: 0 errors, 1 warning",
        "Types:",
        "  Client: 1",
        "  Project: 1",
        "  Risk: 1",
        "",
      ].join("\n"),
    });
  });

  it("lints a Bundle, prints diagnostics, and fails only for errors", async () => {
    const root = await createBundle();

    const warningOnly = await runCli(["lint", root]);
    const filePath = await runCli(["lint", join(root, "risk.md")]);
    const invalidRoot = await mkdtemp(join(tmpdir(), "pkf-cli-invalid-"));
    await writeFile(
      join(invalidRoot, "invalid.md"),
      "---\nid: r001\ntype: Risk\n---\n",
    );
    const invalidBundle = await runCli(["lint", invalidRoot]);

    expect(warningOnly.exitCode).toBe(0);
    expect(warningOnly.stdout).toContain(
      "WARNING PKF007 risk.md [R001] owner: Relation 'owner' points to missing ID 'S404'.",
    );
    expect(warningOnly.stdout).toContain("0 errors, 1 warning");
    expect(filePath).toEqual({
      exitCode: 2,
      stdout: "",
      stderr: expect.stringContaining("Bundle path must be a directory"),
    });
    expect(invalidBundle.exitCode).toBe(1);
    expect(invalidBundle.stdout).toContain("ERROR PKF006 invalid.md [r001] id:");
  });

  it("treats a non-PKF Markdown file as narrative, not as an error", async () => {
    const root = await mkdtemp(join(tmpdir(), "pkf-cli-design-"));

    await writeFile(
      join(root, "client.md"),
      "---\nid: C001\ntype: Client\n---\n",
    );
    await writeFile(
      join(root, "DESIGN.md"),
      '---\nname: Steering Report\ncolors:\n  primary: "#1B3A5C"\n---\n',
    );

    const lint = await runCli(["lint", root]);
    const inspect = await runCli(["inspect", root]);

    expect(lint.exitCode).toBe(0);
    expect(lint.stdout).toContain("INFO PKF012 DESIGN.md");
    expect(lint.stdout).toContain("0 errors, 0 warnings");
    expect(inspect.exitCode).toBe(0);
    expect(inspect.stdout).toContain("Objects: 1");
  });

  it("prints usage for a missing or unknown command", async () => {
    await expect(runCli([])).resolves.toEqual({
      exitCode: 2,
      stdout: "",
      stderr: expect.stringContaining("Usage: pkf <inspect|lint> <bundle-path>"),
    });
    await expect(runCli(["report", "bundle"])).resolves.toEqual({
      exitCode: 2,
      stdout: "",
      stderr: expect.stringContaining("Unknown command: report"),
    });
  });
});
