'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Box, CircularProgress, Fab, IconButton, List, Paper, Typography,} from '@mui/material';
import {Chat as ChatIcon, Close as CloseIcon, Login as LoginIcon,} from '@mui/icons-material';
import {useAuth} from '@/contexts/AuthContext';
import {useMutation, useQuery, useSubscription} from '@apollo/client';
import {CREATE_CHAT_BY_UUID, GET_CHAT, SUB_MESSAGE} from '@/graphql/queries';
import {ChatMessage, Message} from './ChatTypes';
import {MessageBubble} from './MessageBubble';
import {ChatInput} from './ChatInput';
import {useTheme} from '@mui/material/styles';

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

const ChatWindow = () => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {getAccessToken, isAuthenticated, getUserId} = useAuth();

    // Query existing chat
    const {data: chatData, loading: chatLoading, refetch} = useQuery(GET_CHAT, {
        skip: !isAuthenticated,
        onError: (error) => {
            console.error('Chat query error:', error);
        },
        onCompleted: (data) => {
            console.log('Chat query completed:', data);
        },
    });

    // Create new chat mutation
    const [createChat] = useMutation(CREATE_CHAT_BY_UUID);

    // Subscribe to messages
    const {loading: subLoading} = useSubscription(SUB_MESSAGE, {
        skip: !isAuthenticated,
        onData: ({data}) => {
            if (data?.data?.chat_message) {
                const messages = data.data.chat_message.filter(
                    (msg: ChatMessage) => msg.conversation_id === conversationId
                );

                const formattedMessages = messages.map((msg: ChatMessage) => ({
                    id: msg.id,
                    text: msg.content,
                    sender: msg.message_type as 'user' | 'system' | 'notification',
                    timestamp: new Date(msg.timestamp),
                }));
                setMessages(formattedMessages);
                setIsSending(false);
            }
        },
    });

    // Initialize chat session
    useEffect(() => {
        const initChat = async () => {
            if (!isAuthenticated || chatLoading) return;

            if (chatData?.chat_conversation?.length > 0) {
                const conv_id = chatData.chat_conversation[0].id;
                setConversationId(conv_id);
                return;
            }

            if (chatData?.chat_conversation?.length === 0) {
                const userId = getUserId();
                if (!userId) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now(),
                            text: 'User ID not available. Please try logging in again.',
                            sender: 'notification',
                            timestamp: new Date(),
                        },
                    ]);
                    return;
                }

                try {
                    const result = await createChat({
                        variables: {uuid: userId},
                    });

                    if (!result.data?.insert_chat_conversation_one?.user_id) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: Date.now(),
                                text: 'Failed to create conversation',
                                sender: 'notification',
                                timestamp: new Date(),
                            },
                        ]);
                        return;
                    }

                    const chatResult = await refetch();
                    if (!chatResult.data?.chat_conversation?.length) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: Date.now(),
                                text: 'No conversation found after creation',
                                sender: 'notification',
                                timestamp: new Date(),
                            },
                        ]);
                        return;
                    }

                    const new_conv_id = chatResult.data.chat_conversation[0].id;
                    setConversationId(new_conv_id);

                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    console.error('Chat initialization error:', errorMessage);
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now(),
                            text: `Failed to initialize chat: ${errorMessage}`,
                            sender: 'notification',
                            timestamp: new Date(),
                        },
                    ]);
                }
            }
        };

        // Call initChat and handle any unexpected errors
        initChat().catch((error) => {
            console.error('Unhandled chat initialization error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: 'An unexpected error occurred. Please try again.',
                    sender: 'notification',
                    timestamp: new Date(),
                },
            ]);
        });

        // Cleanup function if needed
        return () => {
            // Any cleanup code here
        };
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
            const response = await fetch(
                `${DJANGO_API_URL}/chat/conversations/${conversationId}/ask/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({question: currentMessage}),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        text: `Failed to send message: ${errorText || 'Unknown error'}`,
                        sender: 'notification',
                        timestamp: new Date(),
                    },
                ]);
                setIsSending(false);
                return;
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    text: 'Network error. Please check your connection.',
                    sender: 'notification',
                    timestamp: new Date(),
                },
            ]);
            setIsSending(false);
        }
    };

    const renderLoginPrompt = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 2,
                textAlign: 'center',
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

    const renderLoadingState = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 2,
            }}
        >
            <CircularProgress size={40} sx={{mb: 2}}/>
            <Typography color="text.secondary">Initializing chat...</Typography>
        </Box>
    );

    const renderMessages = () => (
        <Box
            sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                backgroundColor: theme.palette.mode === 'light'
                    ? 'grey.100'
                    : 'background.default',
            }}
        >
            {subLoading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    gap: 2
                }}>
                    <CircularProgress size={20}/>
                    <Typography color="text.secondary">
                        Connecting to chat...
                    </Typography>
                </Box>
            ) : (
                <List>
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message}/>
                    ))}
                    {isSending && (
                        <MessageBubble
                            message={{
                                id: -1,
                                text: 'Processing...',
                                sender: 'system',
                                timestamp: new Date(),
                            }}
                        />
                    )}
                    <div ref={messagesEndRef}/>
                </List>
            )}
        </Box>
    );

    return (
        <>
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: isOpen ? 'none' : 'flex',
                    zIndex: 1300,
                    boxShadow: 3,
                }}
                onClick={() => setIsOpen(true)}
            >
                <ChatIcon/>
            </Fab>

            <Paper
                elevation={6}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    width: 360,
                    height: 600,
                    maxHeight: 'calc(100vh - 96px)',
                    display: isOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 1300,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
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

                {!isAuthenticated && renderLoginPrompt()}
                {isAuthenticated && chatLoading && renderLoadingState()}
                {isAuthenticated && !chatLoading && (
                    <>
                        {renderMessages()}
                        <ChatInput
                            value={newMessage}
                            onChange={setNewMessage}
                            onSend={handleSend}
                            isSending={isSending}
                        />
                    </>
                )}
            </Paper>
        </>
    );
};

export default ChatWindow;