import { describe, expect, it } from "vitest";
import { parseMarkdownObject } from "../src/index.js";

describe("parseMarkdownObject", () => {
  it("parses a PKF object and preserves its body and fields", () => {
    const result = parseMarkdownObject({
      path: "risks/r001-scope-creep.md",
      content: `---\nid: R001\ntype: Risk\ntitle: Scope creep\nlabels: [schedule, governance]\n---\n\n# Description\n\nThe scope may expand.\n`,
    });

    expect(result).toEqual({
      kind: "object",
      object: {
        id: "R001",
        type: "Risk",
        path: "risks/r001-scope-creep.md",
        title: "Scope creep",
        frontmatter: {
          id: "R001",
          type: "Risk",
          title: "Scope creep",
          labels: ["schedule", "governance"],
        },
        body: "\n# Description\n\nThe scope may expand.\n",
      },
      diagnostics: [],
    });
  });

  it("treats Markdown without frontmatter as narrative content", () => {
    const result = parseMarkdownObject({
      path: "README.md",
      content: "# Northwind\n\nProject notes.\n",
    });

    expect(result).toEqual({
      kind: "narrative",
      path: "README.md",
      diagnostics: [],
    });
  });

  it("reports malformed or incomplete frontmatter without throwing", () => {
    const malformed = parseMarkdownObject({
      path: "broken.md",
      content: "---\nid: R001\ntitle: [broken\n---\n",
    });
    const missingId = parseMarkdownObject({
      path: "missing-id.md",
      content: "---\ntype: Risk\n---\n",
    });

    expect(malformed.kind).toBe("invalid");
    expect(malformed.diagnostics[0]?.code).toBe("PKF001");
    expect(missingId.kind).toBe("invalid");
    expect(missingId.diagnostics[0]?.code).toBe("PKF003");
  });

  it("reports invalid IDs while preserving the object for navigation", () => {
    const result = parseMarkdownObject({
      path: "risks/r001.md",
      content: "---\nid: r001\ntype: Risk\n---\n",
    });

    expect(result.kind).toBe("object");
    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: "PKF006", id: "r001" }),
    ]);
  });

  it("reports an unterminated BOM-prefixed frontmatter block", () => {
    const result = parseMarkdownObject({
      path: "broken.md",
      content: "\ufeff---\nid: R001\ntype: Risk\n",
    });

    expect(result.kind).toBe("invalid");
    expect(result.diagnostics[0]?.code).toBe("PKF001");
  });

  it("treats a non-fence horizontal rule as narrative content", () => {
    const result = parseMarkdownObject({
      path: "notes.md",
      content: "---not-a-frontmatter-fence\n\nMeeting notes.\n",
    });

    expect(result.kind).toBe("narrative");
  });
});
