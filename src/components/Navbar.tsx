'use client';

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack
} from '@mui/material';
import {useAuth} from '@/contexts/AuthContext';
import Link from 'next/link';
import LoginDialog from '@/components/LoginDialog';
import {useState} from 'react';
import {usePathname} from 'next/navigation';

export default function Navbar() {
    const {isAuthenticated, logout} = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const pathname = usePathname();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 0, mr: 4}}>
                    My App
                </Typography>
                <Stack direction="row" spacing={2} sx={{flexGrow: 1}}>
                    <Button
                        color="inherit"
                        component={Link}
                        href="/rules-query"
                        sx={{
                            textTransform: 'none',
                            fontWeight: pathname === '/rules-query' ? 'bold' : 'normal',
                            borderBottom: pathname === '/rules-query' ? '2px solid white' : 'none'
                        }}
                    >
                        Rules Query
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        href="/species-lookup"
                        sx={{
                            textTransform: 'none',
                            fontWeight: pathname === '/species-lookup' ? 'bold' : 'normal',
                            borderBottom: pathname === '/species-lookup' ? '2px solid white' : 'none'
                        }}
                    >
                        Species Lookup
                    </Button>
                </Stack>
                {isAuthenticated ? (
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                ) : (
                    <Button color="inherit" onClick={() => setLoginOpen(true)}>
                        Login
                    </Button>
                )}
            </Toolbar>
            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)}/>
        </AppBar>
    );
}