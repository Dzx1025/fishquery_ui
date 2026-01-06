export interface Source {
  type: "source";
  sourceType: "document";
  id: string;
  title: string;
  document: {
    content: string;
    metadata: Record<string, unknown>;
    score: number;
    index: number;
  };
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: string;
}

export interface CitationPart {
  type: "text" | "citation";
  content: string;
  source?: Source;
}
