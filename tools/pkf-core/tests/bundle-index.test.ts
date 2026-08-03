import { describe, expect, it } from "vitest";
import { buildBundleIndex } from "../src/index.js";

const object = (path: string, content: string) => ({ path, content });

describe("buildBundleIndex", () => {
  it("indexes objects by ID and path and searches display fields", () => {
    const index = buildBundleIndex([
      object(
        "risks/r001.md",
        "---\nid: R001\ntype: Risk\ntitle: Scope creep\n---\n",
      ),
      object(
        "actions/a001.md",
        "---\nid: A001\ntype: Action\ntitle: Confirm scope\n---\n\nConfirm the scope with the sponsor.\n",
      ),
      object("README.md", "# Notes\n"),
    ]);

    expect(index.size).toBe(2);
    expect(index.getById("R001")?.path).toBe("risks/r001.md");
    expect(index.getByPath("actions/a001.md")?.id).toBe("A001");
    expect(index.search({ text: "scope" }).map((item) => item.id)).toEqual([
      "R001",
      "A001",
    ]);
    expect(index.search({ text: "sponsor" }).map((item) => item.id)).toEqual([
      "A001",
    ]);
    expect(index.search({ type: "risk" }).map((item) => item.id)).toEqual([
      "R001",
    ]);
    expect(index.diagnostics()).toEqual([]);
  });

  it("does not resolve an ambiguous ID", () => {
    const index = buildBundleIndex([
      object("risks/r001.md", "---\nid: R001\ntype: Risk\n---\n"),
      object("archive/r001.md", "---\nid: R001\ntype: Risk\n---\n"),
    ]);

    expect(index.getById("R001")).toBeUndefined();
    expect(index.diagnostics()).toEqual([
      expect.objectContaining({
        code: "PKF005",
        severity: "error",
        id: "R001",
        path: "risks/r001.md",
      }),
      expect.objectContaining({
        code: "PKF005",
        severity: "error",
        id: "R001",
        path: "archive/r001.md",
      }),
    ]);
  });
});
