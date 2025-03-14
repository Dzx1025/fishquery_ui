"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Citation } from "@/lib/types";
import { extractFilename } from "@/lib/utils";

interface CitationDialogProps {
  citation: Citation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CitationDialog: React.FC<CitationDialogProps> = ({
  citation,
  open,
  onOpenChange,
}) => {
  if (!citation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Citation Details</DialogTitle>
          <DialogDescription>
            Source information and referenced content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-medium">Source Information</h3>
            <div className="text-sm rounded-md bg-muted p-4">
              <p>
                <span className="font-semibold">Source:</span>{" "}
                {extractFilename(citation.metadata.source)}
              </p>
              <p>
                <span className="font-semibold">Page:</span>{" "}
                {citation.metadata.page} of {citation.metadata.total_pages}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="font-medium">Content</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="whitespace-pre-wrap">{citation.page_content}</div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
