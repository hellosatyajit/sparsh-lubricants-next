import { SidebarInset } from './ui/sidebar';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {}

export function AppContent({ children, ...props }: AppContentProps) {
    return <SidebarInset {...props}>{children}</SidebarInset>;
}
