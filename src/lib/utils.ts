import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Process multiple 0: prefixed chunks into a single coherent message
export function processMessageChunks(chunks: string[]): string {
  let fullMessage = "";

  for (const chunk of chunks) {
    // Extract content between quotes, removing the 0:" prefix and ending "
    if (chunk.startsWith('0:"') && chunk.endsWith('"')) {
      fullMessage += chunk.substring(3, chunk.length - 1);
    }
  }

  return fullMessage;
}

// Extract citations from LLM response
export function extractCitations(content: string): any[] | null {
  try {
    // Check for citation format
    if (content.includes("__LLM_RESPONSE__")) {
      const citationPart = content.split("__LLM_RESPONSE__")[0];
      // Remove the leading 0:" and trailing " from the JSON string
      const jsonStr = citationPart.substring(3, citationPart.length);
      const citationData = JSON.parse(jsonStr);

      if (citationData && citationData.context) {
        return citationData.context;
      }
    }
  } catch (err) {
    console.error("Error parsing citation data:", err);
  }

  return null;
}

// Extract filename from path
export function extractFilename(path: string): string {
  if (!path) return "Unknown";
  const parts = path.split("/");
  return parts[parts.length - 1];
}
