'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <p>Welcome to the admin panel 🎉</p>
    </div>
  );
}
