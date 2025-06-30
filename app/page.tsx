"use client";

import type React from "react";
import { TextareaComponent } from "@/components/Textarea";
import { useSidebar } from "@/components/ui/sidebar";
import { useAxiosFetcher } from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { API_ROUTES, ROUTES } from "@/utils/constants";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useMessageContext } from "./context/MessageContext/MessageContextProvider";
import { useChatContext } from "./context/ChatContext/ChatContextProvider";

export default function Page() {
  const { open, isMobile } = useSidebar();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const chatContext = useChatContext();

  const messageContext = useMessageContext();

  if (!chatContext) return;

  if (!messageContext) return;

  const { setChats } = chatContext;

  const {
    isLoading,
    setIsLoading,
    allMessages,
    input,
    stop,
    handleInputChange,
    messages,
  } = messageContext;

  const { fn: createChatFn } = useAxiosFetcher();

  const { fn: createMessageFn } = useAxiosFetcher();

  const handleSendMessage = async (attachment?: {
    name: string;
    url: string;
    id: string;
    contentType?: string;
  }) => {
    if (!isSignedIn) return toast("Please sign in");

    if (!input) return toast("Please enter a message");

    setIsLoading(true);

    const newChat = await createChatFn(API_ROUTES.CHAT, {
      method: "POST",
      data: {
        userQuery: input,
      },
    });

    setChats((chats) => [newChat.data, ...chats]);

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

    await createMessageFn(`${API_ROUTES.MESSAGE}/${newChat.data._id}`, {
      method: "POST",
      data: formData,
    });

    router.push(ROUTES.CHAT.replace(":id", newChat.data._id));
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    attachment?: {
      name: string;
      url: string;
      id: string;
      contentType?: string;
    }
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter key behavior (like adding a new line)

      handleSendMessage(attachment);
    }
  };

  const handleStop = () => {
    stop();
    setIsLoading(false);
  };

  if (messages.length === 0 || allMessages.length === 0) {
    // Initial centered state
    return (
      <div className="h-[90vh] bg-[#212121] text-white flex flex-col items-center justify-center px-4">
        <div className="w-full mb-32 max-w-3xl flex flex-col items-center">
          <h1 className="text-3xl font-normal text-center mb-12 text-gray-200">
            What's on your mind today?
          </h1>

          <div className="fixed bottom-0 left-0 pb-4 flex justify-center w-full z-50 bg-[#212121] sm:static  sm:p-0 sm:z-auto">
            <div className="mx-4 my-2 sm:m-0 w-full flex justify-center">
              <TextareaComponent
                textareaValue={input}
                setTextareaValue={handleInputChange}
                handleKeyPress={handleKeyPress}
                isLoading={isLoading}
                handleSubmit={handleSendMessage}
                stop={handleStop}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#212121] text-white  h-[90vh] flex flex-col">
      {/* Chat messages area - scrollable */}

      <div className="flex-1 overflow-y-auto">
        <div
          className={`max-w-3xl mx-auto px-4 lg:px-0 py-8 ${
            open && !isMobile && "lg:max-w-[640px]"
          }`}
        >
          {/* Messages container */}
          <div className="space-y-6">
            {/* User message */}
            {input && (
              <div className="flex justify-end">
                <div>
                  <div className="bg-[#2f2f2f] rounded-2xl px-4 py-3">
                    <p className="text-gray-100 whitespace-pre-wrap">{input}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed input area at bottom */}
      <div className="sticky bottom-0 z-50 text-white flex flex-col items-center justify-end px-4 bg-[linear-gradient(to_bottom,rgba(33,33,33,0)_0%,rgba(33,33,33,1)_100%)]">
        <div className="w-full max-w-3xl flex flex-col items-center bg-[#212121] rounded-3xl">
          <TextareaComponent
            textareaValue={input}
            setTextareaValue={handleInputChange}
            handleKeyPress={handleKeyPress}
            isLoading={isLoading}
            handleSubmit={handleSendMessage}
            stop={handleStop}
          />
        </div>

        {/* Footer text */}
        <p className="text-center text-xs mt-3">
          Chatty can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
