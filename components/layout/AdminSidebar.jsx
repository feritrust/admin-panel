'use client';

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="hidden md:flex">
      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className={
                  pathname.startsWith('/dashboard')
                    ? 'bg-muted font-semibold'
                    : ''
                }
              >
                User Management
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <Link
                    href="/dashboard/users"
                    className={
                      pathname === '/dashboard/users' ? 'font-semibold' : ''
                    }
                  >
                    All Users
                  </Link>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <Link
                    href="/dashboard/blocklist"
                    className={
                      pathname === '/dashboard/blocklist'
                        ? 'font-semibold'
                        : ''
                    }
                  >
                    Blocked Users
                  </Link>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </Sidebar>
  );
}
