'use client';

import {useState, useRef, useEffect} from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Fab,
    Collapse,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import {Chat as ChatIcon, Close as CloseIcon, Send as SendIcon} from '@mui/icons-material';
import {useAuth} from '@/contexts/AuthContext';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {getAccessToken} = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        try {
            const accessToken = getAccessToken();
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({message: newMessage})
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage: Message = {
                    id: Date.now() + 1,
                    text: data.response,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            console.error('Chat error:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: isOpen ? 'none' : 'flex'
                }}
                onClick={() => setIsOpen(true)}
            >
                <ChatIcon/>
            </Fab>

            {/* Chat Window */}
            <Paper
                elevation={3}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    width: 360,
                    height: 500,
                    display: isOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {/* Chat Header */}
                <Box
                    sx={{
                        p: 2,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6">Chat Assistant</Typography>
                    <IconButton color="inherit" onClick={() => setIsOpen(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Box>

                {/* Messages Area */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 2,
                        backgroundColor: 'grey.100'
                    }}
                >
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
                                    sx={{
                                        p: 1,
                                        backgroundColor: message.sender === 'user' ? 'primary.main' : 'white',
                                        color: message.sender === 'user' ? 'white' : 'text.primary',
                                        maxWidth: '80%'
                                    }}
                                >
                                    <ListItemText
                                        primary={message.text}
                                        secondary={message.timestamp.toLocaleTimeString()}
                                        secondaryTypographyProps={{
                                            color: message.sender === 'user' ? 'white' : undefined,
                                            fontSize: '0.75rem'
                                        }}
                                    />
                                </Paper>
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef}/>
                    </List>
                </Box>

                {/* Input Area */}
                <Box sx={{p: 2, backgroundColor: 'background.paper'}}>
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
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleSend} color="primary">
                                    <SendIcon/>
                                </IconButton>
                            )
                        }}
                    />
                </Box>
            </Paper>
        </>
    );
}