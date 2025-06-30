export const retrieveMemories = (memories: any) => {
  if (memories.length === 0) return "";
  const systemPrompt =
    "These are the memories I have stored. Give more weightage to the question by users and try to answer that first. You have to modify your answer based on the memories I have provided. If the memories are irrelevant you can ignore them. Also don't reply to this section of the prompt, or the memories, they are only for your reference. The System prompt starts after text System Message: \n\n";

  const memoriesText = memories
    .map((memory: any) => {
      return `Memory: ${memory.memory}\n\n`;
    })
    .join("\n\n");

  return `System Message: ${systemPrompt} ${memoriesText}`;
};
