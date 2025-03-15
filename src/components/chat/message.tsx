"use client";

import React from "react";
import {cn} from "@/lib/utils";
import {Avatar} from "@/components/ui/avatar";
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Message, Citation} from "@/lib/types";

interface MessageProps extends Message {
  onCitationClick: (index: number, citations: Citation[]) => void;
}

// Function to parse citation references and render as numbered links
const parseCitationReferences = (
  content: string,
  citations: Citation[]
) => {
  if (!citations || citations.length === 0) return content;

  // Create a map to track citation indices for correct numbering
  const citationMap = new Map();
  let nextCitationNumber = 1;

  // Replace [citation:X] with clickable numbered references
  return content.replace(/\[citation:(\d+)]/g, (match, index) => {
    const citationIndex = parseInt(index, 10);
    if (citationIndex >= 0 && citationIndex < citations.length) {
      // Check if we've seen this citation before
      if (!citationMap.has(citationIndex)) {
        citationMap.set(citationIndex, nextCitationNumber++);
      }
      const citationNumber = citationMap.get(citationIndex);

      return `<button class="citation-link inline-flex items-center justify-center min-h-[0.5rem] min-w-[0.5rem] px-1 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-sm shadow-sm transition-colors duration-150 ease-in-out mx-0.5 data-[active='true']:bg-primary/30" data-index="${citationIndex}">${citationNumber}</button>`;
    }
    return match;
  });
};

export const MessageBubble: React.FC<MessageProps> = ({
                                                        content,
                                                        type,
                                                        timestamp,
                                                        citations,
                                                        onCitationClick,
                                                      }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={cn(
      "flex gap-3 mb-4 group",
      type === "user" ? "justify-end" : "justify-start"
    )}>
      {type === "assistant" && (
        <Avatar className="h-8 w-8 bg-primary/50 text-primary-foreground flex items-center justify-center mt-1">
          <span className="text-xs">AI</span>
        </Avatar>
      )}

      <div className="flex flex-col max-w-[80%]">
        <Card className={cn(
          "px-4 py-3 shadow-sm",
          type === "user"
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
            : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
        )}>
          {type === "assistant" && citations ? (
            <div
              className="prose dark:prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: parseCitationReferences(
                  content,
                  citations
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
            <div className="whitespace-pre-wrap text-sm">{content}</div>
          )}
        </Card>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {formattedTime}
          </span>

          {citations && citations.length > 0 && type === "assistant" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline"
                         className="text-xs py-0 h-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {citations.length} {citations.length === 1 ? 'source' : 'sources'}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Click on citation numbers to view sources</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {type === "user" && (
        <Avatar className="h-8 w-8 bg-blue-500 text-white flex items-center justify-center mt-1">
          <span className="text-xs">You</span>
        </Avatar>
      )}
    </div>
  );
};