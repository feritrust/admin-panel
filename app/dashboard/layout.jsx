'use client';

import AdminSidebar from '@/components/layout/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
