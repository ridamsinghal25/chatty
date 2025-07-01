"use client";

import { useContext, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { CONTEXT_WINDOW_SIZE } from "@/utils/constants";
import { MessageContext } from "./MessageContext";
import { IMessage } from "@/models/Messages";

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessages, setAIMessages] = useState<any>([]);
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);

  const {
    input,
    stop,
    handleInputChange,
    handleSubmit,
    messages,
    setMessages,
    append,
    status,
  } = useChat({
    api: "/api/ai",
    onError: () => setIsLoading(false),
    initialMessages: aiMessages,
    onFinish: () => {
      setIsLoading(false);

      if (messages.length > CONTEXT_WINDOW_SIZE) {
        setMessages(messages.slice(-CONTEXT_WINDOW_SIZE));
      }
    },
  });

  return (
    <MessageContext.Provider
      value={{
        isLoading,
        setIsLoading,
        aiMessages,
        setAIMessages,
        allMessages,
        setAllMessages,
        input,
        stop,
        handleInputChange,
        handleSubmit,
        messages,
        setMessages,
        append,
        status,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
