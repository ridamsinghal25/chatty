import { IMessage } from "@/models/Messages";

export function convertToAIMessages(messages: Array<IMessage>) {
  return messages.map((message) => ({
    id: String(message._id),
    role: message.role,
    // Note: content will soon be deprecated in @ai-sdk/react
    content: message.content,
    createdAt: message.createdAt,
    experimental_attachments: message.attachments,
  }));
}
