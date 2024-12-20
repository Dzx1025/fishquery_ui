import {gql} from '@apollo/client';

export const SUB_CHAT_BY_UUID = gql`
  subscription SubChatByUuid($uuid: String!) {
    chat(where: { uuid: { _eq: $uuid } }) {
      messages {
        id
        content
        sender
        timestamp
      }
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation CreateChat {
    createChat {
      uuid
    }
  }
`;

export const UPDATE_CHAT_BY_UUID = gql`
  mutation UpdateChatByUuid($uuid: String!, $message: String!) {
    updateChat(where: { uuid: { _eq: $uuid } }, _set: { 
      messages: { data: { content: $message, sender: "user" } }
    }) {
      uuid
    }
  }
`;
