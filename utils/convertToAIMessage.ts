import { IMessage } from "@/models/Messages";

export function convertToAIMessages(messages: Array<IMessage>) {
  return messages.map((message) => ({
    id: String(message._id),
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    experimental_attachments: message.attachment && [message.attachment],
  }));
}
