"use client";

import {
  Search,
  MessageSquareText,
  SquarePen,
  Ellipsis,
  Trash2,
  Images,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAxiosFetcher } from "@/hooks/use-fetch";
import { IChat } from "@/models/Chat";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { API_ROUTES, ROUTES } from "@/utils/constants";
import { Button } from "./ui/button";
import { normalizeTitle } from "@/utils/normalizeTitle";
import { usePathname, useRouter } from "next/navigation";
import { useChatContext } from "@/app/context/ChatContext/ChatContextProvider";

export function AppSidebar() {
  const pathname = usePathname()?.split("/c/")[1];
  const router = useRouter();
  const { open, toggleSidebar } = useSidebar();

  const chatContext = useChatContext();

  if (!chatContext) return;

  const { isLoading, chats, setChats } = chatContext;

  const { fn: deleteChat } = useAxiosFetcher();

  const handleDeleteChat = async (chatId: string) => {
    const res = await deleteChat(`${API_ROUTES.CHAT}/${chatId}`, {
      method: "DELETE",
    });

    if (!res.success) return;

    setChats((prev: IChat[]) =>
      prev.filter((chat) => chat?._id?.toString() !== chatId)
    );

    if (pathname === chatId) {
      router.push(ROUTES.NEW_CHAT);
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#181818] text-white group-data-[collapsible=icon]:bg-[#212121] group-data-[collapsible=icon]:w-14 group-data-[collapsible=icon]:pl-1 group-data-[collapsible=icon]:mt-1 z-50 border-r-[#1b1b1b] border-r"
    >
      <SidebarHeader className="group/header relative">
        <div
          className={`flex items-center justify-center transition-all duration-200 ease-in-out`}
        >
          {/* MessageSquareText - Always visible */}
          <Button
            variant="ghost"
            onClick={() => {
              router.push(ROUTES.NEW_CHAT);
              toggleSidebar();
            }}
            className="focus-visible:ring-0"
          >
            <MessageSquareText
              size={27}
              className="text-white transition-all duration-200 ease-in-out !h-6 !w-6"
              strokeWidth={1.5}
            />
          </Button>

          {/* SidebarTrigger - Show/hide based on open state */}
          <div
            className={`
               flex items-center gap-2 transition-all duration-200 ease-in-out
            ${
              !open
                ? "absolute right-0 opacity-0 translate-x-2 pointer-events-none group-hover/header:opacity-100 group-hover/header:translate-x-0 group-hover/header:pointer-events-auto mr-2"
                : "ml-auto"
            }
          `}
          >
            <SidebarTrigger className="cursor-pointer" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Group */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href={ROUTES.NEW_CHAT}>
                  <SidebarMenuButton
                    tooltip="New Chat"
                    className="cursor-pointer hover:bg-[#424242]"
                    onClick={() => toggleSidebar()}
                  >
                    <SquarePen size={20} />
                    <span>New Chat</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Search Chats"
                  className="cursor-pointer hover:bg-[#424242]"
                >
                  <Search size={20} />
                  <span>Search chats</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Library"
                  className="cursor-pointer hover:bg-[#424242]"
                >
                  <Images size={20} />
                  <span>Library</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat History Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div className="px-4 py-2" key={index}>
                  <Skeleton className="h-4 w-full rounded-md bg-muted" />
                </div>
              ))
            ) : (
              <SidebarMenu>
                {chats?.length > 0 ? (
                  chats.map((chat: IChat) => (
                    <DropdownMenu key={chat._id?.toString()}>
                      <SidebarMenuItem
                        className={`rounded-lg cursor-pointer hover:bg-[#424242] ${
                          pathname === chat._id?.toString()
                            ? "bg-[#424242]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={ROUTES.CHAT.replace(
                              ":id",
                              chat._id!.toString()
                            )}
                          >
                            <SidebarMenuButton
                              className="text-gray-300  text-sm justify-start cursor-pointer w-full"
                              onClick={() => toggleSidebar()}
                            >
                              <span className="truncate w-44">
                                {normalizeTitle(chat.title)}
                              </span>
                            </SidebarMenuButton>
                          </Link>
                          <DropdownMenuTrigger asChild className="rounded-lg">
                            <Button
                              variant="ghost"
                              className="data-[state=open]:bg-[#424242]"
                            >
                              <Ellipsis size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                        </div>

                        <DropdownMenuContent
                          align="end"
                          alignOffset={-100}
                          className="bg-[#353535] rounded-2xl"
                        >
                          <DropdownMenuItem asChild>
                            <Button
                              variant="ghost"
                              className="text-red-400 cursor-pointer w-full hover:!bg-[#424242] hover:!text-red-400 focus-visible:ring-0 rounded-xl"
                              onClick={() =>
                                handleDeleteChat(chat._id!?.toString())
                              }
                            >
                              <Trash2 size={16} className="text-red-400 mr-2" />
                              Delete
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </SidebarMenuItem>
                    </DropdownMenu>
                  ))
                ) : (
                  <div className="no-chat-available text-gray-500 text-center py-4">
                    <p>No chats available</p>
                    <p>Start a new conversation</p>
                  </div>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Exporting the original Sidebar name for compatibility
export { AppSidebar as Sidebar };
