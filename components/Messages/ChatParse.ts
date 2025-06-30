export function chatParse(
  content: string
): { type: "code" | "text"; lang?: string; value: string }[] {
  if (content?.trim().startsWith("```markdown")) {
    content = content
      .trim()
      .replace(/^```markdown/, "")
      .replace(/```$/, "");
  }

  const rawBlocks = content?.split("```");

  return rawBlocks?.map((block, index) => {
    const isCode = index % 2 === 1;

    if (isCode) {
      const [langLine, ...codeLines] = block.trim().split("\n");
      const lang = langLine.trim();
      const code = codeLines.join("\n");

      return { type: "code", lang, value: code };
    } else {
      return { type: "text", value: block.trim() };
    }
  });
}
