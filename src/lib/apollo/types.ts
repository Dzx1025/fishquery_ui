// lib/apollo/types.ts
export interface DBChat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DBMessage {
  content: string;
  created_at: string;
  message_type: "user" | "assistant";
}

export interface GetChatListResponse {
  chats_chat: DBChat[];
}

export interface RenameChatResponse {
  update_chats_chat_by_pk: {
    id: string;
    title: string;
  };
}

export interface RenameChatVariables {
  id: string;
  newTitle: string;
}

export interface SubMessageListResponse {
  chats_message: DBMessage[];
}

export interface SubMessageListVariables {
  chatId: string;
}
