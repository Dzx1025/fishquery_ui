import { gql } from "@apollo/client";

export const GET_CHAT_LIST = gql`
  query Get_ChatList {
    chats_chat {
      id
      title
      created_at
      updated_at
    }
  }
`;

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

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription Sub_MessageList($chatId: uuid = "") {
    chats_message(where: { chat_id: { _eq: $chatId } }) {
      content
      created_at
      message_type
    }
  }
`;
