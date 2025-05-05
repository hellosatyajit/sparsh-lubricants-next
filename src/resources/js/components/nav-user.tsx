'use client';

import { SidebarMenu, SidebarMenuItem } from '../components/ui/sidebar';
import { useMobileNavigation } from '../hooks/use-mobile-navigation';
import { LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
}

export function NavUser() {
  const cleanup = useMobileNavigation();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Replace with real auth loading logic, e.g., from context or API
    const storedUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };
    setUser(storedUser);
  }, []);

  const handleLogout = async () => {
    cleanup();
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem className="space-y-2">
        <Button variant="outline" asChild>
          <Link
            href="/settings"
            className="h-auto w-full flex items-center gap-2 text-left text-sm"
          >
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </Link>
        </Button>

        <Button variant="destructive" onClick={handleLogout} className="w-full flex items-center">
          <LogOutIcon className="mr-2" />
          Log out
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
