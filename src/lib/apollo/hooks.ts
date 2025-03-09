// lib/hooks/useChat.ts
"use client";

import { useQuery, useMutation, useSubscription } from "@apollo/client";
import {
  DELETE_CHAT,
  GET_CHAT_LIST,
  RENAME_CHAT,
  SUBSCRIBE_TO_MESSAGES,
} from "@/lib/apollo/operations";
import { Chat, Message } from "@/lib/apollo/types";

// Hook for fetching chat list
export function useChatList() {
  const { data, loading, error, refetch } = useQuery(GET_CHAT_LIST);
  return {
    chats: (data?.chats_chat as Chat[]) || [],
    loading,
    error,
    refetch,
  };
}

// Hook for renaming a chat
export function useRenameChat() {
  const [renameChatMutation, { loading, error }] = useMutation(RENAME_CHAT);

  const renameChat = async (id: string, newTitle: string) => {
    try {
      const result = await renameChatMutation({
        variables: { id, newTitle },
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
  const [deleteChatMutation, { loading, error }] = useMutation(DELETE_CHAT);

  const deleteChat = async (id: string) => {
    try {
      const result = await deleteChatMutation({
        variables: { id },
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
  const { data, loading, error } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
  });

  return {
    messages: (data?.chats_message as Message[]) || [],
    loading,
    error,
  };
}
