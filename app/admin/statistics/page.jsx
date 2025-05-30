'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { fetchAdminStats } from '@/lib/api/admin';

const COLORS = ['#0EAD69', '#0098FF', '#FFC107'];

// نگاشت نام کشورها به کد ISO Alpha-2
const countryNameToCode = {
  'Italy': 'IT',
  'Morocco': 'MA',
  'United States of America': 'US',
  'France': 'FR',
  'Germany': 'DE',
  'Turkey': 'TR',
  'Iran': 'IR',
  'Sweden': 'SE',
  'Belgium': 'BE',
  'Austria': 'AT',
  'Australia': 'AU',
  'Mexico': 'MX',
  'Taiwan': 'TW',
  'Nepal': 'NP',
  'Japan': 'JP',
  'Canada': 'CA',
  'Brazil': 'BR',
  'Russian Federation': 'RU',
  'Iraq': 'IQ',
  'Yemen': 'YE',
  'Algeria': 'DZ',
  'Tunisia': 'TN',
  // ← فقط کشورهای پرکاربرد اضافه شده‌اند؛ برای همه کشورها می‌توان گسترش داد
};

function getFlagEmoji(countryName) {
  const code = countryNameToCode[countryName];
  if (!code) return '🏳️'; // fallback پرچم سفید
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

export default function StatisticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
  });

  if (isLoading) return <p>Loading stats...</p>;
  if (isError || !data) return <p className="text-red-500">Failed to load statistics</p>;

  const {
    totalUsers,
    usersPerCountry,
    dailyRegistrations,
    genderStats,
  } = data;

  const parsedGenderStats = genderStats.map((item) => ({
    ...item,
    count: Number(item.count),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">📈 Dashboard Statistics</h1>

      {/* Total Users */}
      <Card className="p-4">
        <p className="text-lg">Total Registered Users: <b>{totalUsers}</b></p>
      </Card>

      {/* Users Per Country */}
      <Card className="p-4">
        <h2 className="text-md font-semibold mb-2">Users Per Country</h2>
        <ul className="list-disc pl-6 space-y-1">
          {usersPerCountry.map((c) => (
            <li key={c.country}>
              {getFlagEmoji(c.country)} {c.country || 'Unknown'}: <b>{c.count}</b>
            </li>
          ))}
        </ul>
      </Card>

      {/* Daily Registrations Chart */}
      <Card className="p-4">
        <h2 className="text-md font-semibold mb-4">Daily Registrations (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyRegistrations}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0EAD69" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Gender Pie Chart */}
      <Card className="p-4">
        <h2 className="text-md font-semibold mb-4">Gender Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={parsedGenderStats}
              dataKey="count"
              nameKey="gender"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {parsedGenderStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
