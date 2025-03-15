import * as React from "react";

import {NavList} from "@/components/sidebar/nav-chats";
import {NavUser} from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {Fish, Plus} from "lucide-react";
import Link from "next/link";


export default function AppSidebar() {
  return (
    <Sidebar variant="inset" className="">
      <SidebarHeader className="p-4">
        <SidebarMenu className="flex flex-col space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="py-10" asChild>
              <Link
                href="/"
                className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <div
                  className="bg-primary text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105">
                  <Fish className="size-6 transition-transform hover:animate-pulse"/>
                </div>
                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-bold transition-colors hover:text-primary">
                    Fish Query
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton
                size="lg"
                className="w-full flex items-center gap-2 rounded-lg p-2 my-2 transition-colors"
              >
                <Plus className="h-4 w-4"/>
                <span>New Chat</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavList/>
      </SidebarContent>

      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}
