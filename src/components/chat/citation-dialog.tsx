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
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";
import {Citation} from "@/services/chatTypes";
import {extractFilename} from "@/lib/utils";
import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {FileText, Info, Book} from "lucide-react";

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

  const filename = extractFilename(citation.metadata.source);
  const fileExtension = filename.split('.').pop()?.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary"/>
            <DialogTitle>Citation Source</DialogTitle>
          </div>
          <DialogDescription>
            Reference information and extracted content
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="metadata">Source Info</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="mt-0">
            <div className="px-6 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-4 w-4 text-muted-foreground"/>
                <h3 className="text-sm font-medium">Referenced Content</h3>
              </div>
              <Card className="border bg-muted/40">
                <ScrollArea className="h-[280px] w-full rounded-md">
                  <CardContent className="p-4">
                    <div className="whitespace-pre-wrap text-sm">{citation.page_content}</div>
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-0">
            <div className="px-6 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-muted-foreground"/>
                <h3 className="text-sm font-medium">Document Details</h3>
              </div>
              <Card>
                <CardContent className="p-4 grid gap-3">
                  <div className="grid grid-cols-3 gap-1 items-center">
                    <span className="text-xs font-medium text-muted-foreground">Document</span>
                    <div className="col-span-2 flex items-center gap-2">
                      <Badge variant="outline" className="font-normal">
                        {fileExtension || 'doc'}
                      </Badge>
                      <span className="text-sm font-medium truncate">{filename}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 items-center">
                    <span className="text-xs font-medium text-muted-foreground">Page</span>
                    <span className="col-span-2 text-sm">
                      {citation.metadata.page} of {citation.metadata.total_pages}
                    </span>
                  </div>

                  {/*{citation.metadata.author && (*/}
                  {/*  <div className="grid grid-cols-3 gap-1 items-center">*/}
                  {/*    <span className="text-xs font-medium text-muted-foreground">Author</span>*/}
                  {/*    <span className="col-span-2 text-sm">{citation.metadata.author}</span>*/}
                  {/*  </div>*/}
                  {/*)}*/}

                  {/*{citation.metadata.date && (*/}
                  {/*  <div className="grid grid-cols-3 gap-1 items-center">*/}
                  {/*    <span className="text-xs font-medium text-muted-foreground">Date</span>*/}
                  {/*    <span className="col-span-2 text-sm">{citation.metadata.date}</span>*/}
                  {/*  </div>*/}
                  {/*)}*/}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t">
          {/*{citation.metadata.url && (*/}
          {/*  <Button variant="outline" className="mr-auto gap-1" asChild>*/}
          {/*    <a href={citation.metadata.url} target="_blank" rel="noopener noreferrer">*/}
          {/*      <ExternalLink className="h-4 w-4"/>*/}
          {/*      <span>Open Source</span>*/}
          {/*    </a>*/}
          {/*  </Button>*/}
          {/*)}*/}
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};