"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, Settings2, ArrowUp, Square, X } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import { useAxiosFetcher } from "@/hooks/use-fetch";
import { API_ROUTES } from "@/utils/constants";

function TextareaComponent({
  textareaValue,
  setTextareaValue,
  handleKeyPress,
  isLoading = false,
  stop,
  handleSubmit,
}: {
  textareaValue: string;
  setTextareaValue: (e: any) => void;
  handleKeyPress: (
    e: React.KeyboardEvent,
    attachement?: {
      name: string;
      url: string;
      id: string;
      contentType?: string;
    }
  ) => void;
  isLoading?: boolean;
  stop?: () => void;
  handleSubmit: (
    event?: any,
    attachment?: {
      name: string;
      url: string;
      id: string;
      contentType?: string;
    }
  ) => void;
}) {
  const { open, isMobile } = useSidebar();
  const [cloudinaryResponse, setCloudinaryResponse] =
    useState<CloudinaryUploadWidgetInfo | null>(null);

  const { fn: deleteFile } = useAxiosFetcher();

  const handleDelete = async () => {
    if (cloudinaryResponse) {
      setCloudinaryResponse(null);

      await deleteFile(API_ROUTES.CLOUDINARY, {
        method: "DELETE",
        data: {
          publicId: cloudinaryResponse?.public_id,
          resourceType: cloudinaryResponse?.resource_type,
        },
      });
    }
  };

  return (
    <div className={`${open && !isMobile ? "w-10/12" : "w-full"} `}>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (isLoading) {
            stop?.();
          } else {
            if (cloudinaryResponse) {
              handleSubmit(event, {
                name: cloudinaryResponse?.original_filename,
                url: cloudinaryResponse?.secure_url,
                id: cloudinaryResponse?.public_id,
                contentType: `${cloudinaryResponse?.resource_type}/${cloudinaryResponse?.format}`,
              });

              setCloudinaryResponse(null);
              return;
            }

            handleSubmit();
          }
        }}
      >
        <div className="bg-[#303030] max-w-3xl rounded-3xl p-2">
          {cloudinaryResponse && cloudinaryResponse?.secure_url && (
            <div className="bg-[#303030] max-w-3xl rounded-3xl p-2">
              <div className="p-2 relative inline-block">
                <div>
                  <Image
                    src={cloudinaryResponse?.secure_url}
                    width={100}
                    height={100}
                    alt="logo"
                    className="rounded-2xl w-16 h-16 object-cover border-[#424242] border-2"
                  />

                  <div className="absolute top-3 right-3.5">
                    <button
                      className=" w-4 h-4 rounded-full cursor-pointer"
                      onClick={handleDelete}
                    >
                      <X className="h-3.5 w-3.5 text-black text-center bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Textarea
            value={textareaValue}
            onChange={setTextareaValue}
            onKeyDown={(event) => {
              if (!textareaValue) return;

              if (cloudinaryResponse && event.key === "Enter") {
                handleKeyPress(event, {
                  name: cloudinaryResponse?.original_filename,
                  url: cloudinaryResponse?.secure_url,
                  id: cloudinaryResponse?.public_id,
                  contentType: `${cloudinaryResponse?.resource_type}/${cloudinaryResponse?.format}`,
                });

                setCloudinaryResponse(null);
              } else {
                handleKeyPress(event);
              }
            }}
            disabled={isLoading}
            placeholder="Ask anything"
            className="border-none !bg-[#303030] placeholder:bg-transparent !text-base focus-visible:ring-0 resize-none max-h-32 -mb-1"
            rows={1}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pt-1">
              <CldUploadWidget
                signatureEndpoint={"/api/cloudinary"}
                config={{
                  cloud: {
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                  },
                }}
                onSuccess={(result) => {
                  if (result?.info) {
                    setCloudinaryResponse(
                      result?.info as CloudinaryUploadWidgetInfo
                    );
                  }
                }}
                onQueuesEnd={(result, { widget }) => {
                  widget.close();
                }}
              >
                {({ open }) => {
                  return (
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      className="hover:text-white hover:bg-gray-700 hover:rounded-full"
                      onClick={() => {
                        if (cloudinaryResponse) {
                          handleDelete();
                        }

                        open();
                      }}
                    >
                      <Plus className="size-6" strokeWidth={1.2} />
                    </Button>
                  );
                }}
              </CldUploadWidget>

              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="hover:text-white hover:bg-gray-700 hover:rounded-2xl flex items-center gap-2 px-3 py-2 h-auto"
              >
                <Settings2 className="w-4 h-4" />
                <span className="text-sm">Tools</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="hover:text-white hover:bg-gray-700 p-2 hover:rounded-full"
              >
                <Mic className="size-5" strokeWidth={1.2} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-100 rounded-full hover:!bg-gray-400"
                type="submit"
                disabled={!textareaValue}
              >
                {isLoading ? (
                  <div>
                    <Square
                      className="size-4 text-black hover:text-white"
                      fill="black"
                    />
                  </div>
                ) : (
                  <ArrowUp className="size-5 text-black hover:text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export { TextareaComponent };
