'use client';

import { useState } from 'react';
import { loginAdmin } from '@/lib/api/admin';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(email, password);
      console.log("✅ Login success, redirecting...");
      router.push('/dashboard');
    } catch (err) {
      setError('❌ Login failed');
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Simple Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input className="w-full p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full p-2 border" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="bg-black text-white px-4 py-2" type="submit">Login</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
