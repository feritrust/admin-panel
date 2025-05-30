'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserChats } from '@/lib/api/admin';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function UserChatsPage({ params }) {
  const { telegramId } = params;

  const {
    data: chats = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['userChats', telegramId],
    queryFn: () => fetchUserChats(telegramId).then(res => res.data),
  });

  if (isLoading) return <p>Loading chats...</p>;
  if (isError) {
    console.error('❌ Error fetching chats:', error);
    return <p className="text-red-500">Error loading chats.</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Chats of user {telegramId}</h1>
      {chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        chats.map((chat) => {
          const otherId =
            chat.fromTelegramId === telegramId
              ? chat.toTelegramId
              : chat.fromTelegramId;

          return (
            <Link
              key={chat.id}
              href={`/admin/users/${telegramId}/chats/${otherId}`}
            >
              <Card className="mb-2 p-4 hover:bg-gray-100 cursor-pointer transition">
                <p><b>From:</b> {chat.fromUser?.username || chat.fromTelegramId}</p>
                <p><b>To:</b> {chat.toUser?.username || chat.toTelegramId}</p>
                <p><b>Content:</b> {chat.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(chat.createdAt).toLocaleString()}
                </p>
              </Card>
            </Link>
          );
        })
      )}
    </div>
  );
}
