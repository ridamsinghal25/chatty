"use client";

import {
  Search,
  Library,
  MessageSquareText,
  SquarePen,
  ChevronRight,
} from "lucide-react";

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
} from "@/components/ui/sidebar";

const chatHistory = [
  "Next.js Clerk Middleware",
  "ChatGPT Clone Development G...",
  "ENOENT Error Fix",
  "Chat Memory with mem0",
  "Notes Library Feature Updates",
  "Remote work clearance",
  "Secure RESTful Endpoint Design",
  "Job Application Summary",
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="bg-[#181818] text-white group-data-[collapsible=icon]:bg-[#212121] group-data-[collapsible=icon]:w-14 group-data-[collapsible=icon]:pl-1 group-data-[collapsible=icon]:mt-1 z-50"
    >
      <SidebarHeader className="group/header relative mt-1.5">
        {/* Container that handles the layout */}
        <div className="flex items-center justify-center transition-all duration-200 ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:relative">
          {/* MessageSquareText - Always visible */}
          <div className="flex items-center justify-center transition-all duration-200 ease-in-out">
            <MessageSquareText
              size={20}
              className="text-white transition-all duration-200 ease-in-out"
            />
          </div>

          {/* SidebarTrigger Container - Normal position when expanded, absolute when collapsed */}
          <div className="flex items-center gap-2 ml-auto transition-all duration-200 ease-in-out group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:group-hover/header:opacity-100 group-data-[collapsible=icon]:group-hover/header:translate-x-0 group-data-[collapsible=icon]:group-hover/header:pointer-events-auto">
            {/* Arrow icon - only visible in icon mode on hover */}
            <ChevronRight
              size={16}
              className="text-white opacity-0 transition-all duration-200 ease-in-out group-data-[collapsible=icon]:group-hover/header:opacity-100"
            />

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
                <SidebarMenuButton
                  tooltip="New Chat"
                  className="cursor-pointer hover:bg-[#424242]"
                >
                  <SquarePen size={20} />
                  <span>New Chat</span>
                </SidebarMenuButton>
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
                  <Library size={20} />
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
            <SidebarMenu>
              {chatHistory.map((chat, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton className="text-gray-300 hover:bg-[#424242] text-sm justify-start h-auto py-2">
                    <span className="truncate">{chat}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Exporting the original Sidebar name for compatibility
export { AppSidebar as Sidebar };
