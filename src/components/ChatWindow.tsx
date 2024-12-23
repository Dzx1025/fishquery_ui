// components/ChatWindow.tsx
'use client';

import React, {useState, useRef, useEffect} from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Fab,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import {
    Chat as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import {useAuth} from '@/contexts/AuthContext';
import {useQuery, useMutation, useSubscription} from '@apollo/client';
import {GET_CHAT, CREATE_CHAT_BY_UUID, SUB_MESSAGE} from '@/graphql/queries';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'system' | 'notification';
    timestamp: Date;
}

interface ChatMessage {
    id: number;
    content: string;
    timestamp: string;
    message_type: string;
    conversation_id: number;
}

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {getAccessToken, isAuthenticated, getUserId} = useAuth();

    // Query existing chat only when authenticated
    const {data: chatData, loading: chatLoading, refetch} = useQuery(GET_CHAT, {
        skip: !isAuthenticated,
        onError: (error) => {
            console.error('Chat query error:', error);
        },
        onCompleted: (data) => {
            console.log('Chat query completed:', data);
        }
    });

    // Create new chat mutation
    const [createChat] = useMutation(CREATE_CHAT_BY_UUID);

    // Subscribe to messages
    const {loading: subLoading} = useSubscription(
        SUB_MESSAGE,
        {
            skip: !isAuthenticated,
            onData: ({data}) => {
                console.log('Subscription data received:', data);
                if (data?.data?.chat_message) {
                    const messages = data.data.chat_message
                        .filter((msg: ChatMessage) => msg.conversation_id === conversationId);

                    const formattedMessages = messages.map((msg: ChatMessage) => ({
                        id: msg.id,
                        text: msg.content,
                        sender: msg.message_type as 'user' | 'system' | 'notification',
                        timestamp: new Date(msg.timestamp)
                    }));
                    setMessages(formattedMessages);
                    setIsSending(false);  // Reset sending state when new message received
                }
            }
        }
    );

    // Initialize chat session when authenticated
    useEffect(() => {
        const initChat = async () => {
            if (!isAuthenticated || chatLoading) return;

            if (chatData?.chat_conversation?.length > 0) {
                const conv_id = chatData.chat_conversation[0].id;
                console.log('Found existing conversation:', conv_id);
                setConversationId(conv_id);
                return;
            }

            if (chatData?.chat_conversation?.length === 0) {
                try {
                    const userId = getUserId();
                    if (!userId) {
                        console.error('No user ID available');
                        return;
                    }

                    console.log('Creating new chat for user:', userId);
                    const result = await createChat({
                        variables: {uuid: userId},
                    });

                    if (result.data?.insert_chat_conversation_one?.user_id) {
                        const chatResult = await refetch();
                        if (chatResult.data?.chat_conversation?.length > 0) {
                            const new_conv_id = chatResult.data.chat_conversation[0].id;
                            console.log('Created new conversation:', new_conv_id);
                            setConversationId(new_conv_id);
                        }
                    }
                } catch (error) {
                    console.error('Error creating chat:', error);
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: 'Error creating chat session. Please try again later.',
                        sender: 'notification',
                        timestamp: new Date()
                    }]);
                }
            }
        };

        initChat();
    }, [isAuthenticated, chatData, chatLoading, createChat, refetch, getUserId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !conversationId || !isAuthenticated) return;

        const currentMessage = newMessage;
        setNewMessage('');
        setIsSending(true);

        try {
            const accessToken = getAccessToken();
            const response = await fetch(`${DJANGO_API_URL}/chat/conversations/${conversationId}/ask/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({question: currentMessage})
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Chat error:', errorText);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: 'Failed to send message. Please try again.',
                    sender: 'notification',
                    timestamp: new Date()
                }]);
                setIsSending(false);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: 'Network error. Please check your connection.',
                sender: 'notification',
                timestamp: new Date()
            }]);
            setIsSending(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const getMessageBackgroundColor = (sender: Message['sender']) => {
        switch (sender) {
            case 'user':
                return 'primary.main';
            case 'system':
                return 'white';
            case 'notification':
                return 'grey.300';
            default:
                return 'white';
        }
    };

    const getMessageTextColor = (sender: Message['sender']) => {
        switch (sender) {
            case 'user':
                return 'white';
            case 'system':
            case 'notification':
                return 'text.primary';
            default:
                return 'text.primary';
        }
    };

    const renderChatContent = () => {
        if (!isAuthenticated) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        p: 2,
                        textAlign: 'center'
                    }}
                >
                    <LoginIcon sx={{fontSize: 48, mb: 2, color: 'primary.main'}}/>
                    <Typography variant="h6" gutterBottom>
                        Please Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Login to access the chat functionality
                    </Typography>
                </Box>
            );
        }

        if (chatLoading) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        p: 2
                    }}
                >
                    <CircularProgress size={40} sx={{mb: 2}}/>
                    <Typography color="text.secondary">
                        Initializing chat...
                    </Typography>
                </Box>
            );
        }

        return (
            <>
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 2,
                    backgroundColor: 'grey.100'
                }}>
                    {subLoading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <CircularProgress size={30}/>
                            <Typography color="text.secondary" sx={{ml: 2}}>
                                Loading messages...
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {messages.map((message) => (
                                <ListItem
                                    key={message.id}
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                        mb: 1
                                    }}
                                >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 1.5,
                                            backgroundColor: getMessageBackgroundColor(message.sender),
                                            color: getMessageTextColor(message.sender),
                                            maxWidth: '80%',
                                            borderRadius: 2
                                        }}
                                    >
                                        <ListItemText
                                            primary={message.text}
                                            secondary={message.timestamp.toLocaleTimeString()}
                                            secondaryTypographyProps={{
                                                color: message.sender === 'user' ? 'white' : undefined,
                                                fontSize: '0.75rem'
                                            }}
                                            sx={{m: 0}}
                                        />
                                    </Paper>
                                </ListItem>
                            ))}
                            {isSending && (
                                <ListItem
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        mb: 1
                                    }}
                                >
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 1.5,
                                            backgroundColor: 'white',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CircularProgress size={20} sx={{mr: 1}}/>
                                        <Typography color="text.secondary">
                                            Processing...
                                        </Typography>
                                    </Paper>
                                </ListItem>
                            )}
                            <div ref={messagesEndRef}/>
                        </List>
                    )}
                </Box>

                <Box sx={{
                    p: 2,
                    backgroundColor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider'
                }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        variant="outlined"
                        size="small"
                        disabled={isSending}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={handleSend}
                                    color="primary"
                                    disabled={isSending}
                                >
                                    {isSending ? <CircularProgress size={24}/> : <SendIcon/>}
                                </IconButton>
                            )
                        }}
                    />
                </Box>
            </>
        );
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: isOpen ? 'none' : 'flex',
                    zIndex: 1000,
                    boxShadow: 3
                }}
                onClick={() => setIsOpen(true)}
            >
                <ChatIcon/>
            </Fab>

            <Paper
                elevation={6}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    width: 360,
                    height: 500,
                    display: isOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 1000,
                    borderRadius: 2
                }}
            >
                <Box sx={{
                    p: 2,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" sx={{fontWeight: 500}}>
                        Chat Assistant
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={() => setIsOpen(false)}
                        size="small"
                        sx={{'&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.1)'}}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>

                {renderChatContent()}
            </Paper>
        </>
    );
}