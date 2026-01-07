"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSubscription } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { DisclaimerBanner } from "@/components/chat/disclaimer-banner";
import { LoadingIndicator } from "@/components/chat/loading-indicator";
import { ErrorModal } from "@/components/chat/error-modal";
import { Message, Source } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";
import { SUBSCRIBE_TO_MESSAGES } from "@/lib/graphql";

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
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] =
    React.useState<Message | null>(null);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const initialSentRef = React.useRef(false);
  const localMessagesRef = React.useRef<Message[]>([]);

  const { data: subData, loading: subLoading } =
    useSubscription<SubscriptionData>(SUBSCRIBE_TO_MESSAGES, {
      variables: { chatId },
      skip: !chatId || !isAuthenticated,
    });

  // Update messages from subscription
  React.useEffect(() => {
    if (
      isAuthenticated &&
      subData?.chats_message &&
      !isLoading &&
      !streamingMessage
    ) {
      const subMessageCount = subData.chats_message.length;
      const localMessageCount = localMessagesRef.current.length;

      if (subMessageCount >= localMessageCount) {
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
          }),
        );
        setMessages(formattedMessages);
        localMessagesRef.current = formattedMessages;
      }
    }
  }, [subData, isLoading, isAuthenticated, streamingMessage]);

  // Scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Handle initial question
  React.useEffect(() => {
    if (initialQuestion && !initialSentRef.current) {
      initialSentRef.current = true;
      router.replace(`/chat/${chatId}`, { scroll: false });

      const sendInitialQuestion = async () => {
        setIsLoading(true);
        abortControllerRef.current = new AbortController();

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
        localMessagesRef.current = [userMessage];

        try {
          await sendMessage(initialQuestion);
        } catch (error) {
          if (error instanceof Error && !error.message.includes("limit")) {
            console.error("Failed to send initial message:", error);
          }
        } finally {
          setIsLoading(false);
          abortControllerRef.current = null;
        }
      };

      sendInitialQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion, chatId, router]);

  const sendMessage = async (content: string) => {
    setError(null);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/chat/${chatId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Stream-Protocol": "ai-sdk",
        },
        body: JSON.stringify({ message: content }),
        credentials: "include",
        signal: abortControllerRef.current?.signal,
      },
    );

    if (!res.ok) {
      try {
        const errorData = await res.json();
        if (errorData.error) {
          setError(errorData.error);
          throw new Error(errorData.error);
        }
      } catch (parseError) {
        if (
          parseError instanceof Error &&
          parseError.message !== "Failed to send message"
        ) {
          throw parseError;
        }
      }
      throw new Error("Failed to send message");
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let assistantContent = "";
    const collectedSources: Source[] = [];

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
                    : null,
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

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: assistantContent,
      sources: collectedSources,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => {
      const newMessages = [...prev, assistantMessage];
      localMessagesRef.current = newMessages;
      return newMessages;
    });
    setStreamingMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      localMessagesRef.current = newMessages;
      return newMessages;
    });

    try {
      await sendMessage(question);
    } catch (error) {
      if (error instanceof Error && !error.message.includes("limit")) {
        console.error("Failed to send message:", error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (error) setError(null);
  };

  if (authLoading || (isAuthenticated && subLoading)) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <ChatLayout
      onNewChat={() => router.push("/chat")}
      isLoading={isLoading}
      showStatus
    >
      <ErrorModal
        show={!!error}
        message={error || ""}
        onClose={() => setError(null)}
      />

      <DisclaimerBanner />

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} isLoading={false} />
        ))}

        {streamingMessage && (
          <ChatMessage
            key={streamingMessage.id}
            message={streamingMessage}
            isLoading={true}
          />
        )}

        {isLoading &&
          !streamingMessage &&
          messages[messages.length - 1]?.role === "user" && (
            <LoadingIndicator />
          )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onStop={handleStop}
        isLoading={isLoading}
      />
    </ChatLayout>
  );
}
