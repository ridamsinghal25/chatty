"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { MemoizedChatItem } from "@/components/Messages/ChatItem";
import { useMessageContext } from "@/app/context/MessageContext/MessageContextProvider";

function AIChatMessage() {
  const messageContext = useMessageContext();
  const { open, isMobile } = useSidebar();

  if (!messageContext) return;

  const { messages, status } = messageContext;

  const message =
    messages.length > 1 && status === "streaming"
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
