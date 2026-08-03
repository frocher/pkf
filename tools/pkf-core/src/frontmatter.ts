import { parseDocument } from "yaml";
import type {
  Diagnostic,
  MarkdownSource,
  ParsedDocument,
  PkfObject,
} from "./model.js";

const FRONTMATTER_FENCE = "---";

function stripBom(content: string): string {
  return content.startsWith("\ufeff") ? content.slice(1) : content;
}

function diagnostic(
  code: string,
  message: string,
  path: string,
  field?: string,
): Diagnostic {
  return {
    code,
    severity: "error",
    message,
    path,
    ...(field ? { field } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValidIdGrammar(id: string, type: string): boolean {
  return type === "Project"
    ? /^P-[A-Z0-9-]+$/.test(id)
    : /^[A-Z]+[0-9]+$/.test(id);
}

function splitFrontmatter(content: string):
  | { frontmatter: string; body: string }
  | undefined {
  const normalized = stripBom(content);
  const lines = normalized.split(/\r?\n/);

  if (lines[0] !== FRONTMATTER_FENCE) {
    return undefined;
  }

  const closingFence = lines.indexOf(FRONTMATTER_FENCE, 1);
  if (closingFence === -1) {
    return undefined;
  }

  return {
    frontmatter: lines.slice(1, closingFence).join("\n"),
    body: lines.slice(closingFence + 1).join("\n"),
  };
}

export function parseMarkdownObject(source: MarkdownSource): ParsedDocument {
  const parts = splitFrontmatter(source.content);

  if (!parts) {
    const contentWithoutBom = stripBom(source.content);
    const firstLine = contentWithoutBom.split(/\r?\n/, 1)[0];

    if (firstLine === FRONTMATTER_FENCE) {
      return {
        kind: "invalid",
        path: source.path,
        diagnostics: [
          diagnostic(
            "PKF001",
            "Frontmatter starts with '---' but has no closing fence.",
            source.path,
          ),
        ],
      };
    }

    return {
      kind: "narrative",
      path: source.path,
      diagnostics: [],
    };
  }

  const document = parseDocument(parts.frontmatter);
  if (document.errors.length > 0) {
    return {
      kind: "invalid",
      path: source.path,
      diagnostics: document.errors.map((error) =>
        diagnostic("PKF001", error.message, source.path),
      ),
    };
  }

  const frontmatter = document.toJSON();
  if (!isRecord(frontmatter)) {
    return {
      kind: "invalid",
      path: source.path,
      diagnostics: [
        diagnostic(
          "PKF002",
          "Frontmatter must contain a YAML mapping.",
          source.path,
        ),
      ],
    };
  }

  const id = frontmatter.id;
  const type = frontmatter.type;
  const diagnostics: Diagnostic[] = [];

  if (typeof id !== "string" || id.trim() === "") {
    diagnostics.push(
      diagnostic("PKF003", "Object must have a non-empty string 'id'.", source.path, "id"),
    );
  }

  if (typeof type !== "string" || type.trim() === "") {
    diagnostics.push(
      diagnostic(
        "PKF004",
        "Object must have a non-empty string 'type'.",
        source.path,
        "type",
      ),
    );
  }

  if (diagnostics.length > 0) {
    return {
      kind: "invalid",
      path: source.path,
      diagnostics,
    };
  }

  const objectId = id as string;
  const objectType = type as string;

  if (!hasValidIdGrammar(objectId, objectType)) {
    diagnostics.push({
      code: "PKF006",
      severity: "error",
      message: `ID '${objectId}' does not follow the PKF ID grammar.`,
      path: source.path,
      id: objectId,
      field: "id",
    });
  }

  const object: PkfObject = {
    id: objectId,
    type: objectType,
    path: source.path,
    ...(typeof frontmatter.title === "string"
      ? { title: frontmatter.title }
      : {}),
    ...(typeof frontmatter.description === "string"
      ? { description: frontmatter.description }
      : {}),
    frontmatter,
    body: parts.body,
  };

  return {
    kind: "object",
    object,
    diagnostics,
  };
}
