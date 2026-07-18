export type Artifact = {
  id: string;
  title: string;
  kind: "plan" | "report" | "checklist" | "note";
  content: string;
  createdAt: number;
};

const artifacts: Artifact[] = [];

export function saveArtifact(input: Omit<Artifact, "id" | "createdAt">) {
  const row: Artifact = {
    id: `art_${Date.now().toString(36)}`,
    createdAt: Date.now(),
    ...input,
  };
  artifacts.unshift(row);
  if (artifacts.length > 50) artifacts.length = 50;
  return row;
}

export function listArtifacts(limit = 20) {
  return artifacts.slice(0, limit);
}
