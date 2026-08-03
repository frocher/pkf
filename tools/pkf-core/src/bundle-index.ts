import { parseMarkdownObject } from "./frontmatter.js";
import type {
  BundleIndex,
  Diagnostic,
  MarkdownSource,
  PkfObject,
  SearchQuery,
} from "./model.js";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function buildBundleIndex(sources: Iterable<MarkdownSource>): BundleIndex {
  const objects: PkfObject[] = [];
  const diagnostics: Diagnostic[] = [];

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

    diagnostics(): Diagnostic[] {
      return [...diagnostics];
    },
  };
}
