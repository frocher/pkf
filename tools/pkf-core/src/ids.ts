export function isValidPkfId(id: string, type: string): boolean {
  return type === "Project"
    ? /^P-[A-Z0-9-]+$/.test(id)
    : /^[A-Z]+[0-9]+$/.test(id);
}
