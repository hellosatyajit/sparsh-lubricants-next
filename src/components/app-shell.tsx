'use client'

import { SidebarProvider } from './ui/sidebar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AppShellProps {
    children: React.ReactNode;
    defaultOpen?: boolean; // Now passed as prop instead of from Inertia
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