"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Message, useChat } from "@ai-sdk/react";
import Image from "next/image";
import { MemoizedChatItem } from "@/components/Messages/ChatItem";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function ChatMessage({ messages }: { messages: Message[] }) {
  const { open, isMobile } = useSidebar();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 pb-32 ">
      <div
        className={`max-w-3xl space-y-8 ${
          open && !isMobile && "lg:max-w-[640px]"
        }`}
      >
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? (
              /* User Message Bubble - Right Side */
              <div className="flex flex-col items-end">
                <div className="max-w-[70%]">
                  <div className="bg-[#2f2f2f] rounded-3xl px-6 py-2 text-sm">
                    {/* Scrollable horizontally if content overflows */}
                    <div className="font-light text-gray-300 text-base overflow-x-auto whitespace-pre max-w-full pt-1">
                      {m.content}
                    </div>

                    {/* User message attachments */}
                    <div className="mt-3">
                      {m.experimental_attachments
                        ?.filter((attachment) =>
                          attachment.contentType?.startsWith("image/")
                        )
                        .map((attachment, index) => (
                          <Image
                            key={`${m.id}-${index}`}
                            src={attachment.url || "/placeholder.svg"}
                            alt={attachment.name || "Attachment"}
                            className="rounded-lg max-w-full h-auto"
                            width={400}
                            height={300}
                          />
                        ))}
                    </div>
                  </div>
                </div>
                <div className="group w-full h-10">
                  <div className="flex justify-end w-full mt-2 pr-1">
                    <Button
                      variant="ghost"
                      onClick={() => handleCopy(m.content)}
                      className="hidden group-hover:block"
                    >
                      {copied ? (
                        <Check />
                      ) : (
                        <Copy strokeWidth={2.5} className="rotate-90" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* Assistant Message Bubble - Left Side */
              <div className="flex">
                <div className="max-w-full">
                  <div className="rounded-3xl py-4 text-sm leading-relaxed">
                    <div className="text-gray-200">
                      <MemoizedChatItem
                        message={{ role: "assistant", content: m.content }}
                      />
                    </div>

                    <Separator className="my-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatMessage;
