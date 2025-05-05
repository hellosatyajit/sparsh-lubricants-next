'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/use-auth'; // You’ll need to create this or use context
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../components/ui/sidebar';
import { NavMain } from '../components/nav-main';
import { NavUser } from '../components/nav-user';
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

export function AppSidebar() {
  // Replace this hook with your real auth/context provider
  const { user } = useAuth(); // Assume user = { id, name, email, role }

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

    if (user?.role === 'admin') {
      items.push({
        title: 'Admin',
        href: '/admin',
        icon: ShieldCheck,
      });
    }

    return items;
  }, [user]);

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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
