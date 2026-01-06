"use client";

import * as React from "react";
import { Source } from "@/types/chat";
import { SourceModal } from "./source-modal";

interface CitationPart {
  type: "text" | "citation";
  content: string;
  source?: Source;
}

function parseCitations(text: string, sources: Source[]): CitationPart[] {
  const parts: CitationPart[] = [];
  const regex = /\[citation:(\d+)\]/g;
  let lastIndex = 0;
  let match;

  const sourceMap = new Map<number, Source>();
  sources.forEach((s, idx) => {
    // Use document.index if available, otherwise use array index
    const index = s.document?.index ?? idx;
    sourceMap.set(index, s);
  });

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    const sourceIndex = parseInt(match[1]);
    const source = sourceMap.get(sourceIndex);
    parts.push({
      type: "citation",
      content: `[${sourceIndex}]`,
      source,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}

function CitationLink({ source, label }: { source?: Source; label: string }) {
  const [showPopover, setShowPopover] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  if (!source) {
    return <span className="text-muted-foreground">{label}</span>;
  }

  return (
    <>
      <span className="relative inline-block">
        <button
          className="text-primary hover:text-primary/80 font-semibold cursor-pointer hover:underline underline-offset-2"
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
          onClick={() => setShowModal(true)}
        >
          {label}
        </button>
        {showPopover && !showModal && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-card border border-border rounded-xl shadow-xl z-50 text-sm animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
            <div className="font-bold text-foreground mb-1 text-xs">
              {source.title}
            </div>
            <div className="text-muted-foreground line-clamp-3 text-[11px] leading-relaxed">
              {source.document?.content || "No content available"}
            </div>
            <div className="mt-2 text-[10px] text-primary font-medium">
              Click to view full source
            </div>
          </div>
        )}
      </span>
      {showModal && (
        <SourceModal source={source} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export function MessageContent({
  content,
  sources,
}: {
  content: string;
  sources: Source[];
}) {
  const parts = React.useMemo(
    () => parseCitations(content, sources),
    [content, sources]
  );

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) =>
        part.type === "citation" ? (
          <CitationLink key={i} source={part.source} label={part.content} />
        ) : (
          <span key={i}>{part.content}</span>
        )
      )}
    </div>
  );
}
