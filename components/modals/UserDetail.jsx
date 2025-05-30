'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserDetails } from '@/lib/api/admin'; // فرض بر این که این فانکشن API getUserDetails داره
import { Dialog } from '@headlessui/react'; // یا هر کتابخانه مودال که استفاده می‌کنی
import { Button } from '@/components/ui/button';

export default function UserDetail({ user, onClose }) {
  // اگر کاربر خالی بود، هیچ چیزی نمایش نده
  if (!user) return null;

  // واکشی جزئیات کامل کاربر از API
  const { data, isLoading, isError } = useQuery(
    ['userDetails', user.telegramId],
    () => fetchUserDetails(user.telegramId),
    {
      enabled: !!user.telegramId, // فقط اگر telegramId بود اجرا کن
    }
  );

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Dialog.Panel className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
        <Dialog.Title className="text-xl font-bold mb-4 flex justify-between items-center">
          User Details
          <Button onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>
        </Dialog.Title>

        {isLoading && <p>Loading details...</p>}
        {isError && <p className="text-red-500">Failed to load user details.</p>}

        {data && (
          <>
            {/* اطلاعات اصلی کاربر */}
            <div className="mb-4">
              <p><strong>Username:</strong> {data.user.username}</p>
              <p><strong>Telegram ID:</strong> {data.user.telegramId}</p>
              <p><strong>Coins:</strong> {data.user.coins}</p>
              <p><strong>Loyalty Points:</strong> {data.user.loyaltyPoints}</p>
            </div>

            {/* کاربران دعوت شده */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Referred Users:</h3>
              {data.referredUsers.length > 0 ? (
                <ul className="list-disc list-inside max-h-32 overflow-y-auto border p-2 rounded">
                  {data.referredUsers.map((u) => (
                    <li key={u.telegramId}>
                      {u.username} (ID: {u.telegramId})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No referred users.</p>
              )}
            </div>

            {/* لیست چت‌ها */}
            <div>
              <h3 className="font-semibold mb-2">Chats:</h3>
              {data.chats.length > 0 ? (
                <ul className="max-h-40 overflow-y-auto border p-2 rounded space-y-2">
                  {data.chats.map((msg) => (
                    <li key={msg.id} className="border-b pb-1">
                      <p>
                        <strong>From:</strong> {msg.fromUser?.username || msg.fromTelegramId}
                        {' '}→{' '}
                        <strong>To:</strong> {msg.toUser?.username || msg.toTelegramId}
                      </p>
                      <p>{msg.content}</p>
                      <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No chats found.</p>
              )}
            </div>
          </>
        )}
      </Dialog.Panel>
    </Dialog>
  );
}
