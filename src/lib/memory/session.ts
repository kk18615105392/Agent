export type SessionNote = {
  id: string;
  createdAt: number;
  content: string;
  tags: string[];
};

const notes: SessionNote[] = [];

export function addSessionNote(content: string, tags: string[] = []) {
  const note: SessionNote = {
    id: `mem_${Date.now().toString(36)}`,
    createdAt: Date.now(),
    content,
    tags,
  };
  notes.unshift(note);
  if (notes.length > 100) notes.length = 100;
  return note;
}

export function listSessionNotes(limit = 20) {
  return notes.slice(0, limit);
}

export function searchSessionNotes(query: string, limit = 8) {
  const q = query.toLowerCase();
  return notes
    .filter(
      (n) =>
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    )
    .slice(0, limit);
}
