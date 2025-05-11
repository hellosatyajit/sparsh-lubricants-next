'use client'

import { SidebarProvider } from './ui/sidebar';
import { useState, useEffect } from 'react';

interface AppShellProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function AppShell({ children, defaultOpen = true }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(defaultOpen);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarOpen');
        if (savedState) {
            setSidebarOpen(savedState === 'true');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarOpen', String(sidebarOpen));
    }, [sidebarOpen]);

    return (
        <SidebarProvider 
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
        >
            {children}
        </SidebarProvider>
    );
}