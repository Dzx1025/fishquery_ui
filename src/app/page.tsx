"use client";

import React, {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
// removed Card wrappers in favor of a simpler form container
import {SmartHeader} from "@/components/auth/smart-header";
import {useRouter} from "next/navigation";
import {useChatList} from "@/hooks/use-chat";
import {useAuthContext} from "@/contexts/auth-context";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Send, Loader2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

// Provide a stable, module-level questions list to avoid useEffect deps noise
const RECOMMENDED_QUESTIONS: string[] = [
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

export default function Home() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const {isAuthenticated, user} = useAuthContext();
  const {refetch} = useChatList(user?.id);

  // Recommended questions shown below the textarea
  const [visibleQuestions, setVisibleQuestions] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustTextareaHeight = (el: HTMLTextAreaElement) => {
    const maxPx = 240; // ~max-h-60
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxPx);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxPx ? "auto" : "hidden";
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [message]);

  useEffect(() => {
    // Randomly select 3 or 4 questions to display
    const pool = [...RECOMMENDED_QUESTIONS];
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const count = Math.min(pool.length, Math.random() < 0.5 ? 3 : 4);
    setVisibleQuestions(pool.slice(0, count));
  }, [setVisibleQuestions]);

  // Generate a browser fingerprint when the component mounts
  useEffect(() => {
    const fingerprintKey = 'browserFingerprint';

    // Check if the fingerprint already exists
    if (typeof window !== 'undefined' && localStorage.getItem(fingerprintKey)) {
      return;
    }

    FingerprintJS.load()
      .then(fp => fp.get())
      .then(result => {
        const visitorId = result.visitorId;
        localStorage.setItem(fingerprintKey, visitorId);
      })
      .catch(() => {
        // noop
      });
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const fingerprint = typeof window !== 'undefined' ? (localStorage.getItem('browserFingerprint') || '') : '';

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
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("question", text);
        }
        const data = await response.json();
        router.push("/chat/" + data.chat_id);
      }
    } catch {
      // noop
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(message);
  };

  const handleSuggestionClick = async (q: string) => {
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

          {/* Simplified: remove Card and CardContent; keep a lean form container */}
          <form onSubmit={handleSend} className="w-full animate-fadeIn">
            <div className="px-6 py-4">
              <div
                className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden transition-all focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/25">
                {/* Textarea */}
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask anything..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (textareaRef.current) adjustTextareaHeight(textareaRef.current);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        if (!sending && message.trim()) {
                          sendMessage(message);
                        }
                      }
                    }}
                    className="min-h-36 max-h-60 overflow-y-auto text-lg md:text-xl p-4 pr-16 sm:pr-20 border-0 bg-transparent shadow-none focus:ring-0 resize-none placeholder:text-muted-foreground/60 placeholder:text-base md:placeholder:text-lg"
                    disabled={sending}
                    autoFocus
                    style={{caretColor: "var(--primary)"}}
                  />
                  {/* Subtle gradient background when typing */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent transition-opacity duration-700 ${
                      message ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Inline Send button inside the textarea area */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="submit"
                          size="icon"
                          disabled={!message.trim() || sending}
                          aria-label="Send message"
                          className="rounded-full shadow-md size-11 md:size-9"
                        >
                          {sending ? (
                            <Loader2 className="size-4 animate-spin"/>
                          ) : (
                            <Send className="size-4"/>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>Send（⌘/Ctrl+Enter）</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Questions horizontal strip (no label) */}
                <div className="relative border-t border-border/50 recommend-strip">
                  {/* Fade edges */}
                  <div
                    className="pointer-events-none absolute inset-y-2 left-2 w-6 bg-gradient-to-r from-card to-transparent z-0"/>
                  <div
                    className="pointer-events-none absolute inset-y-2 right-2 w-6 bg-gradient-to-l from-card to-transparent z-0"/>

                  <ScrollArea className="relative z-10 w-full" role="region" aria-label="Recommended questions">
                    <div className="flex w-max items-stretch gap-2 p-2 pl-4 pr-6">
                      {visibleQuestions.map((q) => (
                        <Button
                          key={q}
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSuggestionClick(q)}
                          disabled={sending}
                          aria-label={q}
                          className="snap-start shrink-0 rounded-full min-h-11 min-w-[12rem] sm:min-w-[14rem] md:min-w-[16rem] py-2 px-3 font-medium text-left text-sm md:text-base leading-relaxed break-words transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          <div className="flex items-center gap-2">
                            <span aria-hidden className="inline-block size-1.5 rounded-full bg-primary/50 shrink-0"/>
                            <span className="text-left whitespace-normal break-words">{q}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </form>
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

          /* Horizontal snap scroll for questions strip */
          .recommend-strip [data-slot="scroll-area-viewport"] {
              scroll-snap-type: x mandatory;
              overscroll-behavior-x: contain;
              -webkit-overflow-scrolling: touch;
          }
      `}</style>
    </>
  );
}