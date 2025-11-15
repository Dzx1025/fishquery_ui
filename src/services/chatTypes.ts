export type Citation = {
  page_content: string;
  metadata: {
    page: number;
    chunk: number;
    total_pages: number;
    source: string;
  };
};

export type Message = {
  id: string;
  content: string;
  type: "user" | "assistant";
  timestamp: string;
  citations?: Citation[];
};