'use client';

import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {StyledEngineProvider} from '@mui/material/styles';
import theme from '@/app/theme';
import React from "react";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <StyledEngineProvider injectFirst>
            <AppRouterCacheProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    {children}
                </ThemeProvider>
            </AppRouterCacheProvider>
        </StyledEngineProvider>
    );
}