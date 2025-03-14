"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SmartHeader } from "@/components/auth/smart-header";
import { Message as MessageComponent } from "@/components/chat/message";
import { CitationDialog } from "@/components/chat/citation-dialog";
import { useChat } from "@/hooks/useChat";
import { Citation } from "@/lib/types";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { isAuthenticated } = useAuthContext();
  const [newMessage, setNewMessage] = useState("");
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage } = useChat(chatId);

  // Submit message when first loading the chat
  useEffect(() => {
    const message = sessionStorage.getItem("question");
    sessionStorage.removeItem("question");
    sendMessage(message || "");
    setNewMessage("");
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  // Handle citation click
  const handleCitationClick = (citationIndex: number, citations: any[]) => {
    if (citationIndex >= 0 && citationIndex < citations.length) {
      setSelectedCitation(citations[citationIndex]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="h-screen flex flex-col border-0 rounded-none">
        <SmartHeader />

        <CardContent className="flex-1 p-4 overflow-auto">
          <ScrollArea className="h-full pr-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  {isAuthenticated
                    ? "No messages yet in this conversation."
                    : "Start a conversation by sending a message below"}
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <MessageComponent
                    key={message.id}
                    {...message}
                    onCitationClick={handleCitationClick}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {error && (
          <div className="px-4 py-2 bg-destructive/20 text-destructive text-center">
            Error: {typeof error === "string" ? error : "An error occurred"}
          </div>
        )}

        <CardFooter className="border-t p-4 gap-2 bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isLoading}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              variant="default"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardFooter>
      </Card>

      <CitationDialog
        citation={selectedCitation}
        open={selectedCitation !== null}
        onOpenChange={(open) => !open && setSelectedCitation(null)}
      />
    </div>
  );
}
