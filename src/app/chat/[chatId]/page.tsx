"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSubscription } from "@apollo/client/react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Send,
  Settings,
  ShieldCheck,
  MoreVertical,
  Square,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import { ChatSidebar } from "@/components/chat/sidebar";
import { ChatMessage } from "@/components/chat/chat-message";
import { Message, Source } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";
import { SUBSCRIBE_TO_MESSAGES } from "@/lib/graphql";

const API_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";

interface DbSource {
  index: number;
  score: number;
  content: string;
  metadata?: Record<string, unknown>;
}

interface SubscriptionMessage {
  content: string;
  created_at: string;
  message_type: "user" | "assistant";
  metadata?: {
    sources?: DbSource[];
  };
}

interface SubscriptionData {
  chats_message: SubscriptionMessage[];
}

// Transform DB source format to frontend Source format
function transformSources(dbSources?: DbSource[]): Source[] {
  if (!dbSources) return [];
  return dbSources.map((s, idx) => ({
    type: "source" as const,
    sourceType: "document" as const,
    id: `source-${idx}`,
    title: s.metadata?.source
      ? String(s.metadata.source).split("/").pop() || `Source ${s.index}`
      : `Source ${s.index}`,
    document: {
      content: s.content,
      metadata: s.metadata || {},
      score: s.score,
      index: s.index,
    },
  }));
}

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = params.chatId as string;
  const initialQuestion = searchParams.get("q");
  const { user, loading: authLoading, logout } = useAuth();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] =
    React.useState<Message | null>(null);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const initialSentRef = React.useRef(false);

  // Subscribe to messages
  const { data: subData, loading: subLoading } =
    useSubscription<SubscriptionData>(SUBSCRIBE_TO_MESSAGES, {
      variables: { chatId },
      skip: !chatId || !user,
    });

  // Update messages when subscription data changes (only when not streaming)
  React.useEffect(() => {
    if (subData?.chats_message && !isLoading) {
      const formattedMessages: Message[] = subData.chats_message.map(
        (msg, idx) => ({
          id: `msg-${idx}-${msg.created_at}`,
          role: msg.message_type === "user" ? "user" : "assistant",
          content: msg.content,
          sources: transformSources(msg.metadata?.sources),
          timestamp: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      );
      setMessages(formattedMessages);
      setStreamingMessage(null);
    }
  }, [subData, isLoading]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Handle initial question from query param
  React.useEffect(() => {
    if (initialQuestion && !initialSentRef.current && user && !authLoading) {
      initialSentRef.current = true;
      // Clear the query param from URL
      router.replace(`/chat/${chatId}`, { scroll: false });

      // Send the initial question
      const sendInitialQuestion = async () => {
        setIsLoading(true);
        abortControllerRef.current = new AbortController();

        // Add user message
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          role: "user",
          content: initialQuestion,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages([userMessage]);

        try {
          await sendMessage(initialQuestion, userMessage);
        } catch (error) {
          console.error("Failed to send initial message:", error);
        } finally {
          setIsLoading(false);
          abortControllerRef.current = null;
        }
      };

      sendInitialQuestion();
    }
  }, [initialQuestion, user, authLoading, chatId, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Send message and handle SSE stream
  const sendMessage = async (content: string, userMessage: Message) => {
    const res = await fetch(`${API_URL}/api/chat/${chatId}/`, {
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

    // Initialize streaming message
    setStreamingMessage({
      id: `streaming-${Date.now()}`,
      role: "assistant",
      content: "",
      sources: [],
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: ")) continue;
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);

              if (parsed.type === "source" && parsed.value) {
                collectedSources.push(parsed.value);
              }

              if (parsed.type === "text-delta" && parsed.value?.delta) {
                assistantContent += parsed.value.delta;
                setStreamingMessage((prev) =>
                  prev
                    ? {
                        ...prev,
                        content: assistantContent,
                        sources: [...collectedSources],
                      }
                    : null
                );
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

    // Streaming complete - subscription will update with final messages
    setStreamingMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    // Add user message to local state
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      await sendMessage(question, userMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  const resetChat = () => {
    router.push("/chat");
  };

  if (authLoading || subLoading) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <a
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
          </a>

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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetChat}
            className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted transition-colors"
          >
            New Chat
          </button>

          {user && (
            <div className="hidden sm:flex items-center gap-3 border-l border-border pl-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">{user.username}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {user.messages_used_today}/{user.daily_message_quota}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                        user.subscription_type === "premium"
                          ? "bg-chart-4/10 text-chart-4"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.subscription_type}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          <ModeToggle />
          <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <Settings className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground md:hidden">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar />

        <div className="flex-1 flex flex-col relative bg-background/50">
          {/* Disclaimer Banner */}
          <div className="bg-chart-4/5 border-b border-chart-4/10 px-6 py-2.5 flex items-center justify-center gap-2 text-[11px] font-semibold text-chart-4/80">
            <ShieldCheck className="h-3 w-3" />
            <span>
              AI powered by official DPIRD 2025 guidelines. Always verify local
              signs.
            </span>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLoading={false}
              />
            ))}

            {/* Streaming message */}
            {streamingMessage && (
              <ChatMessage
                key={streamingMessage.id}
                message={streamingMessage}
                isLoading={true}
              />
            )}

            {/* Loading indicator when waiting for response */}
            {isLoading &&
              !streamingMessage &&
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
        </div>
      </div>
    </div>
  );
}
