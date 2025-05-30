'use client';

import { useAdminMe } from '@/lib/hooks/useAdminMe';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { logoutAdmin } from '@/lib/api/admin';

console.log('🚀 DashboardPage mounted');

export default function DashboardPage() {
  const { data, isError, isLoading } = useAdminMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isError) {
      console.warn('❌ Redirecting due to error');
      router.push('/login');
    }
  }, [isError, isLoading]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/login');
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Welcome Admin 🎉</h1>
      <p>ID: {data.id}</p>
      <p>Role: {data.role}</p>

      <Button onClick={handleLogout} variant="destructive">
        Logout
      </Button>
    </div>
  );
}
