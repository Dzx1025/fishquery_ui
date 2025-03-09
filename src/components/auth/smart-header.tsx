"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fish, MessageCirclePlus } from "lucide-react";

export function SmartHeader() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  const handleNewChat = async () => {
    router.push("/");
    router.refresh();
  };

  if (isAuthenticated) {
    // Header for authenticated users
    return (
      <header className="flex h-16 shrink-0 items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 min-w-6 min-h-6" />
        </div>

        <div className="flex items-center">
          <div className="p-3 md:p-2 touch-manipulation active:bg-gray-200 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer flex items-center justify-center">
            <MessageCirclePlus
              onClick={handleNewChat}
              className="-mt-0.5 min-w-6 min-h-6"
              size={22}
            />
          </div>
        </div>
      </header>
    );
  }

  // Header for unauthenticated users
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
      <a
        href="/"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="bg-primary text-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105">
          <Fish className="size-5 transition-transform hover:animate-pulse" />
        </div>
        <div className="text-left">
          <span className="font-bold text-lg transition-colors hover:text-primary">
            Fish Query
          </span>
        </div>
      </a>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/register" className="hidden md:block">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>
    </header>
  );
}
