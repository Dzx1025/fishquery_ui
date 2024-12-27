import type {Metadata} from 'next';
import Providers from '@/app/providers';
import {Box} from '@mui/material';
import React, {Suspense} from 'react';

export const metadata: Metadata = {
    title: 'Fish Query',
    description: 'Chat for Fishing Rules Query',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body suppressHydrationWarning>
        <Suspense fallback={<div>Loading...</div>}>
            <Providers>
                <Box component="main">
                    {children}
                </Box>
            </Providers>
        </Suspense>
        </body>
        </html>
    );
}