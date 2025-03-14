"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Citation } from "@/lib/types";

interface MessageProps {
  id: string;
  content: string;
  type: "user" | "assistant";
  timestamp: string;
  citations?: any[];
  onCitationClick: (index: number, citations: any[]) => void;
}

// Function to parse citation references and render as numbered links
const parseCitationReferences = (
  content: string,
  citations: any[] | undefined,
  onCitationClick: (index: number, citations: any[]) => void
) => {
  if (!citations || citations.length === 0) return content;

  // Create a map to track citation indices for correct numbering
  const citationMap = new Map();
  let nextCitationNumber = 1;

  // Replace [citation:X] with clickable numbered references
  const htmlContent = content.replace(/\[citation:(\d+)\]/g, (match, index) => {
    const citationIndex = parseInt(index, 10);
    if (citationIndex >= 0 && citationIndex < citations.length) {
      // Check if we've seen this citation before
      if (!citationMap.has(citationIndex)) {
        citationMap.set(citationIndex, nextCitationNumber++);
      }
      const citationNumber = citationMap.get(citationIndex);

      return `<button class="citation-link inline-flex items-center justify-center h-5 w-5 text-xs font-medium rounded-full  text-blue-800 hover:bg-blue-200  dark:text-blue-200 dark:hover:bg-blue-800" data-index="${citationIndex}">[${citationNumber}]</button>`;
    }
    return match;
  });

  return htmlContent;
};

export const Message: React.FC<MessageProps> = ({
  content,
  type,
  timestamp,
  citations,
  onCitationClick,
}) => {
  return (
    <div
      className={cn("flex", type === "user" ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          type === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {type === "assistant" && citations ? (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: parseCitationReferences(
                content,
                citations,
                onCitationClick
              ),
            }}
            onClick={(e) => {
              // Handle citation clicks
              const target = e.target as HTMLElement;
              if (target.classList.contains("citation-link")) {
                const index = parseInt(
                  target.getAttribute("data-index") || "0",
                  10
                );
                onCitationClick(index, citations);
              }
            }}
          />
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
        <div className="text-xs mt-1 opacity-70">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
