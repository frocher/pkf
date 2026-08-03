export interface MarkdownSource {
  path: string;
  content: string;
}

export interface PkfObject {
  id: string;
  type: string;
  path: string;
  title?: string;
  description?: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export type DiagnosticSeverity = "error" | "warning" | "info";

export interface Diagnostic {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  path?: string;
  id?: string;
  field?: string;
}

export type ParsedDocument =
  | {
      kind: "object";
      object: PkfObject;
      diagnostics: Diagnostic[];
    }
  | {
      kind: "narrative";
      path: string;
      diagnostics: Diagnostic[];
    }
  | {
      kind: "invalid";
      path: string;
      diagnostics: Diagnostic[];
    };

export interface SearchQuery {
  text?: string;
  type?: string;
}

export interface BundleIndex {
  readonly size: number;
  getById(id: string): PkfObject | undefined;
  getByPath(path: string): PkfObject | undefined;
  search(query?: SearchQuery): PkfObject[];
  diagnostics(): Diagnostic[];
}
