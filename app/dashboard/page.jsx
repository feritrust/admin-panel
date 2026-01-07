'use client';

import { useAdminMe } from '@/lib/hooks/useAdminMe';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { logoutAdmin, sendBroadcast } from '@/lib/api/admin';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data, isError, isLoading } = useAdminMe();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

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

  const handleSend = async () => {
    if (!message.trim()) {
      toast.warning('Please enter a message');
      return;
    }
    setSending(true);
    try {
      const res = await sendBroadcast(message);
      toast.success(`Sent to ${res.sent}/${res.total} users`);
      setMessage('');
    } catch (err) {
      toast.error('Failed to send broadcast');
    }
    setSending(false);
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Welcome Admin 🎉</h1>
      <p>ID: {data.id}</p>
      <p>Role: {data.role}</p>

      <Button onClick={handleLogout} variant="destructive">
        Logout
      </Button>

      <div className="pt-6 space-y-3">
        <h2 className="font-semibold">📢 Send Broadcast to All Users </h2>
        <Input
          placeholder="Your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send Notification'}
        </Button>
      </div>
    </div>
  );
}
