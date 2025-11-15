"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={user?.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.username}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user?.username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.username}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                {user?.is_subscription_active ? (
                  <BadgeCheck className="text-green-500" />
                ) : (
                  <BadgeCheck className="text-gray-400" />
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-medium capitalize ${
                        !user?.is_subscription_active
                          ? "text-gray-400"
                          : user?.subscription_type === "free"
                          ? "text-gray-500"
                          : user?.subscription_type === "basic"
                          ? "text-blue-600"
                          : user?.subscription_type === "premium"
                          ? "text-purple-600"
                          : user?.subscription_type === "enterprise"
                          ? "text-emerald-600"
                          : ""
                      }`}
                    >
                      {user?.subscription_type || "Free Plan"}
                    </span>
                    {user?.is_subscription_active &&
                      (user?.subscription_type === "premium" ||
                        user?.subscription_type === "enterprise") && (
                        <Sparkles className="h-3 w-3 text-amber-500" />
                      )}
                  </div>
                  <span
                    className={`text-xs ${
                      user?.is_subscription_active
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    {user?.is_subscription_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CreditCard />
                <div className="flex flex-col">
                  <span className="font-medium">Usage</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.messages_used_today || 0} /{" "}
                    {user?.daily_message_quota || 0} messages
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                <div className="flex flex-col">
                  <span className="font-medium">Subscription</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.subscription_expiry
                      ? `Expires: ${new Date(
                          user.subscription_expiry
                        ).toLocaleDateString()}`
                      : "No active subscription"}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
