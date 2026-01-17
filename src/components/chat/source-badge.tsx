"use client";

import * as React from "react";
import { Source } from "@/types/chat";
import { SourceModal } from "./source-modal";

export function SourceBadge({
  source,
  index,
}: {
  source: Source;
  index: number;
}) {
  const [showPopover, setShowPopover] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const displayIndex = source.document?.index ?? index;

  return (
    <>
      <span className="relative inline-block">
        <button
          className="inline-flex items-center px-2 py-1 rounded-md bg-muted/50 text-[10px] text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
          onClick={() => setShowModal(true)}
        >
          [{displayIndex}] {source.title}
        </button>
        {showPopover && !showModal && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl z-50 text-sm animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
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
