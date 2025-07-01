"use client";

import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { MemoizedChatItem } from "@/components/Messages/ChatItem";
import { Separator } from "@/components/ui/separator";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Pencil, X } from "lucide-react";
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { Attachment, IMessage } from "@/models/Messages";
import { Textarea } from "../ui/textarea";
import { useAxiosFetcher } from "@/hooks/use-fetch";
import { API_ROUTES } from "@/utils/constants";
import { useMessageContext } from "@/app/context/MessageContext/MessageContextProvider";

export function ChatMessage() {
  const { open, isMobile } = useSidebar();
  const [copied, setCopied] = useState<string>("");
  const [editingMessage, setEditingMessage] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const { loading: saving, fn: saveMessage } = useAxiosFetcher();
  const [selectedImage, setSelectedImage] = useState<Attachment>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isResponseCopied, setIsResponseCopied] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messageContext = useMessageContext();

  if (!messageContext) return;

  const {
    allMessages,
    setAllMessages,
    append,
    status,
  }: {
    allMessages: IMessage[];
    setMessages: (
      messages: Message[] | ((messages: Message[]) => Message[])
    ) => void;
    setAllMessages: Dispatch<SetStateAction<IMessage[]>>;
    append: (
      message: Message | CreateMessage,
      chatRequestOptions?: ChatRequestOptions
    ) => Promise<string | null | undefined>;
    status: "submitted" | "streaming" | "ready" | "error";
  } = messageContext;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const handleCopy = async (message: IMessage) => {
    try {
      if (!message._id) return;

      await navigator.clipboard.writeText(message.content);
      setCopied(message._id?.toString());
      setTimeout(() => setCopied(""), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleResponseCopy = async (message: IMessage) => {
    try {
      if (!message._id) return;

      await navigator.clipboard.writeText(message.content);
      setIsResponseCopied(message._id?.toString());
      setTimeout(() => setIsResponseCopied(""), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle message editing
  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessage({ id: messageId, content });
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const handleSave = async () => {
    append({
      role: "user",
      content: editingMessage?.content || "",
      id: Date.now().toString(),
    });

    const res = await saveMessage(
      `${API_ROUTES.EDIT_MESSAGE}/${editingMessage?.id}`,
      {
        method: "PATCH",
        data: {
          content: editingMessage?.content,
        },
      }
    );

    if (!res.success) return;

    setEditingMessage(null);
    setAllMessages((prev) => [...prev, res.data]);
  };

  const displayMessages =
    allMessages[allMessages.length - 1]?.role === "assistant" &&
    status === "streaming"
      ? allMessages.slice(0, -1)
      : allMessages;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 pb-32 ">
      <div
        className={`max-w-3xl w-full space-y-8 ${
          open && !isMobile && "md:max-w-[420px] lg:max-w-[640px]"
        }`}
      >
        {displayMessages.map((m, index) => (
          <div key={m._id?.toString()}>
            {m.role === "user" ? (
              /* User Message Bubble - Right Side */
              <div className="flex flex-col items-end">
                <div className="mb-2">
                  {m.attachment &&
                    m.attachment.url &&
                    m.attachment.contentType?.includes("image") && (
                      <Image
                        key={`${Date.now()}-${index}`}
                        src={m.attachment.url}
                        alt={m.attachment.name || "Attachment"}
                        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110 rounded-2xl cursor-pointer"
                        width={400}
                        height={300}
                        onClick={() => {
                          setSelectedImage(m.attachment);
                          setIsDialogOpen(true);
                        }}
                      />
                    )}
                </div>
                <div className="max-w-[70%]">
                  {/* User message attachments */}

                  {editingMessage?.id !== m._id?.toString() && (
                    <div className="bg-[#2f2f2f] rounded-3xl px-6 py-2 text-sm">
                      <div className="font-light text-gray-300 text-base overflow-x-auto whitespace-pre max-w-full pt-1">
                        {m.content}
                      </div>
                    </div>
                  )}
                </div>

                {editingMessage?.id === m._id?.toString() ? (
                  <div className="relative w-full">
                    <div className="bg-[#424242] max-w-3xl rounded-3xl p-2">
                      <Textarea
                        value={editingMessage?.content}
                        onChange={(e) =>
                          setEditingMessage({
                            id: editingMessage?.id || "",
                            content: e.target.value,
                          })
                        }
                        // onKeyDown={handleKeyDown}
                        className="w-full max-h-40 rounded-3xl font-light !text-base resize-none border-none outline-none focus-visible:ring-0 !bg-[#424242]"
                        autoFocus
                      />

                      {/* Edit mode controls */}
                      <div className="flex items-center justify-end p-2">
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            size="sm"
                            onClick={handleCancelEdit}
                            variant="secondary"
                            className="px-4 py-2 text-sm h-8 bg-[#0f0e0e] focus:bg-[#212121] rounded-3xl text-white"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSave}
                            className="px-4 py-2 text-sm h-8 bg-[#fff] rounded-3xl"
                            disabled={saving}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="group w-full h-10 flex justify-end mt-1">
                    <Button
                      variant="ghost"
                      onClick={() => handleCopy(m)}
                      className="hidden group-hover:block"
                    >
                      {copied === m._id?.toString() ? (
                        <Check />
                      ) : (
                        <Copy strokeWidth={2.5} className="rotate-90" />
                      )}
                    </Button>

                    {(!m.attachment || !m.attachment.url) && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleEditMessage(m._id!.toString(), m.content)
                        }
                        className="hidden group-hover:block"
                      >
                        <Pencil strokeWidth={2.5} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Assistant Message Bubble - Left Side */
              <div className="flex">
                <div className="max-w-full">
                  <div className="rounded-3xl py-4 text-sm leading-relaxed">
                    <div className="text-gray-200">
                      <MemoizedChatItem
                        message={{
                          role: "assistant",
                          content: m.content,
                        }}
                      />
                    </div>

                    <Separator className="my-2" />
                    <div className=" w-full h-10 flex justify-start mt-1">
                      <Button
                        variant="ghost"
                        onClick={() => handleResponseCopy(m)}
                      >
                        {isResponseCopied === m._id?.toString() ? (
                          <Check />
                        ) : (
                          <Copy strokeWidth={2.5} className="rotate-90" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div ref={messagesEndRef} />
      {/* Fullscreen Dialog */}
      {isDialogOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
          onClick={() => setIsDialogOpen(false)}
        >
          {/* Dialog Content */}
          <div
            className="relative max-w-7xl max-h-full p-4 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10 bg-black/20 rounded-full p-2 backdrop-blur-sm cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            {selectedImage.url && (
              <Image
                src={selectedImage.url}
                alt={selectedImage.name || "Fullscreen image"}
                width={1000}
                height={1000}
                priority
                sizes="100vw"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl z-50"
              />
            )}

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-lg font-semibold">
                {selectedImage.name}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
