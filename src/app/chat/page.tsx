"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatEntryScreen } from "@/components/chat/chat-entry-screen";
import { InitialQuestionScreen } from "@/components/chat/initial-question-screen";
import { ErrorModal } from "@/components/chat/error-modal";
import { useAuth } from "@/hooks/useAuth";
import { useFingerprint } from "@/hooks/useFingerprint";

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { fingerprint } = useFingerprint();
  const [accessMode, setAccessMode] = React.useState<
    "anonymous" | "login" | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorModal, setErrorModal] = React.useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  // Auto-set access mode for logged-in users
  React.useEffect(() => {
    if (user) {
      setAccessMode("login");
    }
  }, [user]);

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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add fingerprint header for anonymous users
    if (accessMode === "anonymous" && fingerprint) {
      headers["X-Browser-Fingerprint"] = fingerprint;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/chat/`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ message }),
        credentials: "include",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      if (data.error) {
        throw new Error(data.error);
      }
      throw new Error("Failed to create chat session");
    }

    return data.chat_id;
  };

  // Handle first question from initial screen
  const handleFirstQuestion = async (question: string) => {
    setIsLoading(true);

    try {
      const newChatId = await createChatSession(question);
      router.push(`/chat/${newChatId}?q=${encodeURIComponent(question)}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
      if (error instanceof Error) {
        setErrorModal({ show: true, message: error.message });
      } else {
        setErrorModal({
          show: true,
          message: "Failed to start chat. Please try again.",
        });
      }
      setIsLoading(false);
    }
  };

  const showEntryScreen = !accessMode && !user;
  const showInitialQuestion = accessMode || user;

  return (
    <ChatLayout onNewChat={() => setAccessMode(null)} showStatus={false}>
      <ErrorModal
        show={errorModal.show}
        message={errorModal.message}
        onClose={() => setErrorModal({ show: false, message: "" })}
      />

      {showEntryScreen && <ChatEntryScreen onSelectMode={handleModeSelect} />}

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
    </ChatLayout>
  );
}
