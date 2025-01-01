// app/providers.tsx
'use client';

import {ThemeProvider} from '@/contexts/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {StyledEngineProvider} from '@mui/material/styles';
import {ApolloProvider} from '@apollo/client';
import client from '@/lib/apollo-client';
import React from "react";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={client}>
            <StyledEngineProvider injectFirst>
                <AppRouterCacheProvider>
                    <ThemeProvider>
                        <CssBaseline/>
                        {children}
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </StyledEngineProvider>
        </ApolloProvider>
    );
}