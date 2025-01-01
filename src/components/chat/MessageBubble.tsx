import React from 'react';
import {ListItem, ListItemText, Paper, useTheme} from '@mui/material';
import {Theme} from '@mui/material/styles';
import {Message} from './ChatTypes';

interface MessageBubbleProps {
    message: Message;
}

const getMessageStyle = (sender: Message['sender'], theme: Theme) => {
    const styles = {
        user: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        system: {
            backgroundColor: theme.palette.mode === 'light'
                ? 'rgba(25, 118, 210, 0.08)'
                : 'rgba(52, 130, 246, 0.12)',
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.mode === 'light'
                ? 'rgba(25, 118, 210, 0.12)'
                : 'rgba(52, 130, 246, 0.2)'}`,
        },
        notification: {
            backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[900],
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.mode === 'light'
                ? theme.palette.grey[300]
                : theme.palette.grey[800]}`
        },
    };

    return styles[sender] || styles.system;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({message}) => {
    const theme = useTheme();
    const messageStyle = getMessageStyle(message.sender, theme);

    return (
        <ListItem
            sx={{
                flexDirection: 'column',
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
            }}
        >
            <Paper
                elevation={message.sender === 'user' ? 2 : 0}
                sx={{
                    p: 1.5,
                    ...messageStyle,
                    maxWidth: '80%',
                    borderRadius: 2,
                }}
            >
                <ListItemText
                    primary={message.text}
                    secondary={message.timestamp.toLocaleTimeString()}
                    slotProps={{
                        secondary: {
                            sx: {
                                color: message.sender === 'user'
                                    ? 'inherit'
                                    : theme.palette.mode === 'light'
                                        ? 'text.secondary'
                                        : 'grey.400',
                                fontSize: '0.75rem',
                            }
                        }
                    }}
                    sx={{m: 0}}
                />
            </Paper>
        </ListItem>
    );
};