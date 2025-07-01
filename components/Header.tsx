"use client";

import {
  Check,
  ChevronDown,
  Crown,
  Ellipsis,
  MessageSquareText,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useAxiosFetcher } from "@/hooks/use-fetch";
import { API_ROUTES, ROUTES } from "@/utils/constants";
import { IChat } from "@/models/Chat";
import { useChatContext } from "@/app/context/ChatContext/ChatContextProvider";
import { useRouter } from "next/navigation";

export function Header() {
  const { isMobile } = useSidebar();
  const chatId = usePathname()?.split("/c/")[1];
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { fn: deleteChat } = useAxiosFetcher();

  const chatContext = useChatContext();

  if (!chatContext) return;

  const { setChats } = chatContext;

  const handleDeleteChat = async (deleteChatId: string) => {
    const res = await deleteChat(`${API_ROUTES.CHAT}/${chatId}`, {
      method: "DELETE",
    });

    if (!res.success) return;

    setChats((prev: IChat[]) =>
      prev.filter((chat) => chat?._id?.toString() !== chatId)
    );

    if (deleteChatId === chatId) {
      router.push(ROUTES.NEW_CHAT);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 p-2 bg-[#212121] text-white border-b border-[#2c2c2c]">
      <div className="flex items-center gap-3">
        {isMobile ? (
          <SidebarTrigger className="cursor-pointer hover:bg-blue-50" />
        ) : (
          <div className="flex items-center gap-2 ml-2 !focus-visible:ring-0">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="cursor-pointer hover:!bg-[#575757] p-1 px-1.5 rounded-lg"
                  asChild
                >
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:!bg-[#575757]"
                  >
                    <span className="text-white text-xl">Chatty</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  alignOffset={-200}
                  className="w-80 bg-[#353535] text-white rounded-2xl"
                >
                  <DropdownMenuItem className="flex items-center justify-between text-white hover:!bg-[#424242] rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5 size-4 text-white" />
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          Chatty Plus
                        </span>
                        <span className="text-xs text-gray-400">
                          Our smartest model & more
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={"outline"}
                      className="rounded-2xl"
                    >
                      Upgrade
                    </Button>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center justify-between text-white hover:!bg-[#424242] rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <MessageSquareText className="size-4 h-5 w-5 text-white" />
                      <div className="flex flex-col">
                        <span className="font-medium text-white">Chatty</span>
                        <span className="text-xs text-gray-400">
                          Great for everyday tasks
                        </span>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-white" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white text-xl">Chatty</span>
              </div>
            )}
          </div>
        )}
      </div>

      <SignedIn>
        <div>
          <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white px-2 py-2 rounded-full text-sm font-medium">
            <Crown size={16} />
            Get Plus
          </Button>
        </div>
      </SignedIn>

      <div className="flex items-center gap-4">
        {chatId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer w-9 data-[state=open]:!bg-[#424242]"
              >
                <Ellipsis size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#353535] rounded-2xl"
            >
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  className="text-red-400 cursor-pointer w-full hover:!bg-[#424242] hover:!text-red-400 focus-visible:ring-0 rounded-xl"
                  onClick={() => handleDeleteChat(chatId)}
                >
                  <Trash2 size={16} className="text-red-400 mr-2" />
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="flex justify-end items-center gap-4">
          <SignedOut>
            <SignInButton>
              <Button className="rounded-2xl">Log in</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="outline" className="rounded-2xl">
                Sign Up for free
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
