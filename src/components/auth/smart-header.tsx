"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fish } from "lucide-react";

export function SmartHeader() {
  const { isAuthenticated, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/");
      router.refresh();
    }
  };

  if (isAuthenticated) {
    // Header for authenticated users
    return (
      <header className="flex h-18 shrink-0 items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>

        <div className="flex items-center">
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
    );
  }

  // Header for unauthenticated users
  return (
    <header className="flex h-18 items-center justify-between border-b px-4 lg:px-6">
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
