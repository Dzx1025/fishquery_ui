"use client";

import {useState, useRef, useEffect} from "react";
import {useParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SmartHeader} from "@/components/auth/smart-header";
import {Message as MessageComponent} from "@/components/chat/message";
import {CitationDialog} from "@/components/chat/citation-dialog";
import {useChat} from "@/hooks/useChat";
import {Citation} from "@/lib/types";
import {useAuthContext} from "@/contexts/AuthContext";
import {Send} from "lucide-react";
import {cn} from "@/lib/utils";

export default function ChatPage() {
  const {chatId} = useParams<{ chatId: string }>();
  const {isAuthenticated} = useAuthContext();
  const [newMessage, setNewMessage] = useState("");
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {messages, isLoading, error, sendMessage} = useChat(chatId);

  // Submit message when first loading the chat
  useEffect(() => {
    const message = sessionStorage.getItem("question");
    sessionStorage.removeItem("question");
    if (message) {
      sendMessage(message);
    }
    setNewMessage("");
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
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
    <div
      className={cn("flex flex-col  bg-background rounded-xl overflow-hidden border shadow-sm", isAuthenticated ? "h-full" : "min-h-screen")}>
      <SmartHeader/>

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] lg:h-[calc(100vh-10rem)]">
          <div className="px-4 pt-4">
            {messages.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  {isAuthenticated
                    ? "No messages yet in this conversation."
                    : "Start a conversation by sending a message below"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageComponent
                    key={message.id}
                    {...message}
                    onCitationClick={handleCitationClick}
                  />
                ))}
                <div ref={messagesEndRef} className="h-4"/>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {error && (
        <div className="px-4 py-2 bg-destructive/20 text-destructive text-center">
          Error: {typeof error === "string" ? error : "An error occurred"}
        </div>
      )}

      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message here..."
            className="flex-1 rounded-full"
          />
          <Button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            variant="default"
            size="icon"
            className="rounded-full h-10 w-10 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
            ) : (
              <Send className="h-4 w-4"/>
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>

      <CitationDialog
        citation={selectedCitation}
        open={selectedCitation !== null}
        onOpenChange={(open) => !open && setSelectedCitation(null)}
      />
    </div>
  );
}