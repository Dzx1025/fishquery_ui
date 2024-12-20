import type {Metadata} from 'next';
import Providers from '@/app/providers';
import {Box} from '@mui/material';
import {Suspense} from 'react';

export const metadata: Metadata = {
    title: 'Next.js App with MUI',
    description: 'Next.js 14 app with Material-UI and authentication',
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