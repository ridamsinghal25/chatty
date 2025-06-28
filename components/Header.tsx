"use client";

import { ChevronDown, Crown, Ellipsis, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isMobile } = useSidebar();

  return (
    <header className="flex items-center justify-between px-4 p-2 bg-[#212121] text-white">
      <div className="flex items-center gap-3">
        {isMobile ? (
          <SidebarTrigger className="cursor-pointer hover:bg-blue-50" />
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-white text-xl">Chatty</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        )}
      </div>

      <div>
        <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white px-2 py-2 rounded-full text-sm font-medium">
          <Crown size={16} />
          Get Plus
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <Ellipsis size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#212121]">
            <DropdownMenuItem className="text-red-300 focus:text-red-300 cursor-pointer">
              <div>
                <Trash2 size={16} className="text-red-300" />
              </div>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex justify-end items-center gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
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
