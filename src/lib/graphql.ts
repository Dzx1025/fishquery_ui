import { gql } from "@apollo/client";

// Types
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatListData {
  chats_chat: Chat[];
}

export interface ChatListVars {
  userId: number;
}

// Queries
export const GET_CHAT_LIST = gql`
  query Get_ChatList($userId: bigint) {
    chats_chat(where: { user_id: { _eq: $userId } }) {
      id
      title
      created_at
      updated_at
    }
  }
`;

// Mutations
export const RENAME_CHAT = gql`
  mutation Rename_Chat($id: uuid!, $newTitle: String!) {
    update_chats_chat_by_pk(
      pk_columns: { id: $id }
      _set: { title: $newTitle }
    ) {
      id
      title
    }
  }
`;

export const DELETE_CHAT = gql`
  mutation Delete_Chat($id: uuid!) {
    delete_chats_chat_by_pk(id: $id) {
      id
    }
  }
`;

// Subscriptions
export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription Sub_MessageList($chatId: uuid = "") {
    chats_message(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      content
      created_at
      message_type
      metadata
    }
  }
`;
