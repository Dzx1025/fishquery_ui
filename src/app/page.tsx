"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {SmartHeader} from "@/components/auth/smart-header";
import {useRouter} from "next/navigation";
import {useChatList} from "@/hooks/useChat";
import {useAuthContext} from "@/contexts/AuthContext";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Home() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const {isAuthenticated, user} = useAuthContext();
  const {refetch} = useChatList(user?.id);

  // Generate a browser fingerprint when the component mounts
  useEffect(() => {
    const fingerprintKey = 'browserFingerprint';

    // Check if the fingerprint already exists
    if (localStorage.getItem(fingerprintKey)) {
      console.log('Fingerprint already exists:', localStorage.getItem(fingerprintKey));
      return;
    }

    FingerprintJS.load()
      .then(fp => fp.get())
      .then(result => {
        const visitorId = result.visitorId;
        localStorage.setItem(fingerprintKey, visitorId);
        console.log('Generated and stored fingerprint:', visitorId);
      })
      .catch(err => {
        console.error('Failed to generate fingerprint:', err);
      });
  }, []);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const fingerprint = localStorage.getItem('browserFingerprint') || '';

      const response = await fetch("/api/chat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Browser-Fingerprint": fingerprint,
        },
        body: JSON.stringify({message}),
        credentials: "include",
      });

      if (response.ok) {
        if (isAuthenticated) {
          await refetch();
        }
        sessionStorage.setItem("question", message);
        const data = await response.json();
        router.push("/chat/" + data.chat_id);
      }
    } catch (err) {
      console.log(err);
    }
    setSending(false);
  };

  return (
    <>
      <SmartHeader/>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Fish Query
            </h1>
          </div>

          <Card className="w-full p-0 border-0 shadow-md bg-card/70 backdrop-blur-sm mx-auto animate-fadeIn">
            <form onSubmit={handleSend} className="w-full">
              <CardContent className="p-0">
                <div className="relative">
                  <Textarea
                    placeholder="Ask anything..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-40 text-xl md:text-2xl p-6 border-0 dark:bg-muted/40 shadow-none focus:ring-0 resize-none rounded-b-none bg-transparent placeholder:text-muted-foreground/60 placeholder:text-xl md:placeholder:text-2xl transition-all duration-300 animate-textFocus"
                    disabled={sending}
                    autoFocus
                    style={{caretColor: "var(--primary)"}}
                  />
                  {/* Subtle gradient background that animates when typing */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none transition-opacity duration-700 ${
                      message ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex justify-end px-6 py-4 rounded-b-lg bg-muted/20">
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 font-medium transition-all duration-200 hover:shadow-md"
                  disabled={!message.trim() || sending}
                >
                  {sending ? "Sending..." : "Send"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>

      <style jsx global>{`
          @keyframes textFocus {
              0% {
                  opacity: 0.7;
              }
              100% {
                  opacity: 1;
              }
          }

          @keyframes fadeIn {
              from {
                  opacity: 0;
                  transform: translateY(10px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }

          textarea::placeholder {
              transition: opacity 0.3s;
          }

          textarea:focus::placeholder {
              opacity: 0.3;
          }
      `}</style>
    </>
  );
}
