'use client'

import { SidebarProvider } from '../components/ui/sidebar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AppShellProps {
    children: React.ReactNode;
    defaultOpen?: boolean; // Now passed as prop instead of from Inertia
}

export function AppShell({ children, defaultOpen = true }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(defaultOpen);
    const pathname = usePathname();

    // Optional: Sync state with localStorage
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
            value={{
                isOpen: sidebarOpen,
                toggle: () => setSidebarOpen(!sidebarOpen),
                setOpen: setSidebarOpen
            }}
        >
            {children}
        </SidebarProvider>
    );
}