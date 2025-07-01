"use client";

import { useContext, useEffect, useState } from "react";
import { API_ROUTES } from "@/utils/constants";

import { useAxiosFetcher } from "@/hooks/use-fetch";
import { ChatContext } from "./ChatContext";
import { IChat } from "@/models/Chat";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<IChat[]>([]);

  const { fn: getChats } = useAxiosFetcher(false);

  useEffect(() => {
    async function fetchChats() {
      setIsLoading(true);
      const res = await getChats(API_ROUTES.CHAT, {
        method: "GET",
      });

      setIsLoading(false);
      if (!res?.success) return;

      setChats(res.data);
    }

    if (chats.length) return;

    fetchChats();
  }, [getChats, chats.length]);

  return (
    <ChatContext.Provider
      value={{
        isLoading,
        setIsLoading,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
