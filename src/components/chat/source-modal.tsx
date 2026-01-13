"use client";

import * as React from "react";
import { Source } from "@/types/chat";

export function SourceModal({
  source,
  onClose,
}: {
  source: Source;
  onClose: () => void;
}) {
  // Close on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {source.document?.index ?? "?"}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">
                {source.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Content
          </div>
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-xl p-4 border border-border/50 font-mono">
            {source.document?.content || "No content available"}
          </div>

          {source.document?.metadata && (
            <div className="mt-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Source Details
              </div>
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50 space-y-3">
                {/* Source/Document Name */}
                {Boolean(source.document.metadata.source) && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-muted-foreground">
                      Document:
                    </span>
                    <span className="text-foreground font-medium">
                      {String(source.document.metadata.source).split("/").pop()}
                    </span>
                  </div>
                )}

                {/* Page Information */}
                {(source.document.metadata.page !== undefined ||
                  source.document.metadata.total_pages !== undefined) && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-muted-foreground">
                      Page:
                    </span>
                    <span className="text-foreground font-mono">
                      {source.document.metadata.page !== undefined
                        ? `${Number(source.document.metadata.page) + 1}`
                        : "?"}
                      {source.document.metadata.total_pages !== undefined && (
                        <span className="text-muted-foreground">
                          {" "}
                          of {String(source.document.metadata.total_pages)}
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {/* Other Metadata (excluding already displayed fields) */}
                {Object.entries(source.document.metadata)
                  .filter(
                    ([key]) =>
                      !["source", "page", "total_pages", "chunk"].includes(key),
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-xs">
                      <span className="font-bold text-muted-foreground capitalize min-w-[80px]">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="text-foreground break-all">
                        {String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
          {/* Open Source Link */}
          {Boolean(source.document?.metadata?.source) && (
            <a
              href={`${String(source.document.metadata.source)}${source.document.metadata.page !== undefined ? `#page=${Number(source.document.metadata.page) + 1}` : ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Open Source
            </a>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
