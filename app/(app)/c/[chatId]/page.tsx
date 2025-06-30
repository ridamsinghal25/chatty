"use client";

import { TextareaComponent } from "@/components/Textarea";
import { useEffect } from "react";
import ChatMessage from "@/components/Messages/ChatMessage";
import { useParams, useRouter } from "next/navigation";
import { useAxiosFetcher } from "@/hooks/use-fetch";
import { API_ROUTES, CONTEXT_WINDOW_SIZE, ROUTES } from "@/utils/constants";
import { convertToAIMessages } from "@/utils/convertToAIMessage";
import AIChatMessage from "@/components/Messages/AIChatMessage";
import { IMessage } from "@/models/Messages";
import toast from "react-hot-toast";
import { useMessageContext } from "@/app/context/MessageContext/MessageContextProvider";

export default function ChatPage() {
  const router = useRouter();
  const { chatId } = useParams();

  const messageContext = useMessageContext();

  if (!messageContext) return;

  const {
    isLoading,
    setIsLoading,
    setAIMessages,
    setAllMessages,
    setMessages,
    input,
    stop,
    handleInputChange,
    handleSubmit,
  } = messageContext;

  const { fn: getChatMessages } = useAxiosFetcher();

  const { fn: createChatMessage } = useAxiosFetcher();

  useEffect(() => {
    if (!chatId) return;

    async function fetchMessages() {
      const response = await getChatMessages(
        `${API_ROUTES.MESSAGE}/${chatId}`,
        {
          method: "GET",
        }
      );

      if (!response?.success || !response?.data.length) {
        router.push(ROUTES.NEW_CHAT);
        return;
      }

      const uiMessages: any = convertToAIMessages(response.data);

      if (uiMessages.length === 1) {
        setIsLoading(true);
        handleSubmit();
        setAllMessages(response.data);
        return;
      }

      if (uiMessages.length > CONTEXT_WINDOW_SIZE) {
        setAIMessages(uiMessages.slice(-CONTEXT_WINDOW_SIZE));
      } else {
        setAIMessages(uiMessages);
      }

      setAllMessages(response.data);
    }

    fetchMessages();

    return () => {
      setAIMessages([]);
      setAllMessages([]);
      setMessages([]);
    };
  }, [chatId]);

  const handleChatSubmit = async (
    event: any,
    attachment?: {
      name: string;
      url: string;
      id: string;
      contentType?: string;
    }
  ) => {
    if (!input) return toast("Please enter a message");

    setIsLoading(true);

    // Submit the message
    if (attachment) {
      handleSubmit(event, {
        experimental_attachments: [attachment],
      });
    } else {
      handleSubmit();
    }

    const formData = new FormData();
    formData.append("role", "user");
    formData.append("content", input);

    if (attachment) {
      formData.append(
        "attachment",
        JSON.stringify({
          name: attachment.name,
          url: attachment.url,

          contentType: attachment.contentType,
        })
      );
    }

    const res = await createChatMessage(`${API_ROUTES.MESSAGE}/${chatId}`, {
      method: "POST",
      data: formData,
    });

    if (!res.success) return;

    setAllMessages((prev: IMessage[]) => [...prev, res.data]);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    attachement?: {
      name: string;
      url: string;
      id: string;
      contentType?: string;
    }
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter key behavior (like adding a new line)

      handleChatSubmit(e, attachement);
    }
  };

  const handleStop = () => {
    stop();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white flex flex-col">
      {/* Chat Messages Container */}

      <ChatMessage />

      <AIChatMessage />

      {/* Fixed input area at bottom */}
      <div className="sticky bottom-0 z-40 text-white flex flex-col items-center justify-end px-4">
        <div className="max-w-3xl w-full rounded-t-3xl bg-gradient-to-t from-[#212121] to-transparent">
          <div className="flex flex-col items-center">
            <TextareaComponent
              textareaValue={input}
              setTextareaValue={handleInputChange}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
              stop={handleStop}
              handleSubmit={handleChatSubmit}
            />
          </div>

          {/* Footer text */}
          <p className="text-center text-xs mt-1 mb-3">
            Chatty can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}
