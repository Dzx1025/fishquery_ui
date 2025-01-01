'use client';

import {Box} from '@mui/material';
import dynamic from 'next/dynamic';
import ClientWrapper from './ClientWrapper';

const PDFViewer = dynamic(() => import('./PDFViewer'), {
    ssr: false,
    loading: () => <div>Loading PDF viewer...</div>
});

const ChatWindow = dynamic(() => import('./chat/ChatWindow'), {
    ssr: false,
    loading: () => <div>Loading chat...</div>
});

export default function RulesQueryContent() {
    return (
        <ClientWrapper>
            <Box sx={{position: 'relative', height: 'calc(100vh - 64px)'}}>
                <PDFViewer pdfPath="/rules.pdf"/>
                <ChatWindow/>
            </Box>
        </ClientWrapper>
    );
}