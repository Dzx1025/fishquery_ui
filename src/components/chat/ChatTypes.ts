export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'system' | 'notification';
    timestamp: Date;
}

export interface ChatMessage {
    id: number;
    content: string;
    timestamp: string;
    message_type: string;
    conversation_id: number;
}