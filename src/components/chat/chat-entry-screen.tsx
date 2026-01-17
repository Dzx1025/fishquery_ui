"use client";

import * as React from "react";
import Image from "next/image";
import { UserCircle, LogIn, ChevronRight } from "lucide-react";

export function ChatEntryScreen({
  onSelectMode,
}: {
  onSelectMode: (mode: "anonymous" | "login") => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20 overflow-hidden">
            <Image
              src="/favicon.ico"
              alt="FQ"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Start Chatting</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Ask questions about Western Australia&apos;s recreational fishing
            rules, size limits, and species identification.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelectMode("anonymous")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all group"
          >
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <UserCircle className="h-6 w-6" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold">Continue as Guest</div>
              <div className="text-sm text-muted-foreground">
                No account needed. Chat history saved locally.
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          <button
            onClick={() => onSelectMode("login")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all group"
          >
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <LogIn className="h-6 w-6" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold">Log in</div>
              <div className="text-sm text-muted-foreground">
                Sync history across devices.
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest">
          Powered by official DPIRD guidelines
        </p>
      </div>
    </div>
  );
}
