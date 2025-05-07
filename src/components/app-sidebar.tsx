'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { type NavItem } from '../types';
import {
  BriefcaseBusiness,
  CreditCard,
  FileText,
  LayoutGrid,
  MessagesSquare,
  Package,
  ReceiptIndianRupee,
  ShieldCheck,
} from 'lucide-react';
import AppLogo from './app-logo';
import { useSession } from 'next-auth/react';

export function AppSidebar() {
  // Replace this hook with your real auth/context provider
  const { data: session } = useSession();

  const mainNavItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
      { title: 'Inquiries', href: '/inquiries', icon: MessagesSquare },
      { title: 'Clients', href: '/clients', icon: BriefcaseBusiness },
      { title: 'Products', href: '/products', icon: Package },
      { title: 'Quotations', href: '/quotations', icon: FileText },
      { title: 'Invoices', href: '/invoices', icon: ReceiptIndianRupee },
      { title: 'Payments', href: '/payments', icon: CreditCard },
    ];

    // @ts-ignore
    if (session?.user?.type === 'Admin') {
      items.push({
        title: 'Admin',
        href: '/admin',
        icon: ShieldCheck,
      });
    }

    return items;
  }, [session]);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        {
          session?.user && <NavUser user={session.user as {
            id: string;
            name: string;
            email: string;
            type: string;
          }} />
        }
      </SidebarFooter>
    </Sidebar>
  );
}
