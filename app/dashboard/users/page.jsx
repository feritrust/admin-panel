'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card } from '@/components/ui/card';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = Cookies.get('admin_token');

    axios
      .get('https://api.airlayer.space/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // هندل اگر data مستقیم نبود
        const data = Array.isArray(res.data) ? res.data : res.data.users;
        setUsers(data || []);
      })
      .catch((err) => {
        console.error('❌ Error fetching users:', err);
        setUsers([]); // fallback برای جلوگیری از map error
      });
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">All Users</h1>
      {users.map((user) => (
        <Card key={user.telegramId || user.id} className="p-4">
          <div className="font-semibold">{user.username || 'No Username'}</div>
          <div className="text-sm text-gray-500">
            {user.country}, {user.city} - {user.gender}
          </div>
        </Card>
      ))}
    </div>
  );
}
