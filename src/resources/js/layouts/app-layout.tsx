import { type ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    cta?: ReactNode;
}

export default ({ children, breadcrumbs, cta }: AppLayoutProps) => (
    <AppShell>
        <AppSidebar />
        <AppContent>
            <AppSidebarHeader breadcrumbs={breadcrumbs} cta={cta} />
            {children}
        </AppContent>
    </AppShell>
);
