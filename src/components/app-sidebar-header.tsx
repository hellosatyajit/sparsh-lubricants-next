import { Breadcrumbs } from './breadcrumbs';
import { SidebarTrigger } from './ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '../types';
import { ReactNode } from 'react';

export function AppSidebarHeader({ breadcrumbs = [], cta }: { breadcrumbs?: BreadcrumbItemType[]; cta?: ReactNode }) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 justify-between">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {cta}
        </header>
    );
}
