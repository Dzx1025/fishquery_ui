import React from 'react';
import {Box, CircularProgress, IconButton, TextField} from '@mui/material';
import {Send as SendIcon} from '@mui/icons-material';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isSending: boolean;
    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
                                                        value,
                                                        onChange,
                                                        onSend,
                                                        isSending,
                                                        disabled = false,
                                                    }) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSend();
        }
    };

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
            }}
        >
            <TextField
                fullWidth
                multiline
                maxRows={4}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                variant="outlined"
                size="small"
                disabled={disabled || isSending}
                slotProps={{
                    input: {
                        sx: {
                            pr: '48px', // Make room for the send button
                        }
                    }
                }}
                InputProps={{
                    endAdornment: (
                        <IconButton
                            onClick={onSend}
                            color="primary"
                            disabled={disabled || isSending}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                        >
                            {isSending ? (
                                <CircularProgress size={24}/>
                            ) : (
                                <SendIcon/>
                            )}
                        </IconButton>
                    )
                }}
            />
        </Box>
    );
};