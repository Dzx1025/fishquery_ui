// src/contexts/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '@/app/theme';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
    mode: PaletteMode;
    toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleColorMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<PaletteMode>('light');

    useEffect(() => {
        // Check system preference on mount
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setMode(mediaQuery.matches ? 'dark' : 'light');

        // Listen for system preference changes
        const handler = (e: MediaQueryListEvent) => {
            setMode(e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = React.useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
    <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        </MuiThemeProvider>
        </ThemeContext.Provider>
);
}