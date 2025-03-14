"use client";

import {
  FileSliders,
  FolderPen,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMemo, useState } from "react";
import { DBChat } from "@/lib/apollo/types";
import { useChatList, useDeleteChat, useRenameChat } from "@/hooks/useChat";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Group chats by date (month and year)
const groupChatsByDate = (chats: DBChat[]) => {
  const groups: Record<string, DBChat[]> = {};

  chats.forEach((chat) => {
    const updatedAt = new Date(chat.updated_at);

    // Format the date as "Month Year" (e.g., "March 2025")
    const groupKey = updatedAt.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(chat);
  });

  // Sort the groups by date (newest first)
  return Object.entries(groups).sort(([dateA], [dateB]) => {
    // Extract dates from formatted strings to compare
    const monthYearA = new Date(dateA).getTime();
    const monthYearB = new Date(dateB).getTime();

    return monthYearB - monthYearA;
  });
};

export function NavList() {
  const { isMobile } = useSidebar();
  const params = useParams();
  const router = useRouter();
  const currentChatId = params.id as string | undefined;

  // Chat list state
  const {
    chats,
    loading: chatLoading,
    error: chatFetchError,
    refetch,
  } = useChatList();

  // Group chats by date
  const groupedChats = useMemo(() => {
    return groupChatsByDate(chats);
  }, [chats]);

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [selectedChat, setSelectedChat] = useState<DBChat | null>(null);

  // Chat operations
  const { renameChat, loading: renaming, error: renameError } = useRenameChat();
  const { deleteChat, loading: deleting, error: deleteError } = useDeleteChat();

  // Handle rename chat
  const handleRenameClick = (chat: DBChat) => {
    setSelectedChat(chat);
    setNewChatTitle(chat.title);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!selectedChat || !newChatTitle.trim()) return;

    try {
      await renameChat(selectedChat.id, newChatTitle.trim());

      toast("Chat renamed");

      refetch(); // Refresh the chat list
    } catch (error) {
      toast("Failed to rename chat");
    }

    setIsRenameDialogOpen(false);
  };

  // Handle delete chat
  const handleDeleteClick = (chat: DBChat) => {
    setSelectedChat(chat);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChat) return;

    try {
      await deleteChat(selectedChat.id);

      toast("Chat deleted");

      // If the deleted chat is the current one, navigate to the main page
      if (currentChatId === selectedChat.id) {
        router.push("/");
      }

      refetch(); // Refresh the chat list
    } catch (error) {
      toast("Failed to delete chat");
    }

    setIsDeleteDialogOpen(false);
  };

  // Handle view source action
  const handleViewSource = (chat: DBChat) => {
    // Implement the view source functionality
    toast(`Viewing source for ${chat.title}`);
  };

  // Show error when fetching chats fails
  if (chatFetchError && !chatLoading && chats.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <div className="p-3 mx-2 my-2 rounded-md border bg-background/80 border-border dark:border-border/30 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-destructive dark:text-destructive/90">
            <TriangleAlert className="h-4 w-4" />
            <span className="font-medium text-sm">Connection Error</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Failed to load chats. Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs justify-center bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Retry
          </Button>
        </div>
      </SidebarGroup>
    );
  }

  // Render empty state
  if (!chatLoading && chats.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarMenu>
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">No chats found</p>
            <Button variant="outline" size="sm" className="mt-1">
              <Plus className="mr-2 h-4 w-4" />
              Create new chat
            </Button>
          </div>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Render chat groups
  return (
    <>
      {/* Render each date group with its chats */}
      {groupedChats.map(([dateGroup, dateChats]) => (
        <SidebarGroup
          key={dateGroup}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>{dateGroup}</SidebarGroupLabel>
          <SidebarMenu>
            {dateChats.map((chat) => (
              <SidebarMenuItem
                key={chat.id}
                className={
                  currentChatId === chat.id ? "bg-accent/100 rounded-md" : ""
                }
              >
                <SidebarMenuButton asChild>
                  <Link href={`/chat/${chat.id}`}>
                    <span className="truncate">{chat.title}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">
                        More options for {chat.title}
                      </span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem onClick={() => handleViewSource(chat)}>
                      <FileSliders className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Check Source</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRenameClick(chat)}>
                      <FolderPen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Rename Chat</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => handleDeleteClick(chat)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Chat</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}

      {/* Rename Chat Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Chat title"
            className="mt-4"
            autoFocus
          />
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={!newChatTitle.trim() || renaming}
            >
              {renaming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chat Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the chat "{selectedChat?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
