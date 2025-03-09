"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Fish } from "lucide-react";

export function SmartHeader() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    // Header for authenticated users
    return (
      <header className="flex h-16 shrink-0 items-center px-4 justify-between">
        <SidebarTrigger className="min-w-6 min-h-6" />
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
