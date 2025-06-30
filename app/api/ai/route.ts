import { retrieveMemories } from "@/utils/retrieveMemories";
import { SYSTEM_PROMPT } from "@/utils/systemPrompt";
import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import MemoryClient from "mem0ai";
import { NextResponse } from "next/server";

const mem0Client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json(
      { success: false, message: "Unauthorized request" },
      { status: 401 }
    );

  const { messages } = await req.json();

  const query: string = messages[messages.length - 1].content;

  const memories = await mem0Client.search(query, {
    user_id: userId,
    limit: 10,
    threshold: 0.7,
  });

  const mem0Instructions = retrieveMemories(memories);

  const messagesWithMemories = [
    { role: "system", content: mem0Instructions },
    ...messages,
  ];

  const result = streamText({
    model: openai("gpt-4o"),
    system: SYSTEM_PROMPT,
    messages: messagesWithMemories,
    onFinish(response) {
      async function addMemory() {
        const { role, content } = messages[messages.length - 1];

        await mem0Client.add(
          [
            { role, content },
            { role: "assistant", content: response.text },
          ],
          { user_id: userId!, async_mode: true }
        );
      }

      addMemory();
    },
  });

  return result.toDataStreamResponse();
}
