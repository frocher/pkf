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

export type RelationCardinality = "1" | "0..1" | "0..n" | "1..n";

export interface RelationDefinition {
  sourceType: string;
  field: string;
  targetTypes: readonly string[];
  cardinality: RelationCardinality;
  authored: boolean;
  inverse?: {
    sourceType: string;
    field: string;
  };
}

export interface RelationEdge {
  source: PkfObject;
  target: PkfObject;
  targetId: string;
  field: string;
  direction: "authored" | "inverse";
  definition: RelationDefinition;
}

export interface BundleIndexOptions {
  relationDefinitions?: readonly RelationDefinition[];
}

export interface BundleIndex {
  readonly size: number;
  getById(id: string): PkfObject | undefined;
  getByPath(path: string): PkfObject | undefined;
  search(query?: SearchQuery): PkfObject[];
  relationsOf(id: string): RelationEdge[];
  referencedBy(id: string): RelationEdge[];
  diagnostics(): Diagnostic[];
}
