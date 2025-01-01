'use client';

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    Box,
    Container,
    IconButton,
    useTheme as useMuiTheme,
} from '@mui/material';
import {useAuth} from '@/contexts/AuthContext';
import Link from 'next/link';
import LoginDialog from '@/components/LoginDialog';
import {useState} from 'react';
import {usePathname} from 'next/navigation';
import FishingIcon from '@mui/icons-material/Phishing';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useTheme} from '@/contexts/ThemeContext';

export default function Navbar() {
    const {isAuthenticated, logout} = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const pathname = usePathname();
    const {mode, toggleColorMode} = useTheme();
    const muiTheme = useMuiTheme();

    const navButtonStyle = (isActive: boolean) => ({
        textTransform: 'none',
        px: 3,
        py: 2,
        fontSize: '1rem',
        fontWeight: isActive ? 600 : 400,
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            backgroundColor: muiTheme.palette.primary.contrastText,
            transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.2s ease-in-out',
        },
        '&:hover::after': {
            transform: 'scaleX(1)',
        },
    });

    const authButtonStyle = {
        bgcolor: 'primary.dark',
        px: 3,
        py: 1,
        borderRadius: 2,
        '&:hover': {
            bgcolor: 'primary.dark',
            opacity: 0.9,
            transform: 'scale(1.05)',
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    const logoLinkStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
            opacity: 0.9,
        },
        transition: 'opacity 0.2s ease-in-out',
    };

    return (
        <AppBar position="static">
            <Container maxWidth="lg">
                <Toolbar sx={{
                    minHeight: 70,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 4,
                }}>
                    {/* Logo Section */}
                    <Box
                        component={Link}
                        href="/"
                        sx={logoLinkStyle}
                    >
                        <FishingIcon sx={{fontSize: 32}}/>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                display: {xs: 'none', sm: 'block'}
                            }}
                        >
                            Fish Query
                        </Typography>
                    </Box>

                    {/* Navigation Links */}
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            flex: 1,
                            justifyContent: 'center',
                            maxWidth: 500,
                        }}
                    >
                        <Button
                            color="inherit"
                            component={Link}
                            href="/rules-query"
                            sx={navButtonStyle(pathname === '/rules-query')}
                        >
                            Rules Query
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            href="/species-lookup"
                            sx={navButtonStyle(pathname === '/species-lookup')}
                        >
                            Species Lookup
                        </Button>
                    </Stack>

                    {/* Right Section: Theme Toggle & Auth */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}>
                        <IconButton
                            onClick={toggleColorMode}
                            color="inherit"
                            sx={{ml: 1}}
                        >
                            {mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                        </IconButton>

                        <Button
                            color="inherit"
                            onClick={isAuthenticated ? logout : () => setLoginOpen(true)}
                            sx={authButtonStyle}
                        >
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)}/>
        </AppBar>
    );
}