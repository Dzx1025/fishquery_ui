import {Roboto} from 'next/font/google';
import {createTheme, PaletteMode} from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

// Define color tokens
const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light' ? {
            // Light mode colors
            primary: {
                main: '#1976d2',
                light: '#42a5f5',
                dark: '#1565c0',
                contrastText: '#fff',
            },
            background: {
                default: '#fff',
                paper: '#fff',
            },
        } : {
            // Dark mode colors
            primary: {
                main: '#3482F6', // Brighter blue for dark mode
                light: '#60A5FA',
                dark: '#2563EB',
                contrastText: '#fff',
            },
            background: {
                default: '#0A1929', // Deep blue-gray
                paper: '#101F33', // Slightly lighter blue-gray
            },
        }),
    },
});

// Create a theme instance based on mode
export const createAppTheme = (mode: PaletteMode) => {
    const tokens = getDesignTokens(mode);

    return createTheme({
        ...tokens,
        typography: {
            fontFamily: roboto.style.fontFamily,
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundImage: mode === 'light'
                            ? 'linear-gradient(to right, #1976d2, #1565c0)'
                            : 'linear-gradient(to right, #2563EB, #1E40AF)', // Richer blue gradient for dark mode
                        boxShadow: mode === 'light'
                            ? '0 2px 4px -1px rgba(0,0,0,0.1)'
                            : '0 2px 4px -1px rgba(0,0,0,0.3)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        ...(mode === 'dark' && {
                            backgroundImage: 'none',
                        }),
                    },
                },
            },
        },
    });
};

// Default theme
export default createAppTheme('light');