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

  it("resolves authored relations and computes inverse edges", () => {
    const index = buildBundleIndex([
      object("client.md", "---\nid: C001\ntype: Client\n---\n"),
      object(
        "project/project.md",
        "---\nid: P001\ntype: Project\nclient: C001\n---\n",
      ),
      object(
        "milestones/m001.md",
        "---\nid: M001\ntype: Milestone\nproject: P001\n---\n",
      ),
    ]);

    const milestoneRelations = index.relationsOf("M001");
    expect(milestoneRelations).toHaveLength(1);
    expect(milestoneRelations[0]).toMatchObject({
      field: "project",
      source: { id: "M001" },
      target: { id: "P001", type: "Project" },
      definition: {
        sourceType: "Milestone",
        targetTypes: ["Project"],
        inverse: { sourceType: "Project", field: "milestones" },
      },
    });

    expect(index.referencedBy("P001")).toEqual([
      expect.objectContaining({
        field: "project",
        source: expect.objectContaining({ id: "M001" }),
        target: expect.objectContaining({ id: "P001" }),
      }),
    ]);
    expect(index.relationsOf("P001")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          direction: "inverse",
          field: "milestones",
          source: expect.objectContaining({ id: "P001" }),
          target: expect.objectContaining({ id: "M001" }),
          definition: expect.objectContaining({ authored: false }),
        }),
      ]),
    );
    expect(index.referencedBy("C001")).toEqual([
      expect.objectContaining({
        field: "client",
        source: expect.objectContaining({ id: "P001" }),
        target: expect.objectContaining({ id: "C001" }),
      }),
    ]);
  });

  it("resolves list relations, reports missing targets, and keeps type mismatches navigable", () => {
    const index = buildBundleIndex([
      object(
        "risks/r001.md",
        "---\nid: R001\ntype: Risk\nvendors: [V001, M001, V404]\n---\n",
      ),
      object("vendors/v001.md", "---\nid: V001\ntype: Vendor\n---\n"),
      object(
        "milestones/m001.md",
        "---\nid: M001\ntype: Milestone\n---\n",
      ),
    ]);

    const relations = index.relationsOf("R001");
    expect(relations.map((relation) => relation.target.id)).toEqual([
      "V001",
      "M001",
    ]);
    expect(relations[0]?.definition.targetTypes).toEqual(["Vendor"]);
    expect(index.diagnostics()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "PKF007",
          severity: "warning",
          id: "R001",
          field: "vendors",
        }),
        expect.objectContaining({
          code: "PKF008",
          severity: "warning",
          id: "R001",
          field: "vendors",
        }),
      ]),
    );
  });

  it("ignores stored inverse fields and reports malformed relation values", () => {
    const index = buildBundleIndex([
      object(
        "project/project.md",
        "---\nid: P001\ntype: Project\nmilestones: [M001]\n---\n",
      ),
      object(
        "milestones/m001.md",
        "---\nid: M001\ntype: Milestone\nproject: P001\n---\n",
      ),
      object(
        "risks/r001.md",
        "---\nid: R001\ntype: Risk\nvendors: {id: V001}\n---\n",
      ),
    ]);

    expect(index.relationsOf("P001")).toEqual([
      expect.objectContaining({
        direction: "inverse",
        field: "milestones",
        target: expect.objectContaining({ id: "M001" }),
      }),
    ]);
    expect(index.referencedBy("P001")).toEqual([
      expect.objectContaining({ source: expect.objectContaining({ id: "M001" }) }),
    ]);
    expect(index.diagnostics()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "PKF009",
          severity: "error",
          id: "R001",
          field: "vendors",
        }),
      ]),
    );
  });

  it("reports invalid relation ID grammar", () => {
    const index = buildBundleIndex([
      object(
        "milestones/m001.md",
        "---\nid: M001\ntype: Milestone\nproject: p001\n---\n",
      ),
    ]);

    expect(index.diagnostics()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "PKF011",
          severity: "error",
          id: "M001",
          field: "project",
        }),
      ]),
    );
  });

  it("resolves extension relations supplied through the index options", () => {
    const index = buildBundleIndex(
      [
        object(
          "audits/a001.md",
          "---\nid: AUD001\ntype: Audit\nsubject: R001\n---\n",
        ),
        object("risks/r001.md", "---\nid: R001\ntype: Risk\n---\n"),
      ],
      {
        relationDefinitions: [
          {
            sourceType: "Audit",
            field: "subject",
            targetTypes: ["Risk"],
            cardinality: "1",
            authored: true,
          },
        ],
      },
    );

    expect(index.relationsOf("AUD001")).toEqual([
      expect.objectContaining({
        field: "subject",
        target: expect.objectContaining({ id: "R001", type: "Risk" }),
      }),
    ]);
  });
});
