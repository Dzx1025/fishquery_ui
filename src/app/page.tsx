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

  const recommendedQuestions: string[] = [
    "What is the boat limit for Western rock lobsters?",
    "What should I do if I catch an undersized fish?",
    "How should I measure a fish correctly?",
    "What licence exemptions apply to Aboriginal fishers?",
    "Is there a daily bag limit for southern garfish?",
    "What is shark depredation and how can it be mitigated?",
    "What is the purpose of using a release weight?",
    "Do I need a fishing licence to fish from a boat?",
    "What are the bag limits for demersal scalefish in the West Coast bioregion?",
    "Can I continue fishing once I’ve reached my daily bag limit?",
  ];

  const [visibleQuestions, setVisibleQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Randomly select 3 or 4 questions to display
    const pool = [...recommendedQuestions];
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const count = Math.min(pool.length, Math.random() < 0.5 ? 3 : 4);
    setVisibleQuestions(pool.slice(0, count));
  }, []);

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

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const fingerprint = localStorage.getItem('browserFingerprint') || '';

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Browser-Fingerprint": fingerprint,
        },
        body: JSON.stringify({message: text}),
        credentials: "include",
      });

      if (response.ok) {
        if (isAuthenticated) {
          await refetch();
        }
        sessionStorage.setItem("question", text);
        const data = await response.json();
        router.push("/chat/" + data.chat_id);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(message);
  };

  const handleSuggestionClick = async (q: string) => {
    // Let the question clicked show up in the textarea
    setMessage(q);
    await sendMessage(q);
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

                {/* Recommended questions section (random 3-4) */}
                <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2">
                  {visibleQuestions.map((q) => (
                    <Button
                      key={q}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSuggestionClick(q)}
                      disabled={sending}
                      className="rounded-full"
                    >
                      {q}
                    </Button>
                  ))}
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
