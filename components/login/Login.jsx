'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api/admin';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(email, password);
      console.log('✅ Login successful, redirecting...');
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] p-6">
        <CardContent className="space-y-4">
          <h1 className="text-xl font-semibold text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" type="submit">
              Login
            </Button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
