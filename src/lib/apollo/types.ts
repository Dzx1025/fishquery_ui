// lib/apollo/types.ts
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  content: string;
  created_at: string;
  message_type: string;
}

export interface GetChatListResponse {
  chats_chat: Chat[];
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
  chats_message: Message[];
}

export interface SubMessageListVariables {
  chatId: string;
}
