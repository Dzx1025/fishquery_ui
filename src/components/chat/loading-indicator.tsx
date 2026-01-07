"use client";

import Image from "next/image";

export function LoadingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-border/50">
        <Image
          src="/assistant-avatar.png"
          alt="Assistant"
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-none px-5 py-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
