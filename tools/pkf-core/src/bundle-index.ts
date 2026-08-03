import { parseMarkdownObject } from "./frontmatter.js";
import { isValidPkfId } from "./ids.js";
import {
  getRelationDefinition,
  getRelationDefinitions,
  PKF_RELATION_DEFINITIONS,
} from "./relations.js";
import type {
  BundleIndex,
  BundleIndexOptions,
  Diagnostic,
  MarkdownSource,
  PkfObject,
  RelationDefinition,
  RelationEdge,
  SearchQuery,
} from "./model.js";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function relationExpectsList(definition: RelationDefinition): boolean {
  return definition.cardinality.endsWith("n");
}

function relationValues(
  object: PkfObject,
  definition: RelationDefinition,
): { values: string[]; diagnostic?: Diagnostic } {
  const value = object.frontmatter[definition.field];
  if (value === undefined) {
    return { values: [] };
  }

  const expectsList = relationExpectsList(definition);
  if (expectsList) {
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
      return {
        values: [],
        diagnostic: {
          code: "PKF009",
          severity: "error",
          message: `Relation '${definition.field}' must contain a list of IDs.`,
          path: object.path,
          id: object.id,
          field: definition.field,
        },
      };
    }

    return { values: value };
  }

  if (typeof value !== "string") {
    return {
      values: [],
      diagnostic: {
        code: "PKF009",
        severity: "error",
        message: `Relation '${definition.field}' must contain one ID.`,
        path: object.path,
        id: object.id,
        field: definition.field,
      },
    };
  }

  return { values: [value] };
}

function addEdge(
  edgesById: Map<string, RelationEdge[]>,
  id: string,
  edge: RelationEdge,
): void {
  const edges = edgesById.get(id) ?? [];
  edges.push(edge);
  edgesById.set(id, edges);
}

export function buildBundleIndex(
  sources: Iterable<MarkdownSource>,
  options: BundleIndexOptions = {},
): BundleIndex {
  const objects: PkfObject[] = [];
  const diagnostics: Diagnostic[] = [];
  const relationDefinitions = [
    ...PKF_RELATION_DEFINITIONS,
    ...(options.relationDefinitions ?? []),
  ];

  for (const source of sources) {
    const parsed = parseMarkdownObject(source);
    diagnostics.push(...parsed.diagnostics);
    if (parsed.kind === "object") {
      objects.push(parsed.object);
    }
  }

  const byId = new Map<string, PkfObject[]>();
  const byPath = new Map<string, PkfObject>();

  for (const object of objects) {
    const matches = byId.get(object.id) ?? [];
    matches.push(object);
    byId.set(object.id, matches);
    byPath.set(object.path, object);
  }

  for (const [id, matches] of byId) {
    if (matches.length > 1) {
      for (const object of matches) {
        diagnostics.push({
          code: "PKF005",
          severity: "error",
          message: `ID '${id}' is used by more than one Object.`,
          path: object.path,
          id,
        });
      }
    }
  }

  const outgoingById = new Map<string, RelationEdge[]>();
  const incomingById = new Map<string, RelationEdge[]>();

  for (const source of objects) {
    for (const definition of getRelationDefinitions(
      source.type,
      relationDefinitions,
    )) {
      if (!definition.authored) {
        continue;
      }

      const extracted = relationValues(source, definition);
      if (extracted.diagnostic) {
        diagnostics.push(extracted.diagnostic);
        continue;
      }

      for (const targetId of extracted.values) {
        if (
          !definition.targetTypes.some((targetType) =>
            isValidPkfId(targetId, targetType),
          )
        ) {
          diagnostics.push({
            code: "PKF011",
            severity: "error",
            message: `Relation '${definition.field}' contains invalid ID '${targetId}'.`,
            path: source.path,
            id: source.id,
            field: definition.field,
          });
        }

        const matches = byId.get(targetId);
        if (!matches || matches.length === 0) {
          diagnostics.push({
            code: "PKF007",
            severity: "warning",
            message: `Relation '${definition.field}' points to missing ID '${targetId}'.`,
            path: source.path,
            id: source.id,
            field: definition.field,
          });
          continue;
        }

        if (matches.length > 1) {
          diagnostics.push({
            code: "PKF010",
            severity: "error",
            message: `Relation '${definition.field}' points to ambiguous ID '${targetId}'.`,
            path: source.path,
            id: source.id,
            field: definition.field,
          });
          continue;
        }

        const target = matches[0];
        if (!definition.targetTypes.includes(target.type)) {
          diagnostics.push({
            code: "PKF008",
            severity: "warning",
            message: `Relation '${definition.field}' points to type '${target.type}', expected ${definition.targetTypes.join(" or ")}.`,
            path: source.path,
            id: source.id,
            field: definition.field,
          });
        }

        const edge: RelationEdge = {
          source,
          target,
          targetId,
          field: definition.field,
          direction: "authored",
          definition,
        };
        addEdge(outgoingById, source.id, edge);
        addEdge(incomingById, target.id, edge);

        if (definition.inverse && target.type === definition.inverse.sourceType) {
          const inverse = getRelationDefinition(
            target.type,
            definition.inverse.field,
            relationDefinitions,
          );
          if (inverse && !inverse.authored) {
            addEdge(outgoingById, target.id, {
              source: target,
              target: source,
              targetId: source.id,
              field: inverse.field,
              direction: "inverse",
              definition: inverse,
            });
          }
        }
      }
    }
  }

  return {
    size: objects.length,

    getById(id: string): PkfObject | undefined {
      const matches = byId.get(id);
      return matches?.length === 1 ? matches[0] : undefined;
    },

    getByPath(path: string): PkfObject | undefined {
      return byPath.get(path);
    },

    search(query: SearchQuery = {}): PkfObject[] {
      const text = query.text ? normalize(query.text) : undefined;
      const type = query.type ? normalize(query.type) : undefined;

      return objects.filter((object) => {
        if (type && normalize(object.type) !== type) {
          return false;
        }

        if (!text) {
          return true;
        }

        return [
          object.id,
          object.type,
          object.title,
          object.description,
          object.body,
        ]
          .filter((value): value is string => typeof value === "string")
          .some((value) => normalize(value).includes(text));
      });
    },

    relationsOf(id: string): RelationEdge[] {
      if ((byId.get(id)?.length ?? 0) !== 1) {
        return [];
      }
      return [...(outgoingById.get(id) ?? [])];
    },

    referencedBy(id: string): RelationEdge[] {
      if ((byId.get(id)?.length ?? 0) !== 1) {
        return [];
      }
      return [...(incomingById.get(id) ?? [])];
    },

    diagnostics(): Diagnostic[] {
      return [...diagnostics];
    },
  };
}
