// src/graphql/queries.ts
import {gql} from '@apollo/client';


export const GET_CHAT = gql`
    query GetChatList {
        chat_conversation {
            id
            created_at
            user_id
        }
    }
`;

export const CREATE_CHAT_BY_UUID = gql`
    mutation CreateChatByUuid($uuid: Int!) {
        insert_chat_conversation_one(object: {user_id: $uuid}) {
            user_id
        }
    }
`;

export const CLEAR_CHAT_BY_UUID = gql`
    mutation ClearChat($uuid: Int!) {
        delete_chat_conversation(where: {user_id: {_eq: $uuid}}) {
            affected_rows
        }
    }
`;

export const SUB_MESSAGE = gql`
    subscription SubMessage {
        chat_message {
            id
            content
            timestamp
            message_type
            conversation_id
        }
    }
`;
