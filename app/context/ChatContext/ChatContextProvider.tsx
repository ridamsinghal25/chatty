"use client";

import { useContext, useEffect, useState } from "react";
import { API_ROUTES } from "@/utils/constants";

import { useAxiosFetcher } from "@/hooks/use-fetch";
import { ChatContext } from "./ChatContext";
import { useAuth } from "@clerk/nextjs";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<any>([]);

  const { fn: getChats } = useAxiosFetcher(false);

  useEffect(() => {
    async function fetchChats() {
      setIsLoading(true);
      const res = await getChats(API_ROUTES.CHAT, {
        method: "GET",
      });

      if (!res?.success) return;

      setIsLoading(false);
      setChats(res.data);
    }

    if (chats.length) return;

    fetchChats();
  }, []);

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
