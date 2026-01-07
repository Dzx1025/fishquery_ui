"use client";

import * as React from "react";
import { Send, Square } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStop?: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
  placeholder = "Ask FishQuery about WA fishing rules...",
}: ChatInputProps) {
  return (
    <div className="p-6 bg-linear-to-t from-background to-transparent">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto relative group">
        <div className="relative flex items-center rounded-[1.5rem] border border-border bg-card shadow-2xl transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50 overflow-hidden">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full py-4 pl-6 pr-24 bg-transparent text-sm focus:outline-none font-medium placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-1">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="p-2.5 rounded-xl bg-destructive text-destructive-foreground shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Square className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!value.trim()}
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
  );
}
