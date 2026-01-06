"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  MessageSquare,
  ShieldCheck,
  Info,
  ChevronRight,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  GET_CHAT_LIST,
  RENAME_CHAT,
  DELETE_CHAT,
  type ChatListData,
  type ChatListVars,
  type Chat,
} from "@/lib/graphql";

function SidebarButton({
  icon,
  label,
  onClick,
  variant = "ghost",
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "ghost" | "primary";
}) {
  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] group mb-2"
      >
        <div className="p-1 rounded-lg bg-primary-foreground/20 group-hover:bg-primary-foreground/30 transition-colors">
          {icon}
        </div>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground group"
    >
      <div className="p-1.5 rounded-lg bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-sm">
        {icon}
      </div>
      <span>{label}</span>
      <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function ChatListItem({
  chat,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(chat.title || "New Chat");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const formattedDate = new Date(chat.updated_at).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      onRename(chat.id, editTitle.trim());
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(chat.id);
    setShowMenu(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") setIsEditing(false);
          }}
          className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleRename}
          className="p-1 rounded hover:bg-primary/10 text-primary"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="p-1 rounded hover:bg-muted text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all group cursor-pointer ${isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-primary/10 hover:text-primary text-muted-foreground"
        }`}
      onClick={onSelect}
    >
      <div
        className={`p-1.5 rounded-lg border transition-colors shadow-sm ${isActive
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background border-border group-hover:bg-primary group-hover:text-primary-foreground"
          }`}
      >
        <MessageSquare className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-medium truncate">{chat.title || "New Chat"}</p>
        <p className="text-[10px] text-muted-foreground/60">{formattedDate}</p>
      </div>

      {/* Menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[120px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChatList({ userId }: { userId: number }) {
  const router = useRouter();
  const params = useParams();
  const currentChatId = params?.chatId as string | undefined;

  const { data, loading, error } = useQuery<ChatListData, ChatListVars>(
    GET_CHAT_LIST,
    {
      variables: { userId },
      skip: !userId,
    }
  );

  const [renameChat] = useMutation(RENAME_CHAT, {
    refetchQueries: [{ query: GET_CHAT_LIST, variables: { userId } }],
  });

  const [deleteChat] = useMutation(DELETE_CHAT, {
    refetchQueries: [{ query: GET_CHAT_LIST, variables: { userId } }],
  });

  const handleSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleRename = async (id: string, newTitle: string) => {
    try {
      await renameChat({ variables: { id, newTitle } });
    } catch (err) {
      console.error("Failed to rename chat:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChat({ variables: { id } });
      // If deleting current chat, redirect to /chat
      if (id === currentChatId) {
        router.push("/chat");
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    console.error("ChatList error:", error.message);
    return (
      <div className="flex items-center gap-2 px-3 py-4 text-xs text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span>Failed to load chats</span>
      </div>
    );
  }

  const chats = data?.chats_chat ?? [];

  if (chats.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-muted-foreground text-center">
        No chat history yet
      </div>
    );
  }

  return (
    <div className="grid gap-1">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === currentChatId}
          onSelect={() => handleSelect(chat.id)}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export function ChatSidebar({ onNewChat }: { onNewChat?: () => void }) {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-72 border-r border-border bg-muted/30 p-4 space-y-6 overflow-y-auto">
      {/* New Chat Button */}
      <div className="px-2">
        <SidebarButton
          variant="primary"
          icon={<Plus className="h-5 w-5" />}
          label="New Chat"
          onClick={onNewChat}
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
          Quick Actions
        </h3>
        <div className="grid gap-2">
          <SidebarButton
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Review Daily Limits"
          />
          <SidebarButton
            icon={<MessageSquare className="h-4 w-4" />}
            label="Species ID Guide"
          />
        </div>
      </div>

      {/* Chat History - Only for authenticated users */}
      {user && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
            Chat History
          </h3>
          <ChatList userId={user.id} />
        </div>
      )}

      {/* Info Card */}
      <div className="mt-auto p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Info className="h-4 w-4" />
          <span className="text-xs font-bold">Safe Fishing</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Always carry a physical copy of the fishing guide in areas with poor
          mobile reception.
        </p>
      </div>
    </aside>
  );
}
