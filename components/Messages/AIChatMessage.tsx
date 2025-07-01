"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { MemoizedChatItem } from "@/components/Messages/ChatItem";
import { useMessageContext } from "@/app/context/MessageContext/MessageContextProvider";
import { useEffect, useRef } from "react";
import { API_ROUTES } from "@/utils/constants";
import { useAxiosFetcher } from "@/hooks/use-fetch";
import { useParams } from "next/navigation";
import { IMessage } from "@/models/Messages";

function AIChatMessage() {
  const { chatId } = useParams();
  const messageContext = useMessageContext();
  const { open, isMobile } = useSidebar();
  const { fn: createChatMessage } = useAxiosFetcher();

  if (!messageContext) return;

  const { messages, status, setAllMessages, allMessages } = messageContext;

  useEffect(() => {
    const lastAIResponse = messages[messages.length - 1];
    const lastMessage = allMessages[allMessages.length - 1];

    if (
      status !== "streaming" &&
      lastAIResponse?.role === "assistant" &&
      lastAIResponse?.content &&
      lastAIResponse.content !== lastMessage?.content
    ) {
      async function createMessage() {
        const formData = new FormData();
        formData.append("role", "assistant");
        formData.append("content", lastAIResponse.content);

        const res = await createChatMessage(`${API_ROUTES.MESSAGE}/${chatId}`, {
          method: "POST",
          data: formData,
        });

        if (!res.success) return;

        setAllMessages((prev: IMessage[]) => [...prev, res.data]);
      }

      createMessage();
    }
  }, [status]);

  const message =
    messages.length > 1 &&
    status === "streaming" &&
    messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1]
      : null;

  if (!message) return null;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 -mt-32 ">
      <div
        className={`max-w-3xl w-full space-y-8 ${
          open && !isMobile && "md:max-w-[420px] lg:max-w-[640px]"
        }`}
      >
        <div key={message?.id}>
          <div className="flex">
            <div className="max-w-full">
              <div className="rounded-3xl py-4 text-sm leading-relaxed">
                <div className="text-gray-200">
                  <MemoizedChatItem
                    message={{ role: "assistant", content: message?.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatMessage;
