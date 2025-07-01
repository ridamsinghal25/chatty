"use client";

import { IMessage } from "@/models/Messages";
import { ChatRequestOptions, CreateMessage, Message, UIMessage } from "ai";
import { createContext } from "react";

// types/chat.ts
export interface MessageContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  aiMessages: any[];
  setAIMessages: React.Dispatch<any>;
  allMessages: IMessage[];
  setAllMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  input: string;
  stop: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: ChatRequestOptions
  ) => void;
  messages: UIMessage[];
  setMessages: React.Dispatch<any>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  status: "submitted" | "streaming" | "ready" | "error";
}

export const MessageContext = createContext<MessageContextType | null>(null);
