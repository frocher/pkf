import type { RelationCardinality, RelationDefinition } from "./model.js";

type RelationTarget = string | readonly string[];

function definition(
  sourceType: string,
  field: string,
  targetTypes: RelationTarget,
  cardinality: RelationCardinality,
  inverse?: RelationDefinition["inverse"],
): RelationDefinition {
  return {
    sourceType,
    field,
    targetTypes: Array.isArray(targetTypes) ? targetTypes : [targetTypes],
    cardinality,
    authored: true,
    ...(inverse ? { inverse } : {}),
  };
}

function inverseDefinition(
  sourceType: string,
  field: string,
  targetTypes: RelationTarget,
  cardinality: RelationCardinality,
  authored: { sourceType: string; field: string },
): RelationDefinition {
  return {
    sourceType,
    field,
    targetTypes: Array.isArray(targetTypes) ? targetTypes : [targetTypes],
    cardinality,
    authored: false,
    inverse: authored,
  };
}

export const PKF_RELATION_DEFINITIONS: readonly RelationDefinition[] = [
  definition("Project", "client", "Client", "1", {
    sourceType: "Client",
    field: "projects",
  }),
  inverseDefinition("Client", "projects", "Project", "0..n", {
    sourceType: "Project",
    field: "client",
  }),

  definition("Milestone", "project", "Project", "1", {
    sourceType: "Project",
    field: "milestones",
  }),
  inverseDefinition("Project", "milestones", "Milestone", "0..n", {
    sourceType: "Milestone",
    field: "project",
  }),

  definition("Delivery", "project", "Project", "1", {
    sourceType: "Project",
    field: "deliveries",
  }),
  inverseDefinition("Project", "deliveries", "Delivery", "0..n", {
    sourceType: "Delivery",
    field: "project",
  }),

  definition("Delivery", "milestone", "Milestone", "0..1", {
    sourceType: "Milestone",
    field: "deliveries",
  }),
  inverseDefinition("Milestone", "deliveries", "Delivery", "0..n", {
    sourceType: "Delivery",
    field: "milestone",
  }),

  definition("Dependency", "milestones", "Milestone", "0..n", {
    sourceType: "Milestone",
    field: "dependencies",
  }),
  inverseDefinition("Milestone", "dependencies", "Dependency", "0..n", {
    sourceType: "Dependency",
    field: "milestones",
  }),

  definition("Risk", "vendors", "Vendor", "0..n", {
    sourceType: "Vendor",
    field: "risks",
  }),
  inverseDefinition("Vendor", "risks", "Risk", "0..n", {
    sourceType: "Risk",
    field: "vendors",
  }),

  definition("Risk", "milestones", "Milestone", "0..n", {
    sourceType: "Milestone",
    field: "risks",
  }),
  inverseDefinition("Milestone", "risks", "Risk", "0..n", {
    sourceType: "Risk",
    field: "milestones",
  }),

  definition("Application", "requirements", "Requirement", "0..n", {
    sourceType: "Requirement",
    field: "applications",
  }),
  inverseDefinition("Requirement", "applications", "Application", "0..n", {
    sourceType: "Application",
    field: "requirements",
  }),

  definition("Team", "members", "Stakeholder", "0..n", {
    sourceType: "Stakeholder",
    field: "team",
  }),
  inverseDefinition("Stakeholder", "team", "Team", "0..1", {
    sourceType: "Team",
    field: "members",
  }),

  definition("Decision", "superseded_by", "Decision", "0..1", {
    sourceType: "Decision",
    field: "supersedes",
  }),
  inverseDefinition("Decision", "supersedes", "Decision", "0..n", {
    sourceType: "Decision",
    field: "superseded_by",
  }),

  definition("Decision", "milestones", "Milestone", "0..n", {
    sourceType: "Milestone",
    field: "decisions",
  }),
  inverseDefinition("Milestone", "decisions", "Decision", "0..n", {
    sourceType: "Decision",
    field: "milestones",
  }),

  definition("Action", "project", "Project", "1"),
  definition("Action", "owner", "Stakeholder", "1"),
  definition("Application", "project", "Project", "1"),
  definition("Application", "owner", "Stakeholder", "1"),
  definition("Application", "dependencies", "Dependency", "0..n"),
  definition("Assignment", "project", "Project", "1"),
  definition("Assignment", "stakeholder", "Stakeholder", "1"),
  definition("Competency", "stakeholder", "Stakeholder", "1"),
  definition("Competency", "skill", "Skill", "1"),
  definition("Decision", "project", "Project", "1"),
  definition("Decision", "decision_maker", "Stakeholder", "1"),
  definition("Decision", "actions", "Action", "0..n"),
  definition("Delivery", "owner", "Stakeholder", "1"),
  definition("Dependency", "project", "Project", "1"),
  definition("Dependency", "owner", "Stakeholder", "1"),
  definition("Dependency", "risks", "Risk", "0..n"),
  definition("Dependency", "related_project", "Project", "0..1"),
  definition("Milestone", "owner", "Stakeholder", "1"),
  definition("Requirement", "project", "Project", "1"),
  definition("Requirement", "owner", "Stakeholder", "1"),
  definition("Requirement", "deliveries", "Delivery", "0..n"),
  definition("Risk", "project", "Project", "1"),
  definition("Risk", "owner", "Stakeholder", "1"),
  definition("SkillRequirement", "project", "Project", "1"),
  definition("SkillRequirement", "skill", "Skill", "1"),
  definition("Stakeholder", "organization", ["Client", "Vendor"], "0..1"),
  definition("Team", "projects", "Project", "0..n"),
  definition("Vendor", "projects", "Project", "0..n"),
];

const definitionsByTypeAndField = new Map<string, RelationDefinition>();
for (const relation of PKF_RELATION_DEFINITIONS) {
  definitionsByTypeAndField.set(
    `${relation.sourceType}.${relation.field}`,
    relation,
  );
}

export function getRelationDefinitions(
  type: string,
  definitions: readonly RelationDefinition[] = PKF_RELATION_DEFINITIONS,
): RelationDefinition[] {
  return definitions.filter((relation) => relation.sourceType === type);
}

export function getRelationDefinition(
  sourceType: string,
  field: string,
  definitions: readonly RelationDefinition[] = PKF_RELATION_DEFINITIONS,
): RelationDefinition | undefined {
  if (definitions === PKF_RELATION_DEFINITIONS) {
    return definitionsByTypeAndField.get(`${sourceType}.${field}`);
  }

  return definitions.find(
    (relation) =>
      relation.sourceType === sourceType && relation.field === field,
  );
}
