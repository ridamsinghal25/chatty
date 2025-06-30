"use client";

import { useContext, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import { API_ROUTES, CONTEXT_WINDOW_SIZE } from "@/utils/constants";

import { useAxiosFetcher } from "@/hooks/use-fetch";
import { MessageContext } from "./MessageContext";

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { chatId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [aiMessages, setAIMessages] = useState<any>([]);
  const [allMessages, setAllMessages] = useState<any>([]);
  const [gptModel, setGPTModel] = useState("gpt-4o");

  const { fn: createChatMessage } = useAxiosFetcher();

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
    onFinish: (message) => {
      setIsLoading(false);

      if (messages.length > CONTEXT_WINDOW_SIZE) {
        setMessages(messages.slice(-CONTEXT_WINDOW_SIZE));
      }

      async function createMessage() {
        const formData = new FormData();
        formData.append("role", "assistant");
        formData.append("content", message.content);

        const res = await createChatMessage(`${API_ROUTES.MESSAGE}/${chatId}`, {
          method: "POST",
          data: formData,
        });

        if (!res.success) return;

        setAllMessages((prev: any[]) => [...prev, res.data]);
      }

      createMessage();
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
