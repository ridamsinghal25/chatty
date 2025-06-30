export function normalizeTitle(title: string): string {
  try {
    // Try parsing it; if it’s a valid JSON string, this will work
    const parsed = JSON.parse(title);
    return typeof parsed === "string" ? parsed : title;
  } catch {
    // Not a JSON string — just return as is
    return title;
  }
}
