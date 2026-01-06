"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Send,
  Settings,
  ShieldCheck,
  MoreVertical,
  Square,
  Loader2,
} from "lucide-react";
import { ChatEntryScreen } from "@/components/chat/chat-entry-screen";
import { InitialQuestionScreen } from "@/components/chat/initial-question-screen";
import { ChatSidebar } from "@/components/chat/sidebar";
import { ChatMessage } from "@/components/chat/chat-message";
import { UserProfileButton } from "@/components/chat/user-profile-button";
import { Message, Source } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";

const API_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";

// --- Main Chat Page ---
export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [accessMode, setAccessMode] = React.useState<
    "anonymous" | "login" | null
  >(null);
  const [chatId, setChatId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Auto-set access mode for logged-in users
  React.useEffect(() => {
    if (user) {
      setAccessMode("login");
    }
  }, [user]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle mode selection
  const handleModeSelect = (mode: "anonymous" | "login") => {
    if (mode === "login") {
      router.push("/login");
    } else {
      setAccessMode(mode);
    }
  };

  // Create chat session
  const createChatSession = async (message: string): Promise<string> => {
    const res = await fetch(`${API_URL}/api/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to create chat session");
    }
    const data = await res.json();
    return data.chat_id;
  };

  // Send message and handle SSE stream
  const sendMessage = async (content: string, existingChatId: string) => {
    const res = await fetch(`${API_URL}/api/chat/${existingChatId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Stream-Protocol": "ai-sdk",
      },
      body: JSON.stringify({ message: content }),
      credentials: "include",
      signal: abortControllerRef.current?.signal,
    });

    if (!res.ok) {
      throw new Error("Failed to send message");
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let assistantContent = "";
    const collectedSources: Source[] = [];

    // Add empty assistant message
    const assistantMsgId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        sources: [],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            // Event type line, we handle data in next line
            continue;
          }
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);

              // Handle source events
              if (parsed.type === "source" && parsed.value) {
                const sourceData = parsed.value;
                collectedSources.push(sourceData);
              }

              // Handle text-delta events
              if (parsed.type === "text-delta" && parsed.value?.delta) {
                assistantContent += parsed.value.delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    updated[updated.length - 1] = {
                      ...lastMsg,
                      content: assistantContent,
                      sources: collectedSources,
                    };
                  }
                  return updated;
                });
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error: unknown) {
      const err = error as Error;
      if (
        err.name === "AbortError" ||
        err.message === "BodyStreamBuffer was aborted"
      ) {
        console.log("Fetch aborted by user");
      } else {
        console.error("Error reading stream:", error);
      }
    }

    // Final update with all sources
    setMessages((prev) => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];
      if (lastMsg && lastMsg.role === "assistant") {
        updated[updated.length - 1] = {
          ...lastMsg,
          content: assistantContent,
          sources: collectedSources,
        };
      }
      return updated;
    });
  };

  // Handle first question from initial screen
  const handleFirstQuestion = async (question: string) => {
    setIsLoading(true);

    try {
      // Create chat session first
      const newChatId = await createChatSession(question);
      // Redirect to chat page with the question as query param
      router.push(`/chat/${newChatId}?q=${encodeURIComponent(question)}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
      setIsLoading(false);
    }
  };

  // Handle subsequent messages
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatId) return;

    const question = input.trim();
    setInput("");
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: question,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    try {
      await sendMessage(question, chatId);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Stop generation
  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  // Reset chat
  const resetChat = () => {
    setChatId(null);
    setMessages([]);
    setInput("");
  };

  // Determine what content to show in the main area
  const showEntryScreen = !accessMode && !user;
  const showInitialQuestion = (accessMode || user) && !chatId;

  // Main layout with shared header and sidebar
  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Logo - Links to home */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
          >
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
              <span className="text-xl font-bold tracking-tighter">FQ</span>
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

          {/* Status indicator - Only when chatting */}
          {chatId && (
            <div className="hidden md:flex items-center gap-1.5 border-l border-border pl-4">
              <span
                className={`h-2 w-2 rounded-full ${isLoading ? "bg-chart-4 animate-pulse" : "bg-chart-3"
                  }`}
              />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                {isLoading ? "Thinking..." : "Online"}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">


          {/* User Profile Button */}
          <div className="hidden sm:block border-l border-border pl-3">
            <UserProfileButton />
          </div>

          <ModeToggle />
          <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground md:hidden">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <ChatSidebar onNewChat={resetChat} />

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative bg-background/50">
          {/* Entry Screen - No mode selected and not logged in */}
          {showEntryScreen && (
            <ChatEntryScreen onSelectMode={handleModeSelect} />
          )}

          {/* Initial Question Screen - Mode selected but no chat started */}
          {showInitialQuestion && (
            <>
              <InitialQuestionScreen
                onSubmit={handleFirstQuestion}
                isLoading={isLoading}
              />
              <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-center gap-2 text-[10px] font-semibold text-muted-foreground/60">
                <ShieldCheck className="h-3 w-3" />
                <span>AI powered by official DPIRD 2025 guidelines</span>
              </div>
            </>
          )}

          {/* Active Chat Interface */}
          {chatId && (
            <>
              {/* Disclaimer Banner */}
              <div className="bg-chart-4/5 border-b border-chart-4/10 px-6 py-2.5 flex items-center justify-center gap-2 text-[11px] font-semibold text-chart-4/80">
                <ShieldCheck className="h-3 w-3" />
                <span>
                  AI powered by official DPIRD 2025 guidelines. Always verify
                  local signs.
                </span>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLoading={isLoading}
                  />
                ))}

                {isLoading &&
                  messages[messages.length - 1]?.role === "user" && (
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                        <span className="font-bold text-xs">FQ</span>
                      </div>
                      <div className="bg-card border border-border rounded-2xl rounded-tl-none px-5 py-3">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-gradient-to-t from-background to-transparent">
                <form
                  onSubmit={handleSubmit}
                  className="max-w-4xl mx-auto relative group"
                >
                  <div className="relative flex items-center rounded-[1.5rem] border border-border bg-card shadow-2xl transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50 overflow-hidden">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask FishQuery about WA fishing rules..."
                      className="w-full py-4 pl-6 pr-24 bg-transparent text-sm focus:outline-none font-medium placeholder:text-muted-foreground/60"
                      disabled={isLoading}
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      {isLoading ? (
                        <button
                          type="button"
                          onClick={handleStop}
                          className="p-2.5 rounded-xl bg-destructive text-destructive-foreground shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                          <Square className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!input.trim()}
                          className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </form>
                <p className="text-[10px] text-center mt-4 text-muted-foreground font-medium uppercase tracking-widest opacity-40">
                  FishQuery may make mistakes. Verify with DPIRD.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
