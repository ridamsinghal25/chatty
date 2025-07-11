import { type Metadata } from "next";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { MessageProvider } from "./context/MessageContext/MessageContextProvider";
import { ChatProvider } from "./context/ChatContext/ChatContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatty",
  description: "A simple chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-[#212121] text-white`}
        >
          <SidebarProvider>
            <ChatProvider>
              <MessageProvider>
                <SignedIn>
                  <Sidebar />
                </SignedIn>
                <div className="flex-1">
                  <div className="sticky top-0 z-40 bg-background">
                    <Header />
                  </div>
                  <main>{children}</main>
                  <Toaster />
                </div>
              </MessageProvider>
            </ChatProvider>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
