"use client";

import { IChat } from "@/models/Chat";
import { createContext } from "react";

// types/chat.ts
export interface ChatContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chats: IChat[];
  setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
}

export const ChatContext = createContext<ChatContextType | null>(null);
