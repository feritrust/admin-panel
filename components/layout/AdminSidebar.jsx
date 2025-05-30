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
        {/* User Management Collapsible */}
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
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        {/* 📊 Statistics Item */}
        <SidebarMenuItem>
          <Link href="/admin/statistics">
  <SidebarMenuButton
    className={
      pathname === '/admin/statistics' ? 'bg-muted font-semibold' : ''
    }
  >
    📊 Statistics
  </SidebarMenuButton>
</Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}
