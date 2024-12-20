'use client';

import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';

interface ClientWrapperProps {
    children: React.ReactNode;
}

export default function ClientWrapper({children}: ClientWrapperProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return <Box>{children}</Box>;
}