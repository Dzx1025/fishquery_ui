"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { SmartHeader } from "@/components/auth/smart-header";

export default function Home() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  return (
    <>
      <SmartHeader />

      <div className="container flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>New Conversation</CardTitle>
            <CardDescription>
              Start a new conversation with the AI assistant
            </CardDescription>
          </CardHeader>
          <form>
            <CardContent>
              <Textarea
                placeholder="Type your question here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32 resize-none"
                disabled={sending}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={!message.trim() || sending}>
                {sending ? "Sending..." : "Send"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
