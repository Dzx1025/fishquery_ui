"use client";

import {useQuery, useMutation, useSubscription} from "@apollo/client";
import {
  DELETE_CHAT,
  GET_CHAT_LIST,
  RENAME_CHAT,
  SUBSCRIBE_TO_MESSAGES,
} from "@/lib/apollo/operations";
import {DBChat, DBMessage} from "@/lib/apollo/types";
import {useState, useEffect, useCallback, useMemo} from "react";
import {Message, Citation} from "@/lib/types";
import {processMessageChunks, extractCitations} from "@/lib/utils";
import {useAuthContext} from "@/contexts/AuthContext";

// Hook for fetching chat list
export function useChatList(userId?: number) {
  const {data, loading, error, refetch} = useQuery(GET_CHAT_LIST, {
    variables: {userId},
  });
  return {
    chats: (data?.chats_chat as DBChat[]) || [],
    loading,
    error,
    refetch,
  };
}

// Hook for renaming a chat
export function useRenameChat() {
  const [renameChatMutation, {loading, error}] = useMutation(RENAME_CHAT);

  const renameChat = async (id: string, newTitle: string) => {
    try {
      const result = await renameChatMutation({
        variables: {id, newTitle},
      });
      return result.data.update_chats_chat_by_pk;
    } catch (err) {
      console.error("Error renaming chat:", err);
      throw err;
    }
  };

  return {
    renameChat,
    loading,
    error,
  };
}

// Hook for deleting a chat
export function useDeleteChat() {
  const [deleteChatMutation, {loading, error}] = useMutation(DELETE_CHAT);

  const deleteChat = async (id: string) => {
    try {
      const result = await deleteChatMutation({
        variables: {id},
      });
      return result.data.delete_chats_chat_by_pk;
    } catch (err) {
      console.error("Error deleting chat:", err);
      throw err;
    }
  };

  return {
    deleteChat,
    loading,
    error,
  };
}

// Hook for subscribing to messages
export function useMessageSubscription(chatId: string) {
  const {data, loading, error} = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: {chatId},
  });

  return {
    messages: (data?.chats_message as DBMessage[]) || [],
    loading,
    error,
  };
}

// Helper functions outside the component
function processDBContent(content: string): { processedContent: string; citations: Citation[] | undefined; } {
  let processedContent = content;
  let citations: Citation[] | undefined = undefined;

  try {
    // Check if content contains the special format
    if (content.includes("__LLM_RESPONSE__")) {
      // Split the content by the LLM marker
      const parts = content.split("__LLM_RESPONSE__");

      // First part contains citations
      if (parts.length > 1) {
        const citationPart = parts[0];

        // Extract the citation JSON (removing the 0:" prefix and trailing ")
        if (citationPart.startsWith('0:"')) {
          const jsonStr = citationPart.substring(3, citationPart.length);
          const citationData = JSON.parse(jsonStr);

          if (citationData && citationData.context) {
            citations = citationData.context;
          }
        }

        // Second part contains the actual message content
        // Need to process all the "0:" prefixed chunks
        const contentPart = parts[1];
        const contentChunks = contentPart.match(/0:"[^"]*"/g) || [];
        processedContent = processMessageChunks(contentChunks);
      }
    }
    // If no LLM_RESPONSE marker but still has "0:" prefixes
    else if (content.startsWith("0:")) {
      const contentChunks = content.match(/0:"[^"]*"/g) || [];
      processedContent = processMessageChunks(contentChunks);
    }
  } catch (err) {
    console.error("Error processing DB message content:", err);
    // If there's an error in processing, just return the original content
    processedContent = content;
  }

  return {processedContent, citations};
}

export function useChat(chatId: string) {
  // Authentication context
  const {isAuthenticated} = useAuthContext();

  // Local state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use subscription directly (NOT in useMemo)
  const subscriptionResult = useMessageSubscription(chatId);

  // Process subscription messages
  useEffect(() => {
    // Skip if user is not authenticated
    if (!isAuthenticated) {
      return;
    }

    // Skip if no subscription or no messages
    if (
      !subscriptionResult?.messages ||
      subscriptionResult.messages.length === 0
    ) {
      return;
    }

    // Process messages
    const convertedMessages = subscriptionResult.messages.map(
      (dbMsg: DBMessage) => {
        // Default values
        let processedContent = dbMsg.content;
        let citations: Citation[] | undefined = undefined;

        // Only process assistant messages with special format
        if (
          dbMsg.message_type === "assistant" &&
          (dbMsg.content.startsWith("0:") ||
            dbMsg.content.includes("__LLM_RESPONSE__"))
        ) {
          const result = processDBContent(dbMsg.content);
          processedContent = result.processedContent;
          citations = result.citations;
        }

        // Return the processed message
        return {
          id: dbMsg.created_at, // Using timestamp as ID
          content: processedContent,
          type: dbMsg.message_type,
          timestamp: dbMsg.created_at,
          citations: citations,
        };
      }
    );

    // Update the state
    setMessages(convertedMessages);
  }, [isAuthenticated, subscriptionResult?.messages]);

  // Send message function
  const sendMessage = useCallback(
    async (messageContent: string) => {
      if (!messageContent.trim()) return;

      // Handle messages for non-authenticated users
      if (!isAuthenticated) {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: messageContent,
          type: "user",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
      }

      setIsLoading(true);
      setError(null);

      try {
        // For non-authenticated users, prepare placeholder
        let assistantMessageId = "";
        if (!isAuthenticated) {
          assistantMessageId = Date.now().toString() + "-assistant";
          setMessages((prev) => [
            ...prev,
            {
              id: assistantMessageId,
              content: "",
              type: "assistant",
              timestamp: new Date().toISOString(),
            },
          ]);
        }

        // API request
        const response = await fetch(`/api/chat/${chatId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({message: messageContent}),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
        }

        // For authenticated users, we're done
        if (isAuthenticated) {
          setIsLoading(false);
          return;
        }

        // Process streaming for non-authenticated users
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get response reader");
        }

        // Stream handling
        const decoder = new TextDecoder();
        let buffer = "";
        let contentChunks: string[] = [];
        let citations: any[] = [];
        let hasCitations = false;

        while (true) {
          const {done, value} = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, {stream: true});
          buffer += chunk;

          let processedBuffer = "";
          const lines = buffer.split("\n\n");

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i];

            const eventType = line.match(/^event: (.+)$/m)?.[1];
            const data = line.match(/^data: (.+)$/m)?.[1];

            if (eventType && data) {
              try {
                if (eventType === "message") {
                  const parsedData = JSON.parse(data);

                  if (parsedData.content) {
                    if (parsedData.content.startsWith("0:")) {
                      contentChunks.push(parsedData.content);

                      if (
                        !hasCitations &&
                        parsedData.content.includes("__LLM_RESPONSE__")
                      ) {
                        const citationData = extractCitations(
                          parsedData.content
                        );
                        if (citationData) {
                          citations = citationData;
                          hasCitations = true;

                          setMessages((prev) =>
                            prev.map((msg) =>
                              msg.id === assistantMessageId
                                ? {...msg, citations}
                                : msg
                            )
                          );
                        }
                      } else if (
                        !parsedData.content.includes("__LLM_RESPONSE__")
                      ) {
                        const messageContent =
                          processMessageChunks(contentChunks);

                        setMessages((prev) =>
                          prev.map((msg) =>
                            msg.id === assistantMessageId
                              ? {...msg, content: messageContent}
                              : msg
                          )
                        );
                      }
                    } else if (!parsedData.content.startsWith("d:")) {
                      contentChunks.push(parsedData.content);

                      const messageContent = contentChunks.join("");
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === assistantMessageId
                            ? {...msg, content: messageContent}
                            : msg
                        )
                      );
                    }
                  }
                } else if (eventType === "error") {
                  const parsedData = JSON.parse(data);
                  setError(parsedData.error || "An error occurred");
                }
              } catch (err) {
                console.error("Error parsing SSE message:", err);
              }
            }

            processedBuffer += line + "\n\n";
          }

          buffer = buffer.slice(processedBuffer.length);
        }

        // Final message update with all processed content for non-authenticated users
        if (contentChunks.length > 0) {
          // Check if we have a citation at the beginning
          let messageContent = "";
          let citationContent = "";

          if (hasCitations) {
            // Find the split between citations and actual content
            for (const chunk of contentChunks) {
              if (chunk.includes("__LLM_RESPONSE__")) {
                const parts = chunk.split("__LLM_RESPONSE__");
                if (parts.length > 1) {
                  citationContent = parts[0];
                  messageContent += parts[1];
                }
              } else if (!chunk.startsWith("d:")) {
                messageContent += chunk;
              }
            }

            // Process the message content to extract text from 0: chunks
            const chunks = messageContent.match(/0:"[^"]*"/g) || [];
            messageContent = processMessageChunks(chunks);
          } else {
            // No citations, just process all content
            messageContent = processMessageChunks(contentChunks);
          }

          // Final update to the message
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {...msg, content: messageContent}
                : msg
            )
          );
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
        setIsLoading(false);
      }
    },
    [chatId, isAuthenticated]
  );

  // Calculate final loading state
  const finalIsLoading =
    isLoading || (isAuthenticated && subscriptionResult?.loading);

  // Calculate final error state
  const finalError =
    error || (isAuthenticated && subscriptionResult?.error) || null;

  // Return values
  return {
    messages,
    isLoading: finalIsLoading,
    error: finalError,
    sendMessage,
  };
}
