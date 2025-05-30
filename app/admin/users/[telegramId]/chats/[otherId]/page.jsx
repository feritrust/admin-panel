'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMessagesBetween } from '@/lib/api/admin'; // ← حالا این از api/admin میاد
import { Card } from '@/components/ui/card';

export default function ChatMessagesPage({ params }) {
  const { telegramId, otherId } = params;

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['chatMessages', telegramId, otherId],
    queryFn: () => fetchMessagesBetween(telegramId, otherId),
  });

  const messages = data?.items || [];

  if (isLoading) return <p>Loading messages...</p>;
  if (isError) return <p className="text-red-500">Error loading messages.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        Chat between {telegramId} & {otherId}
      </h1>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        [...messages].reverse().map((msg) => (
          <Card key={msg.id} className="mb-2 p-4">
            <p><b>From:</b> {msg.fromTelegramId}</p>
            <p className="whitespace-pre-wrap">
              <b>Content:</b> {msg.content}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </Card>
        ))
      )}
    </div>
  );
}
