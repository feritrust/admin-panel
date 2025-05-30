'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminUsers, addCoins } from '@/lib/api/admin';
import { countries, getProvinces } from '@/lib/countries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFriends, setShowFriends] = useState(false);
  const [coinToAdd, setCoinToAdd] = useState('');
  const [filters, setFilters] = useState({ country: '', city: '', gender: '' });
  const queryClient = useQueryClient();
  const router = useRouter();
  const pageSize = 20;

  const cities = filters.country ? getProvinces(filters.country) : [];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminUsers', page, search, filters],
    queryFn: () =>
      fetchAdminUsers({
        page,
        search,
        gender: filters.gender,
        country: filters.country,
        city: filters.city,
      }),
    keepPreviousData: true,
  });

  const addCoinsMutation = useMutation({
    mutationFn: ({ telegramId, amount }) => addCoins(telegramId, amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminUsers']);
      if (selectedUser) {
        setSelectedUser((prev) => ({
          ...prev,
          coins: data.coins,
        }));
      }
      setCoinToAdd('');
    },
    onError: () => {
      alert('Error adding coins');
    },
  });

  const handleSearch = () => {
    setPage(1);
    setSearch(tempSearch.trim());
    setSelectedUser(null);
    setShowFriends(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'country' ? { city: '' } : {}),
    }));
  };

  const onSelectUser = (user) => {
    setSelectedUser(user);
    setShowFriends(false);
  };

  const handleAddCoins = () => {
    const amount = parseInt(coinToAdd, 10);
    if (!selectedUser || isNaN(amount) || amount <= 0 || amount > 1_000_000) {
      alert('Please enter a valid positive number less than 1,000,000');
      return;
    }
    addCoinsMutation.mutate({ telegramId: selectedUser.telegramId, amount });
  };

  const goToChats = () => {
    if (selectedUser) {
      router.push(`/admin/users/${selectedUser.telegramId}/chats`);
    }
  };

  const users = data?.[0] || [];
  const total = data?.[1] || 0;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">User List</h1>

      {/* فیلترها */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search by username"
          value={tempSearch}
          onChange={(e) => setTempSearch(e.target.value)}
          className="min-w-[180px]"
        />
        <select
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select
          name="country"
          value={filters.country}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          disabled={!cities.length}
          className="border p-2 rounded"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading users</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500">No users found</p>
      ) : (
        <>
          {users.map((user) => (
            <Card
              key={user.telegramId || user.id}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedUser?.telegramId === user.telegramId ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => onSelectUser(user)}
            >
              <p className="font-semibold">{user.username || 'No Username'}</p>
              <p className="text-sm text-gray-500">
                {user.country || 'N/A'}, {user.city || 'N/A'} - {user.gender || 'N/A'}
              </p>
              <p className="text-sm">
                Coins: <b>{user.coins ?? 0}</b> | Loyalty Points: <b>{user.loyaltyPoints ?? 0}</b>
              </p>
            </Card>
          ))}

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Prev
            </Button>
            <span className="px-2">
              Page {page} / {Math.ceil(total / pageSize)}
            </span>
            <Button onClick={() => setPage((p) => p + 1)} disabled={users.length < pageSize}>
              Next
            </Button>
          </div>
        </>
      )}

      {selectedUser && (
        <div className="mt-8 p-4 border rounded shadow bg-white">
          <h2 className="text-lg font-bold mb-2">User Details: {selectedUser.username}</h2>
          <p>Telegram ID: {selectedUser.telegramId}</p>
          <p>Coins: {selectedUser.coins ?? 0}</p>
          <p>Loyalty Points: {selectedUser.loyaltyPoints ?? 0}</p>

          <div className="mt-4 flex gap-2">
            <Input
              type="number"
              placeholder="Enter coins to add"
              value={coinToAdd}
              onChange={(e) => setCoinToAdd(e.target.value)}
              className="max-w-[120px]"
              min={1}
            />
            <Button onClick={handleAddCoins} disabled={addCoinsMutation.isLoading}>
              {addCoinsMutation.isLoading ? 'Adding...' : 'Add Coin'}
            </Button>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={goToChats}>Go to Full Chat Page</Button>
            <Button
              variant={showFriends ? 'secondary' : 'default'}
              onClick={() => setShowFriends((prev) => !prev)}
            >
              {showFriends ? 'Hide Friend List' : 'Show Friend List'}
            </Button>
          </div>

          {showFriends && (
            <div className="mt-4 p-2 border rounded bg-gray-50 max-h-64 overflow-auto">
              <p>Friend list for user (Placeholder):</p>
              <p>(هنوز پیاده‌سازی نشده)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
