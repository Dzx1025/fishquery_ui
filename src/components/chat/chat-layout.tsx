"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { SettingsMenu } from "@/components/chat/settings-menu";
import { ChatSidebar, SidebarContent } from "@/components/chat/sidebar";
import { UserProfileButton } from "@/components/chat/user-profile-button";
import { useAuth } from "@/hooks/useAuth";

interface ChatLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  showStatus?: boolean;
  onNewChat: () => void;
}

export function ChatLayout({
  children,
  isLoading = false,
  showStatus = false,
  onNewChat,
}: ChatLayoutProps) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
          >
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all overflow-hidden">
              <Image
                src="/favicon.ico"
                alt="FQ"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight">
                FishQuery
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                WA Rules Assistant
              </span>
            </div>
          </Link>

          {/* Status indicator */}
          {showStatus && (
            <div className="hidden md:flex items-center gap-1.5 border-l border-border pl-4">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLoading ? "bg-chart-4 animate-pulse" : "bg-chart-3"
                }`}
              />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                {isLoading ? "Thinking..." : "Online"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="border-l border-border pl-3">
            {user ? (
              <UserProfileButton />
            ) : (
              <Link href="/login">
                <button className="text-sm font-bold text-muted-foreground hover:text-foreground px-3 py-2 rounded-full transition-colors">
                  Log in
                </button>
              </Link>
            )}
          </div>
          <SettingsMenu />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-background border-r border-border h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="font-bold text-lg">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              onNewChat={() => {
                onNewChat();
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar onNewChat={onNewChat} />
        <div className="flex-1 flex flex-col relative bg-background/50">
          {children}
        </div>
      </div>
    </div>
  );
}
