"use client";

import { ChatRequestOptions } from "ai";
import { createContext } from "react";

// types/chat.ts
export interface MessageContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  aiMessages: any[];
  setAIMessages: React.Dispatch<any>;
  allMessages: any[];
  setAllMessages: React.Dispatch<any>;
  input: string;
  stop: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: ChatRequestOptions
  ) => void;
  messages: any[];
  setMessages: React.Dispatch<any>;
  append: (
    message: any,
    chatRequestOptions?: any
  ) => Promise<string | null | undefined>;
  status: "submitted" | "streaming" | "ready" | "error";
}

export const MessageContext = createContext<MessageContextType | null>(null);
